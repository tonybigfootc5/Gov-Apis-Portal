# Vercel Deployment Guide

## Environment Variables Required

To deploy to Vercel, you must set the following environment variables in your Vercel project settings:

### Required Variables

1. **DATABASE_URL** (Required if using database features)
   - PostgreSQL connection string
   - Format: `postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require`
   - If not provided, the app will use fallback data

2. **ADMIN_PASSWORD** (Required for admin login)
   - Long random string for admin panel authentication
   - Example: A 32+ character random string

3. **ADMIN_SESSION_SECRET** (Required for admin sessions)
   - 32-byte random string for session encryption
   - Can be generated with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **NEXT_PUBLIC_SITE_URL** (Optional)
   - Public URL for Open Graph metadata
   - Default: `https://www.apiculture.in`

## Setup Instructions

### 1. Connect Repository
- Go to [Vercel Dashboard](https://vercel.com)
- Click "Add New" → "Project"
- Select the `tonybigfootc5/Gov-Apis-Portal` repository

### 2. Set Environment Variables
In Vercel Project Settings → Environment Variables, add:
```
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-long-random-password
ADMIN_SESSION_SECRET=your-32-byte-random-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Deploy
- Push to main branch or manually trigger deployment
- Vercel will automatically build and deploy

## Fallback Mode (Without Database)

If DATABASE_URL is not configured:
- The app will use fallback data
- All pages will render correctly
- Admin features and database queries will not work
- Perfect for static site deployment

## Troubleshooting

**404 Errors**: Ensure all environment variables are set in Vercel project settings

**Build Failures**: Check the Vercel build logs for specific errors

**Database Connection Issues**: Verify DATABASE_URL is correct and the database is accessible from Vercel's servers
