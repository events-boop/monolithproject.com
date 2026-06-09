# ADR 003: Airtable as Mirror, Not Source of Truth

**Status:** Accepted  
**Date:** 2026-06-08

## Context

The marketing team uses Airtable for campaign management. The question was whether to make Airtable the primary data store or mirror Postgres data to it.

## Decision

PostgreSQL is the source of truth. Airtable is a fire-and-forget mirror for marketing visibility.

## Consequences

- Postgres remains the authoritative data store for the CRM, rate limiting, and analytics
- Airtable sync failures do not block lead capture — the API returns success before Airtable completes
- Marketing team has read-only visibility into leads; all writes go through the API → Postgres path
- If Airtable is down, the core site functions continue unaffected
- Tradeoff: eventual consistency between Postgres and Airtable (the sync is async/fire-and-forget)
