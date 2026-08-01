# M.S Sultan Academy

An online learning platform teaching beginners in Nigeria and Africa practical ways to make money online using smartphones and AI tools.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Paystack (one-time + subscriptions + coupons)
- **AI:** Anthropic Claude API (AI Teacher, quiz generation, study plans)
- **Email:** Resend
- **Rate Limiting:** Upstash Redis
- **Hosting:** Vercel

## Features

- Beautiful mobile-first homepage, dark mode
- Email/password + Google OAuth authentication, email verification, password reset
- Student dashboard: enrolled courses, progress, certificates, wishlist, quiz history, payment history, referrals, AI study plan
- Admin dashboard: analytics, user management (roles/suspension/invites), course builder, quiz builder (drag-and-drop, AI-assisted), blog CMS, coupon management, certificate management, announcements
- Video lessons with PDF/audio/attachment resources, lesson-level progress tracking
- Quizzes with explanations, difficulty levels, categories, time limits
- Automatic PDF certificate generation on course completion
- Paystack payments: one-time course purchases, monthly subscriptions, coupon codes, invoices
- Referral program with automatic 10% reward on referred purchases
- In-app + email notifications, admin broadcast announcements
- AI Teacher: floating chat tutor with per-course memory, AI quiz generation, AI study plans
- Blog with Markdown content, tags, categories, SEO metadata
- SEO: dynamic metadata, sitemap.xml, robots.txt
- Security: rate limiting (auth/AI/contact), Zod input validation, CSP + security headers, RLS on every table

## 1. Installation

```bash
git clone <your-repo-url>
cd ms-sultan-academy
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see Environment Variables below), then:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 2. Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, used for admin invites & certificate cleanup) | Yes |
| `NEXT_PUBLIC_APP_URL` | Your deployed app URL | Yes |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (server-only, never expose) | Yes |
| `ANTHROPIC_API_KEY` | Claude API key for AI Teacher | Yes |
| `RESEND_API_KEY` | Resend key for transactional email | Yes |
| `RESEND_FROM_EMAIL` | Verified sender email in Resend | Yes |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | Yes |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` and `PAYSTACK_SECRET_KEY` must **never** be prefixed with `NEXT_PUBLIC_` and must never be committed to source control.

## 3. Database Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run every file in `supabase/migrations/` **in numerical order** (0001 through 0007).
3. Go to **Storage** and create these buckets, all marked **Public**:
   - `thumbnails`
   - `videos`
   - `resources`
   - `certificates`
   - `avatars`
4. Then run `0007_storage_buckets_and_policies.sql` (it must come after the buckets exist).
5. Go to **Authentication → Providers** and enable Google OAuth if you want Google Login (add your Google Cloud OAuth Client ID/Secret, with `https://<your-supabase-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI).
6. Go to **Authentication → URL Configuration** and set:
   - **Site URL:** your deployed app URL
   - **Redirect URLs:** `<your-app-url>/auth/callback` and `<your-app-url>/**`

### Promote a user to admin

```sql
update public.profiles
set role = 'admin'
where email = 'you@example.com';
```

### Seed a few categories (optional, recommended before creating courses)

```sql
insert into public.categories (name, slug, description) values
('Freelancing', 'freelancing', 'Learn to earn on Fiverr, Upwork, and more'),
('AI Tools', 'ai-tools', 'Master ChatGPT, Midjourney, and other AI tools'),
('Social Media', 'social-media', 'Grow and monetize social media accounts'),
('Digital Skills', 'digital-skills', 'Graphic design, writing, and other digital skills');
```

## 4. Local Development Commands

```bash
npm install
npm run dev          # start dev server on localhost:3000
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint
npm run build          # production build
npm run start          # run the production build locally
```

## 5. Deployment to Vercel

```bash
git add .
git commit -m "Production-ready build"
git push origin main
```

Then either via the Vercel dashboard (Import Project) or CLI:

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY production
vercel env add PAYSTACK_SECRET_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add RESEND_API_KEY production
vercel env add RESEND_FROM_EMAIL production
vercel env add UPSTASH_REDIS_REST_URL production
vercel env add UPSTASH_REDIS_REST_TOKEN production
vercel --prod
```

After the first successful deploy:

1. Set the Paystack webhook URL (Paystack Dashboard → Settings → API Keys & Webhooks) to:
   ```
   https://<your-domain>/api/paystack/webhook
   ```
2. Switch Paystack to **Live Mode** and swap in live API keys.
3. Update Supabase **Authentication → URL Configuration** to your production domain.
4. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to match your production domain.
5. Update `app/layout.tsx` (`metadataBase`), `app/sitemap.ts`, and `app/robots.ts` if you're using a custom domain different from the Vercel default.

## 6. Pre-Launch Checklist

- [ ] RLS enabled on every table (check Supabase Table Editor for lock icons, not "Unrestricted")
- [ ] Non-admin cannot access `/admin` (redirects to `/student`)
- [ ] `.env.local` is git-ignored and was never committed
- [ ] Paystack is in Live Mode with the webhook set and live secret key
- [ ] At least 2–3 real courses published with real content
- [ ] Supabase Auth redirect URLs point to production domain
- [ ] Full signup → verify → login → enroll → complete → certificate flow tested on a real phone
- [ ] Full payment flow tested with a real (small) transaction

## 7. Project Structure

```
app/
  (auth)/          — login, register, password reset, email verification
  (public)/         — homepage, courses, blog, pricing, checkout, FAQ, contact, AI tools
  (dashboard)/
    student/        — student dashboard, lessons, certificates, wishlist, etc.
    admin/          — admin dashboard, course/quiz/blog builders, users, analytics
  api/              — Paystack, AI, and payment verification route handlers
components/         — organized by feature area (dashboard, courses, lessons, etc.)
lib/
  supabase/         — client/server/admin Supabase clients + middleware logic
  queries/          — read-only Supabase queries, one file per domain
  actions/          — Server Actions (mutations), one file per domain
  validations/      — Zod schemas
  security/         — rate limiting, safe-action wrapper
  payments/         — shared payment fulfillment logic
  ai/, email/, certificates/, paystack/ — integration-specific helpers
supabase/migrations/ — SQL migrations, run in numerical order
```

## 8. Ongoing Maintenance

- **Backups:** Supabase free tier has no automatic backups — upgrade to a paid plan or run periodic `pg_dump` exports before you have paying customers.
- **Error monitoring:** Errors currently log to Vercel Function Logs. Consider adding Sentry for proactive alerts.
- **Storage growth:** Watch Supabase Storage usage as video content grows (Dashboard → Settings → Usage); consider a dedicated video host (Mux, Bunny.net) at scale.
- **AI usage/cost:** Monitor Anthropic API billing — AI Teacher and quiz generation are rate-limited per user, but total volume should still be tracked.
- **Dependency updates:** Run `npm outdated` periodically; re-test auth and payment flows after any Supabase or Next.js major version bump.

## License

Proprietary — all rights reserved.
