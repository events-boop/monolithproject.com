"use strict";

const { isProductionEnvironment } = require("./runtime");

const rateLimitStore = new Map();
const dedupeStore = new Map();

const DEFAULT_RATE_LIMIT_FALLBACK_MAX = 5000;
const DEFAULT_DEDUPE_FALLBACK_MAX = 10000;

const RATE_LIMIT_TABLE = sanitizeIdentifier(
  process.env.RATE_LIMIT_TABLE_NAME,
  "form_rate_limits"
);
const DEDUPE_TABLE = sanitizeIdentifier(
  process.env.DEDUPE_TABLE_NAME,
  "form_dedupe"
);

let postgresPoolPromise;
let schemaReadyPromise;
let loggedMissingNeonDriver = false;
let loggedDatabaseFallback = false;

function sanitizeIdentifier(value, fallback) {
  const candidate = String(value || "").trim();
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(candidate)) {
    return candidate;
  }
  return fallback;
}

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function getDatabaseUrl() {
  return process.env.RATE_LIMIT_DATABASE_URL || process.env.DATABASE_URL || "";
}

function shouldUseDatabaseSsl() {
  const mode = String(process.env.RATE_LIMIT_DATABASE_SSL || "require").toLowerCase();
  return mode !== "disable" && mode !== "false";
}

function isDurableStoreRequired() {
  const value = String(
    process.env.REQUIRE_DURABLE_SECURITY_STORE || "true"
  ).toLowerCase();
  return value !== "false" && value !== "0" && value !== "no";
}

function getRateLimitFallbackMaxEntries() {
  return toPositiveInt(
    process.env.RATE_LIMIT_FALLBACK_MAX_ENTRIES,
    DEFAULT_RATE_LIMIT_FALLBACK_MAX
  );
}

function getDedupeFallbackMaxEntries() {
  return toPositiveInt(
    process.env.DEDUPE_FALLBACK_MAX_ENTRIES,
    DEFAULT_DEDUPE_FALLBACK_MAX
  );
}

function cleanupStore(store, now) {
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) {
      store.delete(key);
    }
  }
}

function enforceStoreBound(store, maxEntries) {
  while (store.size > maxEntries) {
    const oldestKey = store.keys().next().value;
    if (!oldestKey) {
      break;
    }
    store.delete(oldestKey);
  }
}

function checkRateLimitInMemory(key, { limit, windowMs }, now = Date.now()) {
  cleanupStore(rateLimitStore, now);
  enforceStoreBound(rateLimitStore, getRateLimitFallbackMaxEntries());

  const current = rateLimitStore.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { ok: false, retryAfterMs: current.expiresAt - now };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return { ok: true, remaining: limit - current.count };
}

function hasRecentSignupInMemory(key, ttlMs, now = Date.now()) {
  cleanupStore(dedupeStore, now);
  enforceStoreBound(dedupeStore, getDedupeFallbackMaxEntries());

  const current = dedupeStore.get(key);
  return Boolean(current && current.expiresAt > now);
}

function rememberSignupInMemory(key, ttlMs, now = Date.now()) {
  cleanupStore(dedupeStore, now);
  dedupeStore.set(key, { expiresAt: now + ttlMs });
  enforceStoreBound(dedupeStore, getDedupeFallbackMaxEntries());
}

async function getPostgresPool() {
  if (postgresPoolPromise) {
    return postgresPoolPromise;
  }

  postgresPoolPromise = (async () => {
    const databaseUrl = getDatabaseUrl();
    const production = isProductionEnvironment();
    const requireDurable = production && isDurableStoreRequired();

    if (!databaseUrl) {
      if (requireDurable) {
        throw new Error(
          "RATE_LIMIT_DATABASE_URL or DATABASE_URL must be configured for durable security storage in production."
        );
      }
      return null;
    }

    let Pool;
    try {
      ({ Pool } = require("@neondatabase/serverless"));
    } catch (error) {
      if (requireDurable) {
        throw new Error(
          "@neondatabase/serverless is required for durable security storage in production."
        );
      }

      if (!loggedMissingNeonDriver) {
        loggedMissingNeonDriver = true;
        console.warn(
          JSON.stringify({
            level: "warn",
            event: "security.neon_driver_missing",
            message:
              "DATABASE_URL is configured but @neondatabase/serverless is not installed."
          })
        );
      }
      return null;
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: shouldUseDatabaseSsl() ? { rejectUnauthorized: false } : undefined
    });

    if (typeof pool.on === "function") {
      pool.on("error", (error) => {
        console.error(
          JSON.stringify({
            level: "error",
            event: "security.postgres_pool_error",
            error: error.message
          })
        );
      });
    }

    return pool;
  })();

  return postgresPoolPromise;
}

