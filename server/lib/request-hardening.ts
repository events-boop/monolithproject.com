import { randomUUID } from "crypto";
import type { Request, RequestHandler } from "express";
import { shouldTrustForwardedHeaders } from "./runtime-trust";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const allowedFetchSites = new Set(["same-origin", "same-site", "none"]);

function readForwardedHeader(value?: string | null) {
  return value?.split(",")[0]?.trim() || undefined;
}

function getRequestOrigin(req: Request) {
  const trustForwarded = shouldTrustForwardedHeaders();
  const host =
    (trustForwarded ? readForwardedHeader(req.header("x-forwarded-host")) : undefined) ||
    req.header("host")?.trim();
  if (!host) return null;

  const proto =
    (trustForwarded ? readForwardedHeader(req.header("x-forwarded-proto")) : undefined) ||
    req.protocol ||
    "https";
  return `${proto}://${host}`;
}

export function createApiResponseHardening(): RequestHandler {
  return (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    );
    res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  };
}

export function createBrowserApiGuard(): RequestHandler {
  return (req, res, next) => {
    if (!unsafeMethods.has(req.method)) {
      next();
      return;
    }

    if (req.path.startsWith("/webhooks/")) {
      next();
      return;
    }

    const requestId = randomUUID();
    const origin = req.header("origin")?.trim();
    const expectedOrigin = getRequestOrigin(req);
    const fetchSite = req.header("sec-fetch-site")?.trim().toLowerCase();

    if (fetchSite && !allowedFetchSites.has(fetchSite)) {
      res.status(403).json({
        ok: false,
        requestId,
        error: {
          code: "FORBIDDEN_FETCH_SITE",
          message: "This request context is not allowed.",
          retryable: false,
        },
      });
      return;
    }

    if (origin && origin !== expectedOrigin) {
      res.status(403).json({
        ok: false,
        requestId,
        error: {
          code: "FORBIDDEN_ORIGIN",
          message: "This request origin is not allowed.",
          retryable: false,
        },
      });
      return;
    }

    if (!req.is("application/json")) {
      res.status(415).json({
        ok: false,
        requestId,
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "JSON requests are required.",
          retryable: false,
        },
      });
      return;
    }

    next();
  };
}
