/**
 * Netlify Edge Function: CSP Nonce Injection
 *
 * Intercepts HTML responses (index.html) and:
 * 1. Generates a cryptographically random nonce
 * 2. Adds nonce attribute to all <script> tags
 * 3. Replaces the static nonce placeholder in the CSP header
 */

function generateNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Base64-encode for compact, URL-safe nonce
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function cspNonce(request, context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const nonce = generateNonce();
  let html = await response.text();

  // Add nonce to all <script> tags (both <script src="..."> and <script>...</script>)
  html = html.replace(/<script(?=[\s>])/gi, `<script nonce="${nonce}"`);

  // Rewrite CSP header: replace the static nonce placeholder with the per-request nonce
  const csp = response.headers.get("content-security-policy");
  if (csp) {
    const newCsp = csp
      .replace(/'nonce-__CSP_NONCE__'/g, `'nonce-${nonce}'`)
      .replace(/__CSP_NONCE__/g, nonce);
    response.headers.set("content-security-policy", newCsp);
  }

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
}

export const config = {
  onError: "bypass",
  path: ["/*"],
  excludedPath: ["/api/*", "/go/*", "/assets/*", "/images/*", "/videos/*", "/fonts/*", "/*.js", "/*.css", "/*.svg", "/*.ico", "/*.json", "/*.xml", "/*.txt", "/*.woff2"],
};
