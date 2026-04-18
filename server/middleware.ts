import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import helmet from "helmet";
import { randomUUID } from "crypto";
import { createApiResponseHardening, createBrowserApiGuard } from "./lib/request-hardening";
import { createRateLimitMiddleware } from "./services/rate-limit";

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
  app.set("trust proxy", true);

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
      skip: (req) => req.path === "/health",
    })
  );
  app.use("/api", express.json({ limit: "1mb" }));
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
        message: "An unexpected error occurred. Please contact support with the Request ID.",
        retryable: true,
      }
    });
  });
}
