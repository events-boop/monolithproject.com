import { createHash, randomUUID } from "crypto";
import type { Request, RequestHandler, Response } from "express";
import { sql } from "drizzle-orm";
import { getDatabase } from "../db/client";
import { rateLimitBuckets } from "../db/schema";
import { logEvent } from "../lib/logging";

interface RateLimitState {
  count: number;
  resetAt: number;
}

interface ConsumeRateLimitOptions {
  identifier: string;
  limit: number;
  scope: string;
  windowMs: number;
}

interface CreateRateLimitMiddlewareOptions {
  limit: number;
  message: string;
  scope: string;
  skip?: (req: Request) => boolean;
  windowMs: number;
  preferMemory?: boolean; // New option for high-performance read routes
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: string;
  retryAfterSec: number;
}

const inMemoryRateLimitBuckets = new Map<string, RateLimitState>();
let lastStorageFailureLogAt = 0;

setInterval(() => {
  const now = Date.now();
  inMemoryRateLimitBuckets.forEach((state, key) => {
    if (state.resetAt <= now) {
      inMemoryRateLimitBuckets.delete(key);
    }
  });
}, 60_000).unref();

function hashIdentifier(identifier: string) {
  return createHash("sha256").update(identifier).digest("hex");
}

function buildBucketKey(scope: string, identifier: string) {
  return `${scope}:${hashIdentifier(identifier)}`;
}

function setRateLimitHeaders(res: Response, result: RateLimitResult) {
  const exposePolicy = process.env.RATE_LIMIT_DEBUG_HEADERS === "true";

  if (exposePolicy) {
    const resetAtMs = Date.parse(result.resetAt);
    const resetAtUnix = Number.isFinite(resetAtMs) ? Math.ceil(resetAtMs / 1000) : 0;

    res.setHeader("RateLimit-Limit", String(result.limit));
    res.setHeader("RateLimit-Remaining", String(result.remaining));
    res.setHeader("RateLimit-Reset", String(resetAtUnix));
  }

  if (!result.allowed) {
    res.setHeader("Retry-After", String(result.retryAfterSec));
  }
}

function consumeInMemoryRateLimit({
  identifier,
  limit,
  scope,
  windowMs,
}: ConsumeRateLimitOptions): RateLimitResult {
  const bucketKey = buildBucketKey(scope, identifier);
  const now = Date.now();
  const current = inMemoryRateLimitBuckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    inMemoryRateLimitBuckets.set(bucketKey, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetAt: new Date(resetAt).toISOString(),
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  inMemoryRateLimitBuckets.set(bucketKey, current);

  const remaining = Math.max(0, limit - current.count);
  return {
    allowed: current.count <= limit,
    limit,
    remaining,
    resetAt: new Date(current.resetAt).toISOString(),
    retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

async function consumeDatabaseRateLimit({
  identifier,
  limit,
  scope,
  windowMs,
}: ConsumeRateLimitOptions): Promise<RateLimitResult> {
  const db = getDatabase();
  if (!db) {
    return consumeInMemoryRateLimit({ identifier, limit, scope, windowMs });
  }

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs).toISOString();
  const bucketKey = buildBucketKey(scope, identifier);

  const [row] = await db
    .insert(rateLimitBuckets)
    .values({
      key: bucketKey,
      count: 1,
      resetAt,
      updatedAt: now.toISOString(),
    })
    .onConflictDoUpdate({
      target: rateLimitBuckets.key,
      set: {
        count: sql<number>`case when ${rateLimitBuckets.resetAt} <= now() then 1 else ${rateLimitBuckets.count} + 1 end`,
        resetAt: sql<string>`case when ${rateLimitBuckets.resetAt} <= now() then ${resetAt}::timestamptz else ${rateLimitBuckets.resetAt} end`,
        updatedAt: sql<string>`now()`,
      },
    })
    .returning({
      count: rateLimitBuckets.count,
      resetAt: rateLimitBuckets.resetAt,
    });

  const remaining = Math.max(0, limit - row.count);
  const resetAtMs = Date.parse(row.resetAt);
  const retryAfterSec = Number.isFinite(resetAtMs)
    ? Math.max(1, Math.ceil((resetAtMs - Date.now()) / 1000))
    : Math.ceil(windowMs / 1000);

  return {
    allowed: row.count <= limit,
    limit,
    remaining,
    resetAt: row.resetAt,
    retryAfterSec,
  };
}

export function getClientIdentifier(req: Request) {
  const netlifyIp = req.header("x-nf-client-connection-ip")?.trim();
  if (netlifyIp) return netlifyIp;

  const forwardedFor = req.header("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwardedFor) return forwardedFor;

  return req.ip || req.socket.remoteAddress || "unknown";
}

export function createRateLimitMiddleware(options: CreateRateLimitMiddlewareOptions): RequestHandler {
  const { skip } = options;
  return (req, res, next) => {
    if (skip?.(req)) {
      next();
      return;
    }

    void (async () => {
      const identifier = getClientIdentifier(req);

      let result: RateLimitResult;
      
      // OPTIMIZATION: High-performance bypass for read routes
      if (options.preferMemory) {
        result = consumeInMemoryRateLimit({ 
          identifier, 
          limit: options.limit, 
          scope: options.scope, 
          windowMs: options.windowMs 
        });
      } else {
        try {
          result = await consumeDatabaseRateLimit({ 
            identifier, 
            limit: options.limit, 
            scope: options.scope, 
            windowMs: options.windowMs 
          });
        } catch (error) {
          if (Date.now() - lastStorageFailureLogAt > 60_000) {
            lastStorageFailureLogAt = Date.now();
            logEvent("rate_limit.storage_failed", {
              scope: options.scope,
              message: error instanceof Error ? error.message : "Unknown error",
            });
          }
          result = consumeInMemoryRateLimit({ 
            identifier, 
            limit: options.limit, 
            scope: options.scope, 
            windowMs: options.windowMs 
          });
        }
      }

      setRateLimitHeaders(res, result);

      if (result.allowed) {
        next();
        return;
      }

      const requestId = randomUUID();
      logEvent("rate_limit.exceeded", {
        requestId,
        scope: options.scope,
        identifierHash: hashIdentifier(identifier).slice(0, 12),
      });

      res.status(429).json({
        ok: false,
        requestId,
        error: {
          code: "RATE_LIMITED",
          message: options.message,
          retryable: true,
        },
      });
    })().catch(next);
  };
}
