# ADR 001: Drizzle ORM over Prisma

**Status:** Accepted  
**Date:** 2026-06-08

## Context

The project needed an ORM for PostgreSQL. Choices were Prisma (dominant in React/Node ecosystem), Drizzle (lightweight, SQL-first), and raw SQL.

## Decision

Drizzle ORM was chosen.

## Consequences

- SQL-like API is intuitive for developers comfortable with raw SQL
- No code generation step (unlike Prisma's `prisma generate`), faster iteration
- Lighter runtime weight — important for Netlify Function cold starts
- Migrations are SQL files, easier to audit and version-control
- Tradeoff: smaller ecosystem, fewer community recipes
