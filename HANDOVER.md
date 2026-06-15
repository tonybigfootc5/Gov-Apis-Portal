# API Culture Handover

## Project

- Repo: `Gov-Apis-Portal`
- Local path: `d:\coding\Clients\API Culture`
- Framework: Next.js App Router
- Styling: Tailwind CSS
- Data layer: Prisma + PostgreSQL when `DATABASE_URL` is configured
- Deployment: Vercel production

## Current Live State

- Production URL: `https://gov-apis-portal.vercel.app`
- Main branch: `main`
- Latest commit at handover: `4abb56a`
- Key production routes smoke-tested on 2026-06-16:
  - `/`
  - `/programs`
  - `/contact`
  - `/admin/login`

## What Has Been Completed

- Homepage hero updated with stronger training-focused presentation.
- Header logo replaced with custom honeycomb artwork from `public/api-culture-logo.png`.
- Top navbar `Apply` button removed.
- Training application flow moved into the training area:
  - users open `/programs`
  - select a training
  - open that training detail page
  - fill the application form inside that selected training page
- `/apply` now redirects to `/programs`.
- Admin dashboard redesigned with left sidebar and hamburger navigation.
- Admin sections now switch the right-side workspace so only the selected section shows.
- Admin content routes exist for applications, events, programs, gallery, contact messages, and articles.
- Public article routes exist at `/articles` and `/articles/[slug]`.
- Admin login is now a two-step MFA flow:
  - step 1: shared 24-character admin password
  - step 2: Google Authenticator compatible TOTP or one-time backup code
- Admin auth now includes:
  - signed HTTP-only admin session cookie
  - short-lived signed pre-auth cookie for password-passed state
  - independent rate limits for password attempts and MFA attempts
  - Prisma-backed one-time backup-code usage tracking
  - explicit setup-required blocking when secure config is incomplete
- Old development password hint/bypass was removed.
- Vercel production env vars were added for:
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `ADMIN_TOTP_SECRET`
  - `ADMIN_BACKUP_CODES_HASHES`

## Important Current Limitation

- Admin login is intentionally disabled unless `DATABASE_URL` is configured.
- This is required so backup-code usage can be persisted and cannot be reused.
- The app currently blocks admin login with a setup message instead of silently falling back to weaker auth.
- Production still needs the real database connection and migration before admin access can be used live.

## Important Files

- App layout and global nav:
  - `src/app/layout.tsx`
  - `src/components/site-header.tsx`
  - `src/components/site-footer.tsx`
- Homepage:
  - `src/app/page.tsx`
- Training pages:
  - `src/app/programs/page.tsx`
  - `src/app/programs/[slug]/page.tsx`
  - `src/components/training-application-form.tsx`
- Redirected apply route:
  - `src/app/apply/page.tsx`
- Admin dashboard:
  - `src/app/admin/page.tsx`
  - `src/components/admin-console.tsx`
  - `src/components/application-admin-panel.tsx`
- Admin auth:
  - `src/app/admin/login/page.tsx`
  - `src/components/admin-login-form.tsx`
  - `src/app/api/admin/login/route.ts`
  - `src/app/api/admin/login/verify/route.ts`
  - `src/app/api/admin/login/reset/route.ts`
  - `src/app/api/admin/logout/route.ts`
  - `src/lib/auth.ts`
- Training application backend:
  - `src/app/api/training-application/route.ts`
  - `src/app/api/admin/applications/route.ts`
  - `src/app/api/admin/applications/[id]/route.ts`
- Data access:
  - `src/lib/data.ts`
  - `src/lib/prisma.ts`
  - `src/lib/training-application.ts`
  - `src/lib/validators.ts`
- Prisma:
  - `prisma/schema.prisma`
  - `prisma/migrations/20260616000000_admin_mfa_login/migration.sql`

## Local Development

- Install:
```bash
npm install
```

- Run dev server:
```bash
npm run dev
```

- Lint:
```bash
npm run lint
```

- Production build:
```bash
npm run build
```

## Environment Notes

- Required for secure admin login:
  - `DATABASE_URL`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `ADMIN_TOTP_SECRET`
  - `ADMIN_BACKUP_CODES_HASHES`
- If `DATABASE_URL` is missing:
  - public site still works with fallback data
  - admin login remains unavailable by design
- Useful env files already present locally:
  - `.env.local`
  - `.env.production.local`
- Raw backup codes and admin MFA setup details are stored locally in:
  - `ADMIN_MFA_SECRETS.local.md`

## Verification Completed

- `npm run prisma:generate`
- `npm run lint`
- `npm run build`
- Mobile visual check of `/admin/login` in local dev
- Production route smoke check with HTTP 200 on:
  - `/`
  - `/programs`
  - `/contact`
  - `/admin/login`

## Remaining Work

- Add the real `DATABASE_URL` in Vercel production.
- Apply Prisma migration to the real production database.
- Add local `DATABASE_URL` if local admin login needs to work.
- Scan `ADMIN_TOTP_SECRET` into the admin device in Google Authenticator.
- Test full admin login end to end:
  - correct password + correct TOTP
  - wrong password rejected
  - wrong TOTP rejected
  - valid backup code succeeds once
  - reused backup code rejected
- Store the raw admin password and backup codes in the real secure vault/password manager.

## Notes For Codex

- Read `AGENTS.md` first.
- This repo expects:
  1. commit and push after changes
  2. deploy latest state to Vercel production
  3. refresh Graphify output
- Avoid reverting unrelated user changes.
- Keep secrets out of git.
