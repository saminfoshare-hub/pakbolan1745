# PAK BOLAN INTERNATIONAL — Website (Real Backend)

This is the real, deployable version of the recruitment website: a Next.js
app backed by a shared Postgres database (Supabase), real authentication,
private document storage, and server-side email notifications. Unlike the
original single-HTML-file prototype, every visitor — on any device —
writes to and reads from the same central database.

## What's different from the old prototype

| | Old prototype | This project |
|---|---|---|
| Data storage | Browser localStorage (per-device) | Shared Postgres database (Supabase) |
| Visible to other visitors/devices | No | Yes — one shared dataset |
| Admin login | Hardcoded password in the HTML | Real Supabase Auth |
| Email notifications | Fake "queued" message only | Real emails via Resend |
| File uploads (CV/CNIC/photo) | Filename only, not stored | Actually stored, privately, in Supabase Storage |

## 1. Prerequisites

- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account
- A free [Resend](https://resend.com) account (for sending email)
- A [Vercel](https://vercel.com) account (for deployment) — or any host that
  supports Next.js

## 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**. Pick a
   name, a database password (save it somewhere), and a region close to
   Pakistan/your target audience.
2. Once the project is ready, go to **SQL Editor → New query**, paste in
   the entire contents of [`supabase/schema.sql`](./supabase/schema.sql),
   and click **Run**. This creates all tables, security rules, the private
   document storage bucket, and a few starter countries/categories/sample
   vacancies (edit or delete the sample rows any time from the admin
   dashboard once it's running).
3. Go to **Project Settings → API**. You'll need three values in a moment:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this one secret — never put it in
     client-side code or commit it to git)
4. Create your admin login: go to **Authentication → Users → Add User**,
   enter an email and password. Anyone who can log in with a Supabase Auth
   account can access `/admin` — only create accounts for people who should
   have that access.

## 3. Set up Resend (email notifications)

1. Sign up at [resend.com](https://resend.com) and verify a sending domain
   (or use their test domain while developing).
2. Create an API key under **API Keys**.
3. This is what sends you an email every time someone submits an
   application, an employer inquiry, or a contact message.

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values from steps 2–3:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM="PAK BOLAN INTERNATIONAL <notifications@yourdomain.com>"
NOTIFY_EMAIL=almirahmed638@gmail.com
```

## 5. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site,
and [http://localhost:3000/admin](http://localhost:3000/admin) to log in
with the admin account you created in step 2.4.

## 6. Deploy

The easiest path is [Vercel](https://vercel.com):

1. Push this project to a GitHub repo.
2. In Vercel, **Add New Project** → import that repo.
3. Add the same environment variables from `.env.local` in Vercel's
   **Project Settings → Environment Variables**.
4. Deploy. Vercel gives you a live URL immediately; you can attach your own
   domain afterward under **Project Settings → Domains**.

## Project structure

```
app/
  page.tsx                  Public homepage (hero, vacancies, apply, employer & contact forms)
  admin/                    Admin dashboard (login, vacancies, applications, employers, settings)
  api/
    apply/                  Candidate application submission (DB insert + file upload + email)
    employer-inquiry/       Employer manpower request submission
    contact/                General contact form submission
    admin/                  Authenticated CRUD routes used by the admin dashboard
components/                 Shared UI: forms, header/footer, admin nav/shell
lib/
  supabase/                 Browser, server, and service-role Supabase clients
  email.ts                  Resend email sending helpers
  types.ts                  Shared TypeScript types matching the database schema
supabase/schema.sql         Full database schema, security rules, and storage bucket setup
middleware.ts                Keeps admin sessions fresh and blocks unauthenticated /admin access
```

## Notes on security

- Row Level Security (RLS) is enabled on every table. Public visitors can
  only **insert** applications/inquiries/messages and **read** published
  vacancies — they can never read other people's data, even if they poke
  at the API directly.
- Candidate documents (CV, CNIC, passport, photo) are stored in a
  **private** Supabase Storage bucket. The public site never gets a direct
  link to them — the admin dashboard fetches short-lived (10 minute) signed
  URLs on demand.
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS entirely and is only ever
  used inside server-only API routes (`/api/apply`, `/api/employer-inquiry`,
  `/api/contact`) so that anonymous visitors can submit forms without being
  logged in. It is never sent to the browser.

## What's not included

This scaffold covers the core recruitment workflow end to end. A few things
you may want to add as the project grows:

- Rate limiting / spam protection (e.g. a CAPTCHA) on the public forms
- Pagination for the admin applications/vacancies tables once volume grows
- Password reset flow for admin accounts (Supabase Auth supports this —
  just needs a UI page)
- Automated tests
