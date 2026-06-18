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
ADMIN_PASSWORD="use-an-exact-24-character-password"
ADMIN_SESSION_SECRET="use-a-separate-long-random-secret"
ADMIN_TOTP_SECRET="use-your-google-authenticator-base32-secret"
ADMIN_BACKUP_CODES_HASHES="comma-separated-sha256-hashes-of-backup-codes"
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
- Security: admin-only password plus MFA, signed HTTP-only admin session cookie, input validation with Zod, no secrets in client code, security headers in `next.config.ts`.
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
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `ADMIN_TOTP_SECRET`
   - `ADMIN_BACKUP_CODES_HASHES`
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

Admin access is protected inside the application with two available sign-in paths:
- shared admin password
- authenticator TOTP or backup code

Either successful path creates the admin session.

1. Generate a 24-character password.
2. Generate a Google Authenticator compatible TOTP secret.
3. Generate backup codes and hash them before storing them in `ADMIN_BACKUP_CODES_HASHES`.
4. Add the admin password, session secret, TOTP secret, and backup-code hashes to both local env and Vercel production env.
5. Add the TOTP secret to your authenticator app using manual key entry or a compatible QR flow.
6. Keep the raw backup codes outside the repo in a secure vault.

Helpful commands:

```bash
node -e "const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';const crypto=require('crypto');let out='';while(out.length<24){out+=c[crypto.randomBytes(1)[0]%c.length]}console.log(out)"
```

```bash
node -e "const crypto=require('crypto');const a='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';let bits=0,v=0,o='';for(const b of crypto.randomBytes(20)){v=(v<<8)|b;bits+=8;while(bits>=5){o+=a[(v>>>(bits-5))&31];bits-=5}}if(bits>0)o+=a[(v<<(5-bits))&31];console.log(o)"
```

```bash
node - <<'EOF'
const crypto = require('crypto');
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const normalize = (value) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
const code = () => {
  let raw = '';
  while (raw.length < 10) raw += alphabet[crypto.randomBytes(1)[0] % alphabet.length];
  return `${raw.slice(0, 5)}-${raw.slice(5)}`;
};
const codes = Array.from({ length: 8 }, code);
const hashes = codes.map((value) => crypto.createHash('sha256').update(normalize(value)).digest('hex'));
console.log('Backup codes:');
console.log(codes.join('\n'));
console.log('\nADMIN_BACKUP_CODES_HASHES=' + hashes.join(','));
EOF
```


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
