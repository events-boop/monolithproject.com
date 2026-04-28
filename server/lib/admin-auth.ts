import { randomUUID } from "crypto";
import type { Request, RequestHandler } from "express";
import { logEvent } from "./logging";
import { secureCompare } from "./security";

interface AdminRouteGuardOptions {
  scope: string;
}

function readBearerToken(value?: string | null) {
  if (!value) return undefined;
  const match = value.trim().match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

function readProvidedAdminSecret(req: Request) {
  return (
    req.header("x-admin-secret")?.trim() ||
    readBearerToken(req.header("authorization")) ||
    undefined
  );
}

export function createAdminRouteGuard({ scope }: AdminRouteGuardOptions): RequestHandler {
  return (req, res, next) => {
    const configuredSecret = process.env.OPS_ADMIN_SECRET?.trim();

    if (!configuredSecret) {
      if (process.env.NODE_ENV !== "production") {
        next();
        return;
      }

      const requestId = randomUUID();
      logEvent("admin.guard_unconfigured", {
        requestId,
        scope,
        method: req.method,
        path: req.path,
      });

      res.status(503).json({
        ok: false,
        requestId,
        error: {
          code: "UNAVAILABLE",
          message: "Administrative access is not configured.",
          retryable: false,
        },
      });
      return;
    }

    const providedSecret = readProvidedAdminSecret(req);
    if (!providedSecret || !secureCompare(providedSecret, configuredSecret)) {
      const requestId = randomUUID();
      logEvent("admin.guard_denied", {
        requestId,
        scope,
        method: req.method,
        path: req.path,
      });

      res.status(401).json({
        ok: false,
        requestId,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Administrative access required.",
          retryable: false,
        },
      });
      return;
    }

    next();
  };
}
