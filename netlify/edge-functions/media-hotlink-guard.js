const allowedHosts = new Set([
  "monolithproject.com",
  "www.monolithproject.com",
  "themonolithproject.com",
  "www.themonolithproject.com",
  "localhost",
  "127.0.0.1",
]);

function buildDenyHeaders(contentType = "text/plain; charset=utf-8") {
  return {
    "Cache-Control": "public, max-age=300",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    "Content-Type": contentType,
    "Cross-Origin-Resource-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-Robots-Tag": "noindex, noarchive, nosnippet",
  };
}

function getSourceHost(value) {
  if (!value) return null;

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedSourceHost(sourceHost, requestHost) {
  return sourceHost === requestHost || allowedHosts.has(sourceHost);
}

export default async function mediaHotlinkGuard(request, context) {
  const requestHost = new URL(request.url).hostname.toLowerCase();
  const sourceHost =
    getSourceHost(request.headers.get("referer")) || getSourceHost(request.headers.get("origin"));

  if (!sourceHost || isAllowedSourceHost(sourceHost, requestHost)) {
    return context.next();
  }

  return new Response("Forbidden", {
    status: 403,
    headers: buildDenyHeaders(),
  });
}

export const config = {
  onError: "bypass",
  path: ["/images/*", "/videos/*"],
};
