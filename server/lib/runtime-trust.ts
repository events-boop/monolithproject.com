export function shouldTrustForwardedHeaders() {
  const explicit = process.env.TRUST_PROXY_HEADERS?.trim().toLowerCase();

  if (explicit === "true") return true;
  if (explicit === "false") return false;

  return process.env.NETLIFY === "true";
}
