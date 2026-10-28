# CLAUDE.md — Ganesh Rahav Portfolio v2

Read first, every session: `/docs/decisions-v2.md` (source of truth), `/docs/design-spec.md` (the approved design), then `/docs/sprint-plan-v2.md`. Hero prototype: `/assets/design/`.

## What this is
Personal portfolio for Ganesh Rahav, a college student and Co-Founder and CTO of Tranzora Digital. Dark, clean look with one soft green accent and a light theme. Hero is a backlit silhouette of Ganesh that reveals his real photo under the cursor; the footer has a dot-pattern wordmark. Deployed on Vercel as a subdomain of tranzora.digital.

## Stack
Next.js 15.5 (App Router, pinned), React 19, TypeScript strict, Tailwind CSS v4, Vitest, Playwright. npm. Do not upgrade Next, React or TypeScript majors without being asked. Add a dependency only when the sprint needs it and say why.

## Honesty rules (never break)
- Do not invent clients, revenue, awards, certifications, experience, testimonials, statistics, projects or skills.
- Zero Day Crew does not appear anywhere. No projects section. No skill lists unless Ganesh confirmed them.
- WhatsApp number only behind a wa.me button, never as plain text.
- If information is missing: ask, use a clearly marked placeholder, or leave it out.

## Anti-slop rules
- Follow docs/design-spec.md exactly. Font: Hanken Grotesk only. No serif, no italics, one soft green accent only. The photo is never in a box or frame. Tags are outlined rectangles with 2px radius.
- Soft, calm, lots of space. No purple gradients, glassmorphism, stock images, emoji as icons, identical rounded-card grids, fake dashboards.
- No filler words: passionate, dedicated, eager to learn, cutting-edge, seamless, leverage.
- Colors, spacing, radii and font sizes come from tokens in `styles/globals.css`. No ad-hoc values.
- Every animation has a purpose and a `prefers-reduced-motion` fallback. The hero must work as a plain silhouette image with JS off, and with no cursor (touch) the photo is revealed by touch-drag or a one-time sweep.
- Copy is short, direct, first person, human. Content lives in `/content`, never hardcoded in components.

## Engineering rules
- Server Components by default; `"use client"` only for interactivity (canvas, menu, toggles).
- Canvas and animation code pauses when off-screen and caps pixel density on mobile.
- Secrets only through a validated env module; never commit `.env*`.
- Accessibility: semantic HTML, one h1, visible focus, 4.5:1 contrast in both themes, keyboard operable.
- Before marking work done: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` pass; check 390, 768, 1280, 1920px.

## Workflow
- One sprint at a time. Do not start the next sprint.
- Plan first and show it, then implement. Small commits with clear messages.
- End each sprint with: what was built, what was checked, what is still open, what is needed from Deva.
