const REDACTED = "[REDACTED]";
const MAX_LOG_STRING_LENGTH = 280;
const MAX_LOG_DEPTH = 4;
const URLISH_KEY_PATTERN = /(url|uri|referrer)/i;
const SENSITIVE_KEY_PATTERN =
  /(pass(word)?|secret|token|authorization|cookie|session|signature|api[-_]?key|webhook|email|phone)/i;

function sanitizeUrl(value: string) {
  try {
    const parsed = new URL(value);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return value.length > MAX_LOG_STRING_LENGTH
      ? `${value.slice(0, MAX_LOG_STRING_LENGTH)}…`
      : value;
  }
}

function sanitizeString(value: string, key?: string) {
  if (key && SENSITIVE_KEY_PATTERN.test(key)) {
    return REDACTED;
  }

  if (key && URLISH_KEY_PATTERN.test(key)) {
    return sanitizeUrl(value);
  }

  return value.length > MAX_LOG_STRING_LENGTH
    ? `${value.slice(0, MAX_LOG_STRING_LENGTH)}…`
    : value;
}

function sanitizeValue(value: unknown, key?: string, depth = 0): unknown {
  if (depth > MAX_LOG_DEPTH) return "[Truncated]";
  if (typeof value === "string") return sanitizeString(value, key);
  if (typeof value === "number" || typeof value === "boolean" || value == null) return value;
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeValue(item, key, depth + 1));
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: sanitizeString(value.message, key),
    };
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
        childKey,
        sanitizeValue(childValue, childKey, depth + 1),
      ]),
    );
  }
  return String(value);
}

function sanitizePayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, sanitizeValue(value, key)]),
  );
}

export function logEvent(event: string, payload: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level: "info",
      ts: new Date().toISOString(),
      event,
      ...sanitizePayload(payload),
    }),
  );
}
