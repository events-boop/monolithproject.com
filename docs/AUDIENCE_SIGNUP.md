# Monolith → Audience OS local installation

Installed locally October 3, 2026 from Fan360 commit `95a43c1`. Not deployed or enabled for public capture.

In development, open `/newsletter?audience_preview=1` to review the matching dark/cream/coral component in the real website shell. Normal newsletter routes remain intact. Production ignores this query and keeps the existing newsletter; no public preview route or build flag enables the controlled form. The preview posts only to the new same-site `/api/audience-signup` route and reports failure until the bridge is configured. It does not call `/api/leads`, send a welcome message or emit a Lead pixel/CAPI event. The rest of the existing website shell/tracking still follows its existing behavior.

Required email, optional phone/Instagram, separate initially unchecked email/SMS choices, inline field validation, a honeypot and stable explicit retries are copied from the Fan360-reviewed component. Copy/privacy/disclosures are a **design proposal**, not an approved live policy or release. Reported Instagram is metadata, never verified identity. A durable raw acknowledgment means received, not subscribed or applied to a fan.

The dedicated API route uses existing browser/JSON/security middleware, the 16 KiB parser, a 10-per-minute route limiter, server-only pinned scope, canonical `https://monolithproject.com` origin/page, and the sole controlled email. Missing/disabled/invalid configuration fails closed with no upstream request. Known parser errors return bounded 400/413 responses. No upstream cookies, credentials, provider response or payload enter the acknowledgment.

`docs/audience-signup.env.example` lists nonfunctional server-only settings. None are configured locally by this installation. Never expose the token, intake URL, release or workspace as `VITE_` variables/client props. Localhost browser submissions are not relabeled as canonical Monolith traffic; canonical origin checks remain in place.

Before a controlled live proof: approve exact copy/privacy/disclosures and `/newsletter` placement in Fan360, pin the immutable release, configure the hosted HTTPS receiver and separate private server token, and review the private controlled surface. Then prove one authorized recipient and same-ID retry in the receipt inbox. Do not replace the general public newsletter with a route that accepts only one test address. Broader public capture/new-fan onboarding/automatic processing and deployment are later work.

Website client copies: `client/src/components/audience-signup/`. Server transport copies: `server/audience-signup/`; mount: `server/routes/audience-signup.ts`. Transport files are copied unchanged; changes to the contract should be reviewed against Fan360's integration tests and kept in sync.

Verification: TypeScript passes. Direct production Vite client build and esbuild API compilation pass. The standard `npm run build` pipeline was not run: it includes generation/rotation steps and references scripts already deleted in the existing work. This checkpoint does not certify that full pipeline. Six installed-route tests plus adjacent middleware/legacy-capture checks pass (37 tests total). The isolated browser check covers desktop/mobile, optional fields and unchecked choices, local failure without success, unchanged payload IDs on retries, fresh IDs after edits, no legacy lead requests, and unchanged normal/production newsletter pages. External browser requests are blocked in that check. API tests mock upstream replies; there is no live hosted receiver proof.

Repeat verification in this canonical checkout:

```sh
npx tsc --noEmit
npx vite build
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/audience-review-api.js
npx vitest run server/__tests__/audience-signup.test.ts server/__tests__/api-hardening.test.ts server/__tests__/signup-capture.test.ts server/__tests__/lead-providers.test.ts
node --import tsx/esm scripts/review_audience_signup.mts
```

The browser script stops its temporary servers and keeps screenshots only in ignored `test-results/audience-signup-local/`. Local dev proxy origin checks may reject before the disabled bridge; those checks are preserved, not bypassed.

All website edits are in this canonical checkout. Existing dirty work is preserved; the integration's commit includes only its new files and its narrow page/app changes. No provider, pixel, deployment, environment or legacy capture-mode settings were changed.
