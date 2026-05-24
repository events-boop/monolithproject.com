import type {
  Express,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import express from "express";
import helmet from "helmet";
import { randomUUID } from "crypto";
import compression from "compression";
import {
  createApiResponseHardening,
  createBrowserApiGuard,
} from "./lib/request-hardening";
import { shouldTrustForwardedHeaders } from "./lib/runtime-trust";
import { createRateLimitMiddleware } from "./services/rate-limit";
import { secureCompare } from "./lib/security";
import { logEvent } from "./lib/logging";

const apiCspDirectives = {
  defaultSrc: ["'none'"],
  scriptSrc: ["'none'"],
  styleSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'none'"],
  formAction: ["'none'"],
  frameAncestors: ["'none'"],
} as const;

export function configureMiddleware(app: Express) {
  app.set("trust proxy", shouldTrustForwardedHeaders());
  app.use(compression({ threshold: 0 }));

  // Keep the broad security headers globally, but let Netlify own the document
  // CSP. Express still serves JSON and redirects, and may serve HTML locally.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    "/api",
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: apiCspDirectives,
      },
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use("/api", createApiResponseHardening());
  app.use("/api", createBrowserApiGuard());
  app.use(
    "/api",
    createRateLimitMiddleware({
      scope: "api:global",
      windowMs: 15 * 60 * 1000,
      limit: 2000, // Scaled for 1000+ high-intensity testing
      message: "Monolith System Capacity Reached.",
      skip: req => req.path === "/health",
    })
  );

  // Webhook early authentication (pre-parser validation)
  app.use("/api", createWebhookAuthMiddleware());

  // Global body parser with verify hook to preserve raw body on webhooks
  app.use("/api", (req, res, next) => {
    const isWebhook = req.path.startsWith("/webhooks/");
    const limit = isWebhook
      ? "128kb"
      : req.path === "/leads" ||
          req.path === "/contact" ||
          req.path === "/booking-inquiry" ||
          req.path === "/ticket-intent"
        ? "24kb"
        : req.path === "/sponsor-access"
          ? "8kb"
          : "16kb";

    const options: any = { limit };
    if (isWebhook) {
      options.verify = (req: any, _res: any, buf: Buffer) => {
        req.rawBody = buf;
      };
    }

    return express.json(options)(req, res, next);
  });
}

export function createWebhookAuthMiddleware(): RequestHandler {
  return (req, res, next) => {
    if (req.path === "/webhooks/posh") {
      const requestId = randomUUID();
      const configuredSecret = process.env.POSH_WEBHOOK_SECRET?.trim();

      if (!configuredSecret) {
        logEvent("posh.webhook_unconfigured", { requestId });
        return res.status(503).json({
          ok: false,
          requestId,
          error: {
            code: "UNAVAILABLE",
            message: "Webhook handler is not configured.",
            retryable: false,
          },
        });
      }

      const providedSecret = req.header("Posh-Secret")?.trim();
      if (!providedSecret || !secureCompare(providedSecret, configuredSecret)) {
        logEvent("posh.webhook_denied", { requestId });
        return res.status(401).json({
          ok: false,
          requestId,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Webhook authorization failed.",
            retryable: false,
          },
        });
      }
    }
    next();
  };
}

export function configureErrorMiddleware(app: Express) {
  // 4. Global Error Boundary: SS-Tier Error Formatting
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const requestId = randomUUID();
    console.error(`[INTERNAL_ERROR] ${requestId}:`, err);

    res.status(500).json({
      ok: false,
      requestId,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected error occurred. Please contact support with the Request ID.",
        retryable: true,
      },
    });
  });
}
