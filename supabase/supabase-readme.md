# Supabase setup

The app works with **no backend** — by default everyone is a **Guest** and
progress is saved in the browser's `localStorage`. Supabase is only needed to let
users **sign in** and sync progress across devices. If the two env vars below are
absent, the app silently stays guest-only (the "Sign in" button never appears).

- **Guest (default):** localStorage, per-browser, no account.
- **Signed in:** progress rows in Supabase, scoped per user via Row Level Security.

Sign-in is a **passwordless email magic link** — no passwords stored.

---

## 1. Create the project & tables

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - [`01_schema.sql`](./01_schema.sql) — tables, index, and the new-user trigger.
   - [`02_policies.sql`](./02_policies.sql) — Row Level Security policies.

This creates two tables:

| Table | Purpose |
|-------|---------|
| `certifications_profiles` | One row per user (auto-created on sign-up). |
| `certifications_lesson_progress` | One row per (user, cert, lesson): viewed cards, answers, completed. |

RLS ensures every user can read/write **only their own** rows, so the public
anon key is safe to ship in the client bundle.

## 2. Get your keys

**Project Settings → API**:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

## 3. Auth configuration (required for sign-in to work)

**Authentication → Providers → Email**: enable it (magic link is on by default).

**Authentication → URL Configuration** — this is the part that breaks silently if
skipped, because the magic link redirects back to your app:

- **Site URL:**
  ```
  https://prebenolsen.github.io/certifications/
  ```
- **Redirect URLs** (add each — include local dev):
  ```
  https://prebenolsen.github.io/certifications/
  http://localhost:5173/
  ```

> The app requests a redirect of `window.location.origin + import.meta.env.BASE_URL`,
> i.e. `…/certifications/` in production and `http://localhost:5173/` in dev. Every
> URL the app can redirect to must be listed here or Supabase rejects the link.

Supabase's built-in email has low rate limits — fine for personal use. For volume,
configure a custom SMTP provider under **Authentication → Emails**.

## 4. Provide the keys

**Local development** — create `.env.local` (gitignored) from `.env.example`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

**Production (GitHub Pages)** — add both as repository secrets:
**Settings → Secrets and variables → Actions → New repository secret**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The deploy workflow (`.github/workflows/deploy.yml`) injects them at build time.
Re-run the workflow after adding secrets so the built bundle picks them up.

---

## How progress syncs

- **First sign-in on a device:** if the account has no cloud progress yet, this
  browser's guest progress is imported into the cloud so nothing is lost.
- **After that:** the cloud is the source of truth; every card view / answer
  upserts its lesson row.
- **Sign out:** the app falls back to guest localStorage on that device.
