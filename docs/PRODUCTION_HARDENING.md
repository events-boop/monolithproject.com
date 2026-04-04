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

---
*Created for the Monolith Project July 4th Campaign Deployment.*
破
