function buildDenyHeaders() {
  return {
    "Cache-Control": "public, max-age=300",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    "Content-Type": "text/plain; charset=utf-8",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-Robots-Tag": "noindex, noarchive, nosnippet",
  };
}

export default async function sourceMapGuard(request, context) {
  const { pathname } = new URL(request.url);

  if (!pathname.endsWith(".map")) {
    return context.next();
  }

  return new Response("Not Found", {
    status: 404,
    headers: buildDenyHeaders(),
  });
}

export const config = {
  onError: "bypass",
  path: ["/assets/*"],
};
