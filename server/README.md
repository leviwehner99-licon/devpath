# CodeZone API and PostgreSQL schema

This is the Phase-2 backend starting point. It serves public course/release metadata and provides OIDC-protected idempotent account provisioning and deletion. It never accepts email, lesson progress, project files, source code, or AI prompts.

## PostgreSQL schema

`migrations/001_initial.sql` creates account identities, published course metadata, signed course manifests, and app release metadata. Run migrations against a dedicated development database, not a personal/default database. Use a PostgreSQL role limited to the database; do not connect as a superuser from the application.

Example with a local PostgreSQL client after creating the database and restricted role:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_initial.sql
```

pgAdmin 4 can also execute the same migration file in Query Tool after selecting the intended database. This migration creates schema objects only; it does not create roles, grant broad privileges, insert personal data, or modify another database.

## Start the API

```sh
cd server
npm install
Copy-Item .env.example .env
```

Set `DATABASE_URL`, then set issuer, audience, and JWKS URL from the identity provider chosen for CodeZone. Do not use the example `.invalid` values in a running deployment. Start with `npm start` and confirm `/health/live` and `/health/ready`.

Production deployment must use HTTPS at a trusted reverse proxy, `DATABASE_SSL=true` where required, explicit `CORS_ORIGINS`, non-superuser DB credentials, and a secret manager. Never commit `.env`.
