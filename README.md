# Ganesh Rahav — Portfolio

Personal portfolio for Ganesh Rahav. See `CLAUDE.md` for the project brief,
`docs/decisions-v2.md` for the source of truth on content and design
decisions, and `docs/sprint-plan-v2.md` for the sprint plan. This repo is
currently at **Sprint 1 (Foundation)**.

## Stack

Next.js 15.5 (App Router, pinned), React 19, TypeScript (strict), Tailwind
CSS v4, Vitest, Playwright. npm.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script              | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build                             |
| `npm run start`     | Run the production build                     |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run lint`      | ESLint                                       |
| `npm run format`    | Prettier, write mode                         |
| `npm test`          | Vitest (unit/content tests)                  |
| `npm run test:e2e`  | Playwright (builds and starts the app first) |

## Structure

```
app/          Routes (App Router)
components/   layout/, sections/, ui/ — empty until Sprint 2
content/      Typed content — the only source of copy, facts and links
lib/          env.ts and other non-UI helpers
styles/       globals.css — Tailwind import + design tokens (Sprint 2)
public/       Static assets served as-is
tests/        unit/ (Vitest) and e2e/ (Playwright)
docs/         Decisions and sprint plan (do not edit without Ganesh/Deva)
assets/       Reference files for the hero prototype (do not edit)
```

## Content and honesty rules

All copy lives in `content/`. Nothing is invented: every fact, stat and
link traces back to `docs/decisions-v2.md`. `tests/unit/content.test.ts`
fails the build if a `Stat` isn't marked `verified: true`, or if any
content file mentions "Zero Day Crew" (which must never appear on this
site).

## CI

`.github/workflows/ci.yml` runs on every push/PR: install, typecheck,
lint, test, build. Playwright e2e is a local-only skeleton for now (not
yet wired into CI).
