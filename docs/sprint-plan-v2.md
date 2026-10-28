# Ganesh Rahav Portfolio v2 — 8-Sprint Plan

Sources: docs/decisions-v2.md (wins), assets/hero-preview.html (hero prototype).
By scope, not dates. Every sprint ends with a Vercel preview, a short report, and a review before the next one starts.

## Ground rules
1. Content lives in `/content`. Nothing invented.
2. Done = typecheck, lint, tests and build pass; preview deployed; screenshots at 390, 768, 1280, 1920px; reduced motion works.
3. Run the anti-slop rules in CLAUDE.md at the end of every sprint.

## Sprint 1 — Foundation (Sonnet)
New repo. Next.js 15.5 (pinned), React 19, TypeScript strict, Tailwind v4, ESLint, Prettier, Vitest, Playwright skeleton, GitHub Actions CI, Vercel previews, security headers, env handling, content types with tests, CLAUDE.md and docs in the repo. Done: blank homepage deploys, CI green.

## Sprint 2 — Design system and shell (Sonnet)
Tokens for dark (default) and light themes with the green accent from docs/design-spec.md, Hanken Grotesk via next/font, Button, Tag (outlined rectangle), Section, Reveal, header with Tranzora logo, brand text, sound and theme toggles and the two-line menu button, full-screen menu, smooth scroll, skip link. Done: a style page shows everything in both themes; keyboard accessible; contrast checked.

## Sprint 3 — Hero (Sonnet)
Silhouette hero exactly as in the spec: huge name, tagline, tags, header over the image, cursor reveal (masked real photo over the silhouette, eased), touch sweep and drag, reduced-motion fallback, photo fade and About rise on scroll, responsive image (AVIF/WebP, priority load), mobile layout with the image on top, reduced-motion fallback. Done: LCP under 2s on throttled mobile, no layout shift, works with JS off.

## Sprint 4 — About, Tranzora, How I work (Sonnet)
About text and facts, Tranzora Digital panel (Co-Founder and CTO, what the company does, link), 4-step "Learn, Build, Test, Ship" row. Copy approved line by line. Needs Deva's Tranzora description.

## Sprint 5 — Contact and footer (Opus)
Dot-pattern footer wordmark as a canvas engine (dots burst outward around the cursor, static image fallback assets/design/wm3-*.png), contact section (email and WhatsApp wa.me button, GitHub, Instagram). Done: every link verified.

## Sprint 6 — Sound and theme polish (Sonnet)
Wire sound toggle to real clips (opt-in, lazy, off under reduced motion), remember theme and sound choice (try/catch storage), theme transition. Needs sound clips.

## Sprint 7 — SEO, domain, analytics (Sonnet)
Metadata, Open Graph image, JSON-LD, sitemap, robots, canonical, subdomain on tranzora.digital (Vercel, CNAME, HTTPS, backlink from the Tranzora site), cookie-free analytics. Needs subdomain name and DNS access.

## Sprint 8 — Performance, accessibility, QA, launch (Opus)
Lighthouse 95+, JS budget, screen reader and keyboard pass, contrast in both themes, real-phone test, Playwright smoke tests, honesty audit of every claim and link against decisions-v2.md, launch and rollback checklist, handoff notes for editing `/content`.

## Needs from Deva by sprint
1 repo + Vercel · 4 Tranzora description · 6 sound clips · 7 subdomain name + DNS access.
