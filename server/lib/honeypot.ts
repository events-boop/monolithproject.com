export const honeypotFieldName = "metadata_correlation_id";

function readStringValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const normalized: string | null = readStringValue(entry);
      if (normalized) return normalized;
    }
    return null;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return "[non-string]";
}

export function readHoneypotValue(body: unknown) {
  if (!body || typeof body !== "object") return null;

  return readStringValue((body as Record<string, unknown>)[honeypotFieldName]);
}
