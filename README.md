# Olymp Ex — Egyptian Fresh & Frozen Produce Exporter

Corporate site for **Olymp Ex**, an Egyptian agritrade export company, rebuilt on
Next.js 16. Single-page app with hash routing, a full Request-a-Quote (RFQ)
pipeline, and a hardened public API.

> **Branch history** — this branch merges two lineages: the original
> Vite/TanStack Start implementation (preserved in history) and the Next.js
> port, which is canonical from the merge commit onward. The `nextjs` branch
> points at the pre-merge port.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Forms | react-hook-form + zod (`@hookform/resolvers`) |
| Database | Prisma ORM + SQLite |
| Icons / fonts | lucide-react · Manrope · Fraunces · Cinzel (logo) |

## Getting started

```bash
bun install          # dependencies
cp .env.example .env # or create .env — see below
bun run db:push      # create the SQLite schema
bun run dev          # dev server on http://localhost:3000
```

`.env` needs one variable:

```
DATABASE_URL=file:<absolute path>/db/custom.db
```

## Scripts

| Script | Purpose |
|---|---|
| `bun run dev` | Dev server (port 3000) |
| `bun run lint` | ESLint |
| `bun run build` | Standalone production build |
| `bun run start` | Serve the standalone build |
| `bun run db:push` | Push `prisma/schema.prisma` to SQLite |
| `bun run db:generate` | Regenerate the Prisma client |

## Structure

```
src/
├── app/
│   ├── api/quote/route.ts   # RFQ endpoint (zod + Prisma + rate limit)
│   ├── api/route.ts         # health probe
│   ├── error.tsx            # route error boundary
│   └── global-error.tsx     # root error boundary
├── components/olymp/        # brand components + 11 views
├── data/products.ts         # product catalog & logistics data
└── lib/                     # router, zod schema, rate limiter, db client
```

## API — POST /api/quote

Accepts an RFQ submission. Hardening:

- **Rate limit** — 5 requests / minute / IP → `429` + `Retry-After`
- **Honeypot** — hidden `website` field; bots get a fake `201`, payload discarded
- **Payload cap** — 10 KB → `413`; strict zod validation → `400`
- **Security headers** — `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS;
  `X-Powered-By` removed

Responses: `201 {ok, id}` · `400 {ok:false, errors[]}` · `429` · `413` · `500`.

## Content

All copy is English-only. Brand mark: rainbow arc over three pyramid peaks
with a geometric `OLYMPEX` wordmark (diamond O), animated with a cinematic
entrance + recurring light sweep (respects `prefers-reduced-motion`).

## Deploying

### GitHub

`main` is the canonical branch:

```bash
git push github main
```

### Vercel

The repo deploys on Vercel with zero config (Next.js auto-detected):

1. Push to GitHub (above), then import the repo at
   [vercel.com/new](https://vercel.com/new) — or run `vercel --prod` with the
   Vercel CLI.
2. Set the **`DATABASE_URL`** environment variable in the project settings
   (any `file:` URL works for the build; see note below).
3. Deploy. `postinstall` runs `prisma generate` automatically.

> **SQLite note** — the RFQ endpoint writes to a local SQLite file, which
> works in dev but **not on serverless** (read-only filesystem). The site
> itself deploys and runs fully; to make quote submissions persist in
> production, point `DATABASE_URL` at a hosted database (Turso, Vercel
> Postgres, Neon, …) — the Prisma schema is one model and ports in minutes.

## License

Proprietary — © Olymp Ex. All rights reserved.
