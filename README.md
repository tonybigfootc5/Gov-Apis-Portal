# API CULTURE - Technology Center

Production-ready website for **API CULTURE Technology Center (Apiculture & Beekeeping)**, Rajendranagar, Hyderabad.

## Project Structure

```txt
src/app                  Next.js App Router pages and route handlers
src/app/api              Backend API routes for contact, admin auth, CRUD
src/components           Reusable UI and client-side admin/contact components
src/lib                  Prisma client, validation, auth, data helpers
prisma/schema.prisma     PostgreSQL data model
prisma/seed.ts           Initial training/event content
public/                  Optimized public assets
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
CLOUDFLARE_ACCESS_AUD="your-cloudflare-access-application-aud"
CLOUDFLARE_ACCESS_TEAM_DOMAIN="https://your-team.cloudflareaccess.com"
```

3. Generate Prisma and migrate PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

4. Run the app:

```bash
npm run dev
```

Admin URL: `/admin`

## Implementation Notes

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, `next/image`, `lucide-react`.
- Backend: Next.js route handlers under `src/app/api`.
- Database: PostgreSQL with Prisma ORM.
- Security: Cloudflare Access protected admin routes with origin-side JWT verification, input validation with Zod, no secrets in client code, security headers in `next.config.ts`.
- SEO: Metadata API, Open Graph, sitemap, robots rules.
- Resilience: public pages fall back to bundled institutional data if the database is unavailable during early deployment.

## GitHub Workflow

```bash
git init
git add .
git commit -m "Initial Honey House production website"
git branch -M main
git remote add origin https://github.com/tonybigfootc5/Gov-Apis-Portal.git
git push -u origin main
```

Use meaningful commit messages such as:

```txt
Add program registration fields
Improve admin event validation
Update Honey House gallery assets
```

## Vercel Deployment

1. Push the repository to GitHub.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Framework preset: **Next.js**.
5. Add environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `CLOUDFLARE_ACCESS_AUD`
   - `CLOUDFLARE_ACCESS_TEAM_DOMAIN`
6. Use a managed PostgreSQL provider such as Vercel Postgres, Neon, Supabase, or Railway.
7. Run production migrations:

```bash
npm run prisma:deploy
```

8. Deploy. Vercel will automatically build on every push to `main`.

Build verification:

```bash
npm run lint
npm run build
```

## Admin Access Setup

Admin access is protected by Cloudflare Access, and MFA should be enforced in Cloudflare Zero Trust rather than inside the application.

1. In Cloudflare Zero Trust, create or update Access protection for the production admin hostname.
2. Enforce MFA in the Access policy or through your identity provider's MFA requirement.
3. Copy the Access application AUD value into `CLOUDFLARE_ACCESS_AUD`.
4. Copy your Zero Trust team domain into `CLOUDFLARE_ACCESS_TEAM_DOMAIN`.
5. Keep `/admin` and `/api/admin/*` behind the same Cloudflare Access policy in production.

Local development will not simulate Cloudflare login by itself. To test local admin flows against Access, use a real Access-protected hostname or a Cloudflare-authenticated request flow.


## GoDaddy Domain to Vercel

1. Open the Vercel project.
2. Go to **Settings -> Domains**.
3. Add the domain, for example:

```txt
apiculture.in
www.apiculture.in
```

4. In GoDaddy DNS, use Vercel's recommended records.

For apex/root domain:

```txt
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 or default
```

For `www`:

```txt
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 or default
```

5. Return to Vercel and click **Verify**.
6. HTTPS is issued automatically by Vercel after DNS propagation.
7. Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final canonical URL, for example:

```txt
https://www.apiculture.in
```

DNS propagation can take a few minutes to 24 hours depending on GoDaddy cache state.
