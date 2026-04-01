export function readPath(payload: Record<string, unknown>, pathParts: string[]) {
  let current: unknown = payload;
  for (const part of pathParts) {
    if (typeof current !== "object" || current === null || !(part in current)) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export function pickString(payload: Record<string, unknown>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = readPath(payload, candidate.split("."));
    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized) return normalized;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return null;
}

export function pickQuantity(payload: Record<string, unknown>) {
  const numericCandidates = [
    "quantity",
    "ticketQuantity",
    "tickets_count",
    "numTickets",
    "order.quantity",
    "order.ticketQuantity",
    "order.tickets_count",
  ];

  for (const candidate of numericCandidates) {
    const value = readPath(payload, candidate.split("."));
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return Math.min(20, Math.floor(value));
    }
    if (typeof value === "string") {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return Math.min(20, parsed);
      }
    }
  }

  const tickets = readPath(payload, ["order", "tickets"]);
  if (Array.isArray(tickets) && tickets.length > 0) {
    return Math.min(20, tickets.length);
  }

  return 1;
}
