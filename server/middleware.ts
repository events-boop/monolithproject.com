import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { randomUUID } from "crypto";

export function configureMiddleware(app: Express) {
  // 1. Security: Hardened Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://challenges.cloudflare.com", "https://maps.googleapis.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://maps.gstatic.com", "https://maps.googleapis.com"],
          connectSrc: ["'self'", "https://maps.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          frameSrc: ["'self'", "https://challenges.cloudflare.com", "https://www.youtube.com", "https://player.vimeo.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  // 3. Resilience: Tuned Rate Limiting (Human Pace)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "System capacity reached. Please try again after 15 minutes.",
  });
  app.use(limiter);
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
