export const idempotencyTtlMs = 24 * 60 * 60 * 1000;
export const idempotencyCache = new Map<string, { status: number; body: unknown; expiresAt: number }>();
export const idempotencyInFlight = new Map<string, Promise<{ status: number; body: unknown }>>();

export function getFromCache(key: string) {
  const cached = idempotencyCache.get(key);
  if (!cached) return undefined;
  if (cached.expiresAt > Date.now()) return cached;
  idempotencyCache.delete(key); // Evict expired entry
  return undefined;
}

export function setInCache(key: string, status: number, body: unknown) {
  idempotencyCache.set(key, {
    status,
    body,
    expiresAt: Date.now() + idempotencyTtlMs,
  });
}

export function hasInFlight(key: string) {
  return idempotencyInFlight.has(key);
}

export function setInFlight(key: string, promise: Promise<{ status: number; body: unknown }>) {
  idempotencyInFlight.set(key, promise);
}

export function resolveInFlight(key: string) {
  return idempotencyInFlight.get(key)!;
}

export function deleteInFlight(key: string) {
  idempotencyInFlight.delete(key);
}

// Periodic eviction sweep — prevents unbounded memory growth
const EVICTION_INTERVAL_MS = 60_000;
setInterval(() => {
  const now = Date.now();
  idempotencyCache.forEach((entry, key) => {
    if (entry.expiresAt <= now) idempotencyCache.delete(key);
  });
}, EVICTION_INTERVAL_MS).unref();
