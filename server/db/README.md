# Neon Database

This project uses Neon Postgres through Drizzle ORM.

## 1) Configure environment

Set `DATABASE_URL` in your deploy environment (and local `.env` for dev).

## 2) Push schema

```bash
npm run db:push
```

## 3) Generated migrations

Drizzle writes SQL and metadata in `server/db/migrations/`.

## Runtime behavior

- If `DATABASE_URL` is set, Social Echo webhook events persist in Postgres.
- If `DATABASE_URL` is missing, server falls back to in-memory storage.
