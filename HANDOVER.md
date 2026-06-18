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
- Admin access now uses Cloudflare Zero Trust Access instead of app-managed MFA.
- Admin auth now includes:
  - Cloudflare Access protection for `/admin` and `/api/admin/*`
  - origin-side verification of `Cf-Access-Jwt-Assertion`
  - Cloudflare Access logout flow at `/cdn-cgi/access/logout`
  - no app-owned password, TOTP, backup codes, or admin session cookies
- Sandbox can temporarily use a secret-based bypass when `APP_ENV=sandbox` and `SANDBOX_ADMIN_BYPASS_SECRET` is configured.
- Vercel production env vars now need:
  - `CLOUDFLARE_ACCESS_AUD`
  - `CLOUDFLARE_ACCESS_TEAM_DOMAIN`

## Important Current Limitation

- Admin access now depends on Cloudflare Zero Trust being configured in front of the deployed admin hostnames.
- If `CLOUDFLARE_ACCESS_AUD` or `CLOUDFLARE_ACCESS_TEAM_DOMAIN` is missing, the app shows setup guidance and admin APIs return a setup error.
- Local development does not automatically simulate Cloudflare Access unless requests include a valid Access JWT.

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
  - `prisma/migrations/20260618010000_remove_admin_mfa_for_cloudflare_access/migration.sql`

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

- Required for Cloudflare-protected admin access:
  - `DATABASE_URL`
  - `CLOUDFLARE_ACCESS_AUD`
  - `CLOUDFLARE_ACCESS_TEAM_DOMAIN`
- Required for sandbox-only fallback login:
  - `APP_ENV=sandbox`
  - `SANDBOX_ADMIN_BYPASS_SECRET`
- If `DATABASE_URL` is missing:
  - public site still works with fallback data
  - admin content remains read-only locally
- Useful env files already present locally:
  - `.env.local`
  - `.env.production.local`

## Verification Completed

- `npm run prisma:generate`
- `npm run lint`
- `npm run build`
- Local visual check of `/admin/login` guidance page
- Production route smoke check with HTTP 200 on:
  - `/`
  - `/programs`
  - `/contact`
  - `/admin/login`

## Remaining Work

- Add the real `DATABASE_URL` in Vercel production if not already present.
- Apply Prisma migration to the real production database.
- Configure Cloudflare Access applications for sandbox and production admin hostnames.
- Add `CLOUDFLARE_ACCESS_AUD` and `CLOUDFLARE_ACCESS_TEAM_DOMAIN` in Vercel for each environment.
- Verify end to end with a real Cloudflare Access session:
  - `/admin` challenge appears for unauthenticated users
  - authenticated users can load admin UI
  - admin API calls succeed with valid Access JWT
  - `/cdn-cgi/access/logout` ends admin access

## Notes For Codex

- Read `AGENTS.md` first.
- This repo expects:
  1. commit and push after changes
  2. deploy latest state to Vercel production
  3. refresh Graphify output
- Avoid reverting unrelated user changes.
- Keep secrets out of git.
