import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sponsorSessionTtlMs = 30 * 60 * 1000;
export const sponsorSessionCookieName = "monolith_sponsor_session";
export const sponsorDeckFilename = "Chasing Sun(Sets) 2026 Pitch Deck (Upgraded).pdf";
export const sponsorDeckPath = path.resolve(__dirname, "..", "..", "private", "documents", sponsorDeckFilename);
export const sponsorSessions = new Map<string, number>();

export function pruneSponsorSessions(now = Date.now()) {
  sponsorSessions.forEach((expiresAt, token) => {
    if (expiresAt <= now) sponsorSessions.delete(token);
  });
}

export function buildSponsorSessionCookie(value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${sponsorSessionCookieName}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/api; HttpOnly; SameSite=Strict${secure}`;
}

export function issueSponsorSession() {
  pruneSponsorSessions();
  const token = randomUUID();
  sponsorSessions.set(token, Date.now() + sponsorSessionTtlMs);
  return token;
}

export function hasValidSponsorSession(token: string | undefined) {
  if (!token) return false;
  pruneSponsorSessions();
  const expiresAt = sponsorSessions.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    sponsorSessions.delete(token);
    return false;
  }
  return true;
}
