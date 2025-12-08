# Dubiqo — Monorepo (React + Vite + Tailwind + Supabase)

**Dubiqo Digital Solutions** — _We build websites that build your business._

This repository is a production-ready monorepo scaffold for Dubiqo.
Stack: **React + Vite + TypeScript + Tailwind** (frontend) and **Supabase** (Auth, Postgres, Storage, Edge Functions, Realtime). All interactive flows (quotes, bookings, invoices, chat, analytics) are implemented as server-backed features via Supabase Edge Functions. The Admin Portal exists and is fully functional **but intentionally hidden** from the public site.

> ⚠️ **Careers module removed** — no careers routes, tables, functions, or admin UI exist in this repo.

---

## Table of contents

- [Project structure](#project-structure)
- [Quickstart — local dev](#quickstart---local-dev)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Supabase: migrations & seeds](#supabase-migrations--seeds)
- [Edge Functions](#edge-functions)
- [Admin Portal — hidden rules](#admin-portal---hidden-rules)
- [Auth & RBAC](#auth--rbac)
- [Testing & CI](#testing--ci)
- [Deployment](#deployment)
- [Observability & Security notes](#observability--security-notes)
- [Acceptance criteria](#acceptance-criteria)
- [Roadmap & next steps](#roadmap--next-steps)
- [License](#license)

---

## Project structure

```txt
dubiqo/
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  ├─ e2e.yml
│  │  └─ deploy.yml
│  └─ ISSUE_TEMPLATE.md
├─ apps/
│  ├─ web/                        # Vite React app (public site + client portal + hidden admin)
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ vite.config.ts
│  │  ├─ tailwind.config.js
│  │  ├─ postcss.config.cjs
│  │  ├─ public/
│  │  │  ├─ robots.txt            # include "Disallow: /admin"
│  │  │  └─ favicon.ico
│  │  ├─ src/
│  │  │  ├─ main.tsx
│  │  │  ├─ app/
│  │  │  │  ├─ routes/            # React Router pages
│  │  │  │  │  ├─ index.tsx
│  │  │  │  │  ├─ services/
│  │  │  │  │  ├─ portfolio/
│  │  │  │  │  ├─ case-studies/
│  │  │  │  │  ├─ pricing/
│  │  │  │  │  ├─ blog/
│  │  │  │  │  ├─ quote/
│  │  │  │  │  ├─ booking/
│  │  │  │  │  ├─ analytics-demo/
│  │  │  │  │  ├─ payment-demo/
│  │  │  │  │  ├─ downloads/
│  │  │  │  │  ├─ support/
│  │  │  │  │  ├─ faq/
│  │  │  │  │  └─ contact/
│  │  │  │  └─ admin/             # HIDDEN admin routes; never linked publicly
│  │  │ │     ├─ dashboard/
│  │  │ │     ├─ users/
│  │  │ │     ├─ invoices/
│  │  │ │     └─ audits/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ lib/                  # supabase client wrapper, auth helpers
│  │  │  ├─ styles/
│  │  │  └─ assets/
│  │  └─ index.html
│  └─ admin-console/              # optional separate admin app
│     ├─ package.json
│     └─ src/
├─ packages/
│  ├─ ui/                         # shared components + Storybook
│  ├─ types/                      # shared types
│  └─ sdk/                        # generated API client
├─ supabase/
│  ├─ migrations/                 # SQL schema migrations
│  ├─ seeds/
│  │  └─ dummy_data.sql
│  ├─ policies/
│  │  └─ rls_policies.sql
│  └─ functions/                  # Edge Functions
│     ├─ quote-create/
│     ├─ bookings-create/
│     ├─ create-checkout-session/
│     ├─ webhooks-stripe/
│     ├─ telemetry-ingest/
│     ├─ ai-insights/
│     └─ ticket-create/
├─ infra/
│  └─ terraform/                  # optional infra examples
├─ tests/
│  ├─ unit/
│  │  └─ quote.spec.ts
│  └─ e2e/
│     └─ playwright.config.ts
├─ docker-compose.yml
├─ pnpm-workspace.yaml
├─ package.json
├─ tsconfig.base.json
├─ .env.example
├─ .eslintrc.cjs
├─ .prettierrc
└─ README.md
```

---

## Quickstart — local dev

> Prereqs: Node >= 18, pnpm (or npm), Supabase CLI (optional but recommended), Docker (for local dev stack).

1. Clone repo:

```bash
git clone git@github.com:your-org/dubiqo.git
cd dubiqo
```

2. Install dependencies (pnpm recommended):

```bash
pnpm install
```

3. Create `.env` from `.env.example` and fill values. For local dev, you can create a free Supabase project or use the Supabase local emulator.

4. Start Supabase (local) or point to your dev Supabase instance:

```bash
# using supabase CLI (if installed)
supabase start
# or use a remote dev Supabase instance and set env vars accordingly
```

5. Run DB migrations and seeds:

```bash
pnpm run migrate
pnpm run seed
```

6. Start the web app (dev):

```bash
pnpm run dev:web
# or
pnpm --filter @dubiqo/web dev
```

7. Run a single Edge Function locally (example):

```bash
# Use supabase CLI to run locally if supported
# or run a node script that emulates the function handler
```

---

## Environment variables

Fill `.env` using `.env.example`. Important variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SENDGRID_API_KEY=
OPENAI_API_KEY=
SENTRY_DSN=
NEXT_PUBLIC_APP_URL= # e.g., http://localhost:5173
```

**Never commit real keys**. Use CI secrets for GitHub Actions.

---

## Scripts

Root `package.json` exposes workspace scripts:

```json
{
  "scripts": {
    "dev": "pnpm -w run dev:web",
    "dev:web": "pnpm --filter @dubiqo/web dev",
    "build": "pnpm -w build",
    "build:web": "pnpm --filter @dubiqo/web build",
    "test": "pnpm -w test",
    "test:unit": "vitest",
    "test:e2e": "playwright test",
    "storybook": "pnpm --filter @dubiqo/ui storybook",
    "migrate": "supabase db push --file supabase/migrations",
    "seed": "supabase db seed --file supabase/seeds/dummy_data.sql"
  }
}
```

---

## Supabase: migrations & seeds

- All SQL migrations live under `supabase/migrations/` (timestamped SQL files).
- Seeds under `supabase/seeds/dummy_data.sql` provide sample projects, case studies, blog posts, sample admin & client accounts, quotes, bookings, invoices.
- Run migrations with Supabase CLI:

```bash
supabase migration run
supabase db seed --file supabase/seeds/dummy_data.sql
```

---

## Edge Functions

Edge Functions are TypeScript folders under `supabase/functions/`. Each must:

- Validate input (Zod).
- Authenticate requests when necessary (supabase JWT or service role).
- Use service role key only in server-side contexts (Edge Functions).
- Log actions to `audit_logs`.

List of core functions:

- `quote-create` — save quotes and email notifications.
- `bookings-create` — transactional booking reservation + ICS generation.
- `create-checkout-session` — create Stripe checkout session.
- `webhooks/stripe` — handle Stripe webhooks (verify signature).
- `telemetry-ingest` — store events.
- `ai-insights` — call OpenAI for analytics insights.
- `ticket-create`, `ticket-reply`, `ai-ticket-assist`.
- `presign-upload`, `admin/backup`, `admin/restore`, integrations (HubSpot/QuickBooks).

---

## Admin Portal — hidden rules (MUST FOLLOW)

- **No public links**: Do not include any link to `/admin` in header, footer, sitemap, or search.
- **Robots**: Add `Disallow: /admin` to `public/robots.txt`. Add `<meta name="robots" content="noindex,nofollow">` in admin pages.
- **Unified login**: Login page is the same for all users — no role selection.
- **Auto-redirect after login**:

  ```js
  if (profile.role === 'admin' || profile.role === 'staff') redirect('/admin');
  else if (profile.role === 'client') redirect('/client-portal');
  else redirect('/');
  ```

- **Server-side enforcement**: Admin endpoints must check role server-side (Edge Functions or RLS). Client-side gating alone is insufficient.
- **Audit logs**: Admin actions (impersonation, invoice edits, deletes) must be logged in `audit_logs`.
- **403 on unauthorized access**: If a non-admin attempts `/admin`, return 403 or redirect to home.

---

## Auth & RBAC

- Supabase Auth used for signup/login.
- `profiles` table stores `role`.
- Roles: `admin`, `staff`, `client`.
- RLS policies grant selective access:
  - `clients` can only read their own `projects`, `quotes`, `invoices`, `tickets`.
  - `staff` and `admin` have broader access.

- Admin accounts are created through seeds or admin invite flow.
- Admins should enable MFA in production.

---

## Testing & CI

- **Unit tests**: `tests/unit/` (Vitest / Jest). Core logic: quote calculator, booking validation, webhook handler.
- **E2E tests**: Playwright in `tests/e2e/`. Tests: signup/login, quote create, booking create, Stripe checkout simulation, file upload.
- **Accessibility**: Axe checks integrated in CI.
- **Visual tests**: Chromatic/Percy for Storybook stories.
- **Load tests**: `k6` scripts available in `tests/load/`.
- **GitHub Actions** workflows:
  - `ci.yml` runs lint, test, storybook build, accessibility, Lighthouse.
  - `e2e.yml` runs Playwright.
  - `deploy.yml` builds and deploys frontend + Edge Functions.

---

## Deployment

- Frontend: static build deployed to Vercel (recommended) or Supabase static hosting.
- Edge Functions: deployed to Supabase via CLI in CI.
- Set production environment variables in GitHub/host provider secrets.
- Use Stripe test keys for testing; use Stripe CLI to forward webhooks locally.

---

## Observability & Security notes

- Instrument frontend & Edge Functions with OpenTelemetry (sample wiring included).
- Send errors to Sentry (client + server).
- Store logs as structured JSON; include `request_id`.
- Provide Prometheus-exporter guidance and sample Grafana dashboards in `infra/`.
- Recommend using Vault/KMS for rotating keys in production.
- Run OWASP ZAP scans and Snyk dependency checks in CI.

---

## Acceptance criteria

1. `pnpm run dev:web` boots the web app and connects to Supabase dev instance.
2. `supabase` migrations + seed load the DB (no careers tables).
3. User can register/login (no role selection) and is redirected automatically to `/admin` (if admin) or `/client-portal` (if client).
4. Quotes: create, persist, email via SendGrid (test).
5. Bookings: reserved transactionally, double-book prevented; email + ICS generated.
6. Invoice & payment: create invoice → Stripe Checkout → webhook updates DB.
7. Playwright E2E tests for core flows pass.
8. RLS prohibits cross-client data leaks (tests included).
9. Admin portal accessible only by admin role and hidden from public site.

---

## Roadmap & next steps

- **Phase 1 (Core)**: Public site, client portal, quote, booking, invoice/payment, Supabase migrations, one Edge Function (`quote-create`).
- **Phase 2 (Admin + AI)**: Hidden admin portal, ai-ticket-assist, ai-insights, telemetry ingestion, Stripe webhook handling.
- **Phase 3 (Infra & Enterprise)**: Backups, feature flags governance, marketplace + referral, Terraform infra templates, OPA policy checks, multi-region patterns.

---

## Troubleshooting

- If Edge Functions fail locally: ensure Supabase CLI is running and env vars set.
- Stripe webhooks failing: use Stripe CLI to forward webhooks and verify webhook secret matches `STRIPE_WEBHOOK_SECRET`.
- RLS blocking access: check `supabase/policies/` for correct policy definitions and test using Supabase SQL console.

---

## Contact & support

If you need help setting up Supabase, Stripe, or OpenAI, include the service account keys in a secure vault and follow the `README` section on secrets. For emergency incidents, follow the runbook in `infra/docs/runbooks.md`.

---

## License

[MIT](LICENSE)

---

If you want, I can now:

- Produce this file as an actual `README.md` with front-matter and project badges.
- Generate the initial skeleton files for `apps/web` and one sample Edge Function (`quote-create`) so you have a runnable Phase 1.
- Export `.env.example` content ready to paste.

Which would you like next?
