# ADR 002: Prerender at Build Time over SSR

**Status:** Accepted  
**Date:** 2026-06-08

## Context

The site needs SEO-critical static HTML for search engines and social crawlers. Options were Next.js SSR, Astro SSG, or a custom prerender pipeline.

## Decision

A custom build-time prerender script (`scripts/prerender_public_routes.mts`) that hydrates every route's index.html with SEO meta, JSON-LD, and semantic body content.

## Consequences

- Zero runtime server cost for rendering — all HTML is static files on CDN
- Faster cold starts than SSR (no Node.js render on first request)
- Route inventory must be maintained manually (50+ routes in the script)
- Adding a new public route requires updating the prerender script
- Tradeoff: no true SSR; initial JS load still needed for interactivity. But SEO-critical meta and content are present in the raw HTML.
