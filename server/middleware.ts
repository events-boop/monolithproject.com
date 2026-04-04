import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import helmet from "helmet";
import { randomUUID } from "crypto";
import { createApiResponseHardening, createBrowserApiGuard } from "./lib/request-hardening";
import { createRateLimitMiddleware } from "./services/rate-limit";

export function configureMiddleware(app: Express) {
  app.set("trust proxy", true);

  // 1. Security: Hardened Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'", 
            "'unsafe-inline'", 
            "https://challenges.cloudflare.com", 
            "https://maps.googleapis.com",
            "https://t.contentsquare.net",
            "https://googletagmanager.com",
            "https://connect.facebook.net",
            "https://static.posthog.com"
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          imgSrc: [
            "'self'", 
            "data:", 
            "https://images.unsplash.com", 
            "https://maps.gstatic.com", 
            "https://maps.googleapis.com",
            "https://www.facebook.com",
            "https://google-analytics.com"
          ],
          connectSrc: [
            "'self'", 
            "https://maps.googleapis.com",
            "https://app.posthog.com",
            "https://us.i.posthog.com",
            "https://*.hotjar.com",
            "https://*.algolia.net",
            "https://www.facebook.com",
            "https://connect.facebook.net",
            "https://google-analytics.com"
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          frameSrc: [
            "'self'", 
            "https://challenges.cloudflare.com", 
            "https://www.youtube-nocookie.com", 
            "https://www.youtube.com", 
            "https://player.vimeo.com",
            "https://w.soundcloud.com"
          ],
          upgradeInsecureRequests: [],
        },
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
      limit: 200,
      message: "System capacity reached. Please try again after 15 minutes.",
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
