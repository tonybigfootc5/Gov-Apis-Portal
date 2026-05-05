# Vercel Deployment Guide

## Environment Variables Required

Set these in your Vercel project settings before deploying:

1. **DATABASE_URL** (required for database-backed content)
   - PostgreSQL connection string
   - Format: `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`
   - If omitted, the public site falls back to bundled sample data

2. **ADMIN_PASSWORD** (required for admin login)
   - Use a long random string

3. **ADMIN_SESSION_SECRET** (required for admin sessions)
   - Use a 32-byte random string
   - Generate one with:
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **NEXT_PUBLIC_SITE_URL** (optional but recommended)
   - Public URL used for metadata and SEO
   - Example: `https://www.apiculture.in`

## Setup Instructions

### 1. Connect Repository
- Go to [Vercel Dashboard](https://vercel.com)
- Click `Add New` -> `Project`
- Select the `tonybigfootc5/Gov-Apis-Portal` repository
- Git URL: `https://github.com/tonybigfootc5/Gov-Apis-Portal.git`

### 2. Confirm Project Settings
- Framework preset: `Next.js`
- Root directory: repository root
- Do not set a custom output directory for this project

### 3. Set Environment Variables
In Vercel Project Settings -> Environment Variables, add:

```txt
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-long-random-password
ADMIN_SESSION_SECRET=your-32-byte-random-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. Deploy
- Push to `main` or trigger a redeploy from Vercel
- Vercel will build and deploy the Next.js app automatically

## Fallback Mode

If `DATABASE_URL` is not configured:
- The app uses fallback data for public pages
- The public website should still render
- Admin features and database-backed CRUD will not work

## Troubleshooting

**Full-site 404 after deploy**: Check that the Vercel project is linked to the repo root, uses the `Next.js` framework preset, and does not override the output directory.

**Build failures**: Review the Vercel build logs first. Most failures will be environment-variable or database related.

**Database connection issues**: Verify `DATABASE_URL` is valid and reachable from Vercel.