async function ensureDatabaseSchema(pool) {
  if (schemaReadyPromise) {
    return schemaReadyPromise;
  }

  schemaReadyPromise = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${RATE_LIMIT_TABLE} (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${DEDUPE_TABLE} (
        key TEXT PRIMARY KEY,
        expires_at TIMESTAMPTZ NOT NULL
      )
    `);

    await pool.query(
      `CREATE INDEX IF NOT EXISTS ${DEDUPE_TABLE}_expires_at_idx ON ${DEDUPE_TABLE} (expires_at)`
    );
  })();

  return schemaReadyPromise;
}

function logDatabaseFallback(error) {
  if (loggedDatabaseFallback) {
    return;
  }

  loggedDatabaseFallback = true;
  console.warn(
    JSON.stringify({
      level: "warn",
      event: "security.database_fallback",
      error: error.message
    })
  );
}

async function withDatabase(action) {
  const production = isProductionEnvironment();
  const requireDurable = production && isDurableStoreRequired();
  const pool = await getPostgresPool();

  if (!pool) {
    return null;
  }

  try {
    await ensureDatabaseSchema(pool);
    return await action(pool);
  } catch (error) {
    if (requireDurable) {
      throw new Error(`Durable security storage failed: ${error.message}`);
    }

    logDatabaseFallback(error);
    return null;
  }
}

async function checkRateLimitWithDatabase(pool, key, { limit, windowMs }) {
  const result = await pool.query(
    `
      INSERT INTO ${RATE_LIMIT_TABLE} (key, count, expires_at)
      VALUES ($1, 1, NOW() + ($2 * INTERVAL '1 millisecond'))
      ON CONFLICT (key) DO UPDATE SET
        count = CASE
          WHEN ${RATE_LIMIT_TABLE}.expires_at <= NOW() THEN 1
          ELSE ${RATE_LIMIT_TABLE}.count + 1
        END,
        expires_at = CASE
          WHEN ${RATE_LIMIT_TABLE}.expires_at <= NOW() THEN NOW() + ($2 * INTERVAL '1 millisecond')
          ELSE ${RATE_LIMIT_TABLE}.expires_at
        END
      RETURNING
        count,
        GREATEST(0, FLOOR(EXTRACT(EPOCH FROM (expires_at - NOW())) * 1000))::bigint AS retry_after_ms
    `,
    [key, windowMs]
  );

  const row = result.rows[0];
  const count = Number(row.count);
  const retryAfterMs = Number(row.retry_after_ms);

  if (count > limit) {
    return { ok: false, retryAfterMs };
  }

  return { ok: true, remaining: Math.max(0, limit - count) };
}

async function hasRecentSignupWithDatabase(pool, key) {
  const result = await pool.query(
    `
      SELECT 1
      FROM ${DEDUPE_TABLE}
      WHERE key = $1 AND expires_at > NOW()
      LIMIT 1
    `,
    [key]
  );

  return result.rowCount > 0;
}

async function rememberSignupWithDatabase(pool, key, ttlMs) {
  await pool.query(
    `
      INSERT INTO ${DEDUPE_TABLE} (key, expires_at)
      VALUES ($1, NOW() + ($2 * INTERVAL '1 millisecond'))
      ON CONFLICT (key) DO UPDATE SET
        expires_at = EXCLUDED.expires_at
    `,
    [key, ttlMs]
  );
}

async function checkRateLimit(key, { limit, windowMs }, now = Date.now()) {
  const normalizedLimit = toPositiveInt(limit, 1);
  const normalizedWindowMs = toPositiveInt(windowMs, 60 * 1000);

  const dbResult = await withDatabase((pool) =>
    checkRateLimitWithDatabase(pool, key, {
      limit: normalizedLimit,
      windowMs: normalizedWindowMs
    })
  );

  if (dbResult) {
    return dbResult;
  }

  return checkRateLimitInMemory(
    key,
    { limit: normalizedLimit, windowMs: normalizedWindowMs },
    now
  );
}

async function hasRecentSignup(key, ttlMs, now = Date.now()) {
  const dbResult = await withDatabase((pool) => hasRecentSignupWithDatabase(pool, key));
  if (typeof dbResult === "boolean") {
    return dbResult;
  }

  return hasRecentSignupInMemory(key, ttlMs, now);
}

async function rememberSignup(key, ttlMs, now = Date.now()) {
  const normalizedTtlMs = toPositiveInt(ttlMs, 60 * 1000);

  const dbResult = await withDatabase((pool) =>
    rememberSignupWithDatabase(pool, key, normalizedTtlMs)
  );
  if (dbResult !== null) {
    return;
  }

  rememberSignupInMemory(key, normalizedTtlMs, now);
}

function __resetStores() {
  rateLimitStore.clear();
  dedupeStore.clear();
  postgresPoolPromise = undefined;
  schemaReadyPromise = undefined;
  loggedMissingNeonDriver = false;
  loggedDatabaseFallback = false;
}

module.exports = {
  __resetStores,
  checkRateLimit,
  hasRecentSignup,
  rememberSignup
};
