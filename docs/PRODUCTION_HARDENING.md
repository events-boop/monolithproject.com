# Monolith Project: Production Hardening Strategy

This document outlines the production hardening measures implemented for the Monolith Project. The strategy focuses on real-world integrity, stability, and protection of intellectual property without compromising user accessibility or system performance.

## 1. Frontend Architectural Hardening (Vite)

The build chain is configured to ensure that the shipped production bundle is lean, minified, and free of developer-specific metadata.

### Configuration (`vite.config.ts`)
*   **Source Map Suppression**: `sourcemap: false` is explicitly set to prevent browser developer tools from reconstructing the original React source code.
*   **Aggressive Minification**: The `esbuild` minifier is used to compress and mangle production output, raising the effort required for casual reverse-engineering.
*   **Debug Symbol Removal**: `drop: ["console", "debugger"]` ensures that no log leakage occurs in production and no interactive debugging traps remain in the final code.
*   **Legal Comment Stripping**: All internal comments and licensing metadata are stripped from the output chunks.

## 2. Server-Side Infrastructure (Express)

True security lives on the server. The Monolith backend implements multiple layers of protection to defend against common attack vectors.

### Security Middleware (`server/middleware.ts`)
*   **Helmet Integration**: `helmet(...)` applies secure HTTP headers that mitigate common browser-layer attacks such as clickjacking, MIME sniffing, and some XSS vectors.
*   **Constrained Content Security Policy (CSP)**: The app uses an explicit allow-list for scripts, styles, frames, images, fonts, and network connections. This is materially safer than an open policy, though it is not a maximally strict CSP because the current app still requires `'unsafe-inline'` and `'unsafe-eval'` for compatibility.
*   **Global API Rate Limiting**: The `/api` endpoints are protected by a custom rate limiter from `server/services/rate-limit.ts` with a `200 requests / 15 minutes` policy. It uses database-backed buckets when storage is available and falls back to in-memory buckets if persistence fails.
*   **Production Error Gating**: Custom error middleware ensures that internal stack traces never reach the client. In the event of an error, only a correlation `requestId` is returned for internal debugging.

## 3. Data Integrity & Content Protection

Client-side obfuscation and anti-debugger traps were intentionally removed because they create false confidence while degrading reliability and accessibility. The Monolith Project favors infrastructure-level tactics for data safety.

### Implemented Cleanup
*   **Client-Side Security Theater Removed**: The former browser-side anti-debugging and hostname-based content scrambling layer was removed from the application. Those tactics do not protect shipped code and can destabilize production behavior.
*   **Stable Public Content Restored**: Event and marketing copy now ships as ordinary content instead of runtime-decoded strings tied to the current hostname.

### Recommended Next Steps
*   **Signed URLs for Media**: High-value cinematic assets should be served via CloudFront or Cloudflare signed URLs with short expiry times to prevent unauthorized hotlinking.
*   **Watermarking**: All proprietary videos and rare high-res photography should include a subtle, semi-transparent Monolith watermark or "Property of" metadata tag.
*   **Authenticated Data Gating**: Sensitive logistical data (like secret venue coordinates) are not shipped in static JSON files. They are fetched via authenticated server endpoints that verify valid user tokens or campaign status.

## 4. Operational Best Practices

*   **Environment Validation**: The server uses `validateEnvironment` to ensure that no production instance boots with insecure or missing configurations.
*   **Audit Logging**: Internal systems track `database.mode` and high-level system events to detect anomalies in real-time.

## 5. CSP Inline Allowance Tightening Plan

The current production CSP (in `netlify.toml`) ships with `script-src 'unsafe-inline'`, `style-src 'unsafe-inline'`, and `style-src-attr 'unsafe-inline'`. These exist for known reasons; each can be removed independently with a small, contained change.

### What still requires inline allowances
*   **Inline `<script>` blocks injected by the prerender (`scripts/prerender_public_routes.mts`)**:
    *   `window.__MONOLITH_SITE_DATA__ = {...}` — per-route bootstrap site data.
    *   `<script type="application/ld+json">` — JSON-LD schema markup, varies per route.
*   **Inline `<style>` block on the home route**: `renderHomeCriticalStyle()` emits a critical-CSS block to avoid an FOUC during the home hero hydration.
*   **Inline `style="..."` attributes** in `client/index.html` on the Facebook noscript pixel (`style="display:none"`) and on the SVG filter container (`style="position:absolute;width:0;height:0;..."`).

### Smallest path to remove `script-src 'unsafe-inline'`
1.  In the prerender, write the site-data payload to a sibling JSON file per route (e.g., `dist/public/<route>/site-data.json`) and reference it through a `<script src>` instead of an inline assignment. Update `client/src/lib/siteData.ts` to read the bootstrap from that file (already supported via `ensurePublicSiteData`, so the inline `__MONOLITH_SITE_DATA__` window key can be retired).
2.  Emit JSON-LD as an external `application/ld+json` script (`<script type="application/ld+json" src="/schema/<route>.jsonld">`). Google supports the external form.
3.  After both above, remove `'unsafe-inline'` from `script-src` and re-enable `'nonce-...' 'strict-dynamic'` only if a runtime nonce mechanism is reintroduced (otherwise the static CSP is sufficient with just `'self'`).

### Smallest path to remove `style-src 'unsafe-inline'`
1.  Move the critical home CSS in `renderHomeCriticalStyle()` to a checked-in stylesheet (e.g., `client/public/styles/home-critical.css`) and link it via `<link rel="stylesheet" href="/styles/home-critical.css">` in the prerender output for `/`.
2.  Audit any third-party widgets (PostHog, FB pixel, SoundCloud iframe wrappers) for runtime-injected `<style>` tags; if any remain, capture their SHA-256 hashes and add them as `style-src 'sha256-...'` instead of broad `'unsafe-inline'`.
3.  After the above, remove `'unsafe-inline'` from `style-src` and `style-src-elem`.

### Smallest path to remove `style-src-attr 'unsafe-inline'`
1.  Replace the inline `style="display:none"` on the FB noscript pixel with a class (e.g., `class="fb-pixel-hidden"`) and define the rule in the global stylesheet.
2.  Replace the inline SVG filter container `style="..."` with a class (`class="visually-hidden-svg"`) defined globally.
3.  After both, drop `style-src-attr 'unsafe-inline'`.

### Order of operations
Style attributes → critical inline `<style>` → inline `<script>` blocks. This sequence isolates failures: each step ships behind the existing allowance, then tightens the directive once the inline source is gone.

## 6. Performance Budget Calibration

`performance-budget.json` measures the entire `dist/public` output, not just the initial route payload. The current JS/CSS caps were raised to match the route-split application bundle after asset pruning:

*   Total JS cap: `1,600,000` bytes across all lazy chunks.
*   Total CSS cap: `350,000` bytes across all stylesheets.
*   Largest JS chunk cap: `200,000` bytes.
*   Largest CSS chunk cap: `330,000` bytes.

These are still hard failure gates. They should not be raised again without a corresponding architectural reason. The next improvement path is CSS extraction/purging and route-level dependency trimming, not further budget relaxation.

---
*Created for the Monolith Project July 4th Campaign Deployment.*
破
