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
- Latest commit at handover: `617664c`

## What Has Been Completed
- Homepage hero updated with stronger training-focused presentation.
- Header logo replaced with custom honeycomb artwork from `public/api-culture-logo.png`.
- Top navbar `Apply` button removed.
- Training application flow moved into the `Training` area:
  - users open `/programs`
  - select a training
  - open that training detail page
  - fill the application form inside that selected training page
- `/apply` now redirects to `/programs`.
- Admin page redesigned with a left sidebar and hamburger navigation.
- Admin sections now switch the right-side workspace so only the selected section shows.
- Admin sections available now:
  - `Overview`
  - `Services`
  - `Events`
  - `Applications`
  - `Articles`
- Applications admin includes:
  - search
  - filters
  - payment status
  - cross-check status
  - approval / rejection flow
- Articles admin is currently a local in-dashboard management UI:
  - `New article` button
  - left-side indexed article list
  - click an article to edit on the right
  - local save/delete behavior in the dashboard state

## Important Current Limitation
- The `Articles` section is UI-only right now.
- There is no Prisma `Article` model yet.
- There are no article APIs yet.
- There is no public `/articles` or `/articles/[slug]` page yet.
- If article persistence is needed next, build:
  - Prisma `Article` model
  - admin CRUD APIs
  - public article listing page
  - public article detail page
  - publish/unpublish behavior

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
- Training application backend:
  - `src/app/api/training-application/route.ts`
  - `src/app/api/admin/applications/route.ts`
  - `src/app/api/admin/applications/[id]/route.ts`
- Data access:
  - `src/lib/data.ts`
  - `src/lib/prisma.ts`
  - `src/lib/training-application.ts`
  - `src/lib/validators.ts`
- Prisma schema:
  - `prisma/schema.prisma`

## Current Admin Login
- Temporary admin password: `123456`
- Admin login page has password show/hide already added.

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
- If `DATABASE_URL` is missing:
  - public site still works with fallback data
  - admin can open in local preview mode
  - create/edit/delete actions are disabled or read-only where applicable
- Useful env files already present locally:
  - `.env.local`
  - `.env.production.local`

## Recent Commits
- `617664c` Redesign article admin into indexed editor
- `5b44dfa` Build article management workspace in admin
- `d7650c2` Move training application flow into programs
- `21e8138` Remove header logo frame
- `73e9ec8` Add articles section to admin navigation

## Suggested Next Steps
- Connect admin `Articles` section to database and public pages.
- Add article filters in the left article index:
  - all
  - published
  - draft
  - by category
- Add sticky apply CTA on training detail pages if needed.
- Improve public content strategy once articles are live.

## Notes For Laptop Codex
- Read `AGENTS.md` first.
- This repo expects:
  1. commit and push after changes
  2. deploy latest state to Vercel production
  3. refresh Graphify output
- Avoid reverting unrelated user changes.
- There are some untracked local-only items that should not be committed unless intentionally needed:
  - `.agents/`
  - `form.html`
  - `images and videos/dump/`
  - `skills-lock.json`
