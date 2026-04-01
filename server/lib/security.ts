import { createHash, timingSafeEqual } from "crypto";

export function secureCompare(input: string, expected: string) {
  const inputHash = createHash("sha256").update(input).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(inputHash, expectedHash);
}

export function scrubEmail(email: string) {
  return email.trim().toLowerCase();
}
