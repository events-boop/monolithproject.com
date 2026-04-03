import path from "path";
import { existsSync } from "fs";
import { randomUUID, createHmac, timingSafeEqual } from "crypto";

export const sponsorSessionTtlMs = 30 * 60 * 1000;
export const sponsorSessionCookieName = "monolith_sponsor_session";
export const sponsorDeckFilename = "Chasing Sun(Sets) 2026 Pitch Deck (Upgraded).pdf";

function resolveCandidatePath(candidate: string | undefined) {
  if (!candidate) return null;
  return path.isAbsolute(candidate) ? candidate : path.resolve(process.cwd(), candidate);
}

export function resolveSponsorDeckPath() {
  const candidates = [
    resolveCandidatePath(process.env.SPONSOR_DECK_PATH?.trim()),
    path.resolve(process.cwd(), "private", "documents", sponsorDeckFilename),
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function sign(token: string, secret: string) {
  return createHmac("sha256", secret).update(token).digest("base64url");
}

export function buildSponsorSessionCookie(value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${sponsorSessionCookieName}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/api; HttpOnly; SameSite=Strict${secure}`;
}

export function issueSponsorSession() {
  const secret = process.env.SPONSOR_SESSION_SECRET;
  if (!secret) throw new Error("SPONSOR_SESSION_SECRET is not configured");
  const token = randomUUID();
  const expiresAt = Date.now() + sponsorSessionTtlMs;
  const payload = `${token}:${expiresAt}`;
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function hasValidSponsorSession(cookieValue: string | undefined) {
  if (!cookieValue) return false;
  const secret = process.env.SPONSOR_SESSION_SECRET;
  if (!secret) return false;
  
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload, secret);
  
  let validSignature = false;
  try {
    validSignature = timingSafeEqual(
      Buffer.from(signature, "base64url"),
      Buffer.from(expectedSignature, "base64url")
    );
  } catch {
    return false;
  }

  if (!validSignature) return false;

  // Check temporal validity
  const [_, expiresAtStr] = payload.split(":");
  const expiresAt = parseInt(expiresAtStr, 10);
  
  if (isNaN(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  return true;
}
