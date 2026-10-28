# Design spec (final direction, 2026-10-27)

References in `assets/design/`: `reference-design-source.html` (full page markup and CSS, dark and light), `reference-hero-reveal.html` (hero with the cursor reveal shown), `style-reference-hero.png` (typography and layout inspiration), hero images, footer wordmarks. Build to match. Copy is final unless decisions-v2.md says otherwise.

## Principles
Quiet, editorial, lots of space. Huge tight type, thin dividers, outlined rectangular tags, one soft green accent. No boxes around the photo.

## Tokens
Dark (default): bg #0C120F, surface #141C18, line #27322C, text #F2F4F3, muted #A3ADA7, accent #9BE0BB, button fill #9BE0BB with text #0C120F.
Light: bg #ECEFED, surface #F6F8F7, line #CBD2CE, text #0C120F, muted #4E5953, accent #17724A, button fill #0C120F with text #EAF5EE.
The hero is always dark in both themes (text #F2F4F3, tag border rgba(242,244,243,.38), first tag filled #9BE0BB with text #0C120F). Text contrast 4.5:1 or better (3:1 only for 24px+ text). Theme via data-theme; remember choice in localStorage inside try/catch.

## Type
Hanken Grotesk 400/500/600 via next/font. Display weight 500, tracking -0.04 to -0.05em, line-height 0.9–1.05. Body 18–20px, line-height 1.55. Eyebrow 12px, 600, uppercase, 0.12em. Highlighted headline words use the accent colour.
Desktop sizes: name 152, contact headline 92, section headline 60, Tranzora headline 48, step title 30. Mobile: 76, 46, 38, 34.

## Layout
Max width 1440, side padding 80 (20 mobile). Section padding 120 (80 mobile). Radii: tags and buttons 2px, panel 6px. Buttons 54px, tags 12px 20px padding. Touch targets 44px minimum.

## Sections
1. Hero (900px desktop). Two stacked full-bleed images, object-fit cover, aligned right: base silhouette (hero-silhouette.jpg) and the real photo (hero-glow.jpg) on top, hidden by a radial mask that follows the cursor. Header over the image: logo circle + "GANESH RAHAV" (uppercase, 600) left; sound toggle, theme toggle and two-line menu button right (two 2px lines, 50px wide, 9px apart). Copy bottom-left (left 80, bottom 112): name "Ganesh / Rahav", tagline "I don't just learn technology. / I build with it.", tags: Co-founder & CTO (filled green), Tranzora Digital, B.Sc. IT · Cybersecurity, Trichy, India. Mobile: image first (540px, object-position about 78%), header over it, copy below on the dark hero background.
2. About (01): "A student from Trichy, building a company while I study." (second part in accent). Paragraph: "I'm completing a B.Sc. in Information Technology with Cybersecurity at Jamal Mohamed College while building Tranzora Digital as co-founder and CTO. I learn by building things that have to work." Three facts under a divider: Based in, Studying, Building.
3. Tranzora Digital (02): one panel, two columns. Left: logo, tag "Co-founder & CTO", headline "Tranzora Digital: a digital growth partner that recommends only what creates value." (second part accent), paragraph, filled button "Visit tranzora.digital". Right: numbered list with dividers: Website development, SEO, Digital branding, Paid advertising, AI automations.
4. How I work (03): "Learn by building." Four columns with a divider and dot on top: 01 Learn (Pick up what the project needs.), 02 Build (Make a real version, not a demo.), 03 Test (Break it before a user does.), 04 Ship (Put it live, then start again.). Last dot in accent. Mobile: stacked.
5. Contact (04): centred "Have something worth building? Let's talk." (second sentence accent). Filled button with email ga4.rahav7@gmail.com; outline button "Message on WhatsApp" (wa.me/918438275577 with prefilled text). Text links: GitHub, Instagram, Tranzora Digital.
6. Footer: giant dot-pattern wordmark "GANESH RAHAV" (wm3-dark.png / wm3-light.png), then "© 2026 Ganesh Rahav · Trichy, India" and "Back to top".

## Hero motion
- Cursor reveal: on pointermove set CSS variables --x and --y on the hero and apply to the top image `mask-image: radial-gradient(circle 210px at var(--x) var(--y), #000 0, #000 52%, transparent 100%)`. Ease the position (lerp via requestAnimationFrame) so it glides. Radius grows slightly while moving. Start hidden until the first pointer move.
- Touch (no hover): one slow automatic sweep of the reveal across the face on load, then touch-drag reveals under the finger. Reduced motion: no sweep; show the silhouette and let a tap or keyboard focus on a "See photo" control toggle the full photo.
- Accessibility: base image alt "Silhouette portrait of Ganesh Rahav against a soft green glow"; the reveal layer is decorative (alt empty). Name is real h1 text.
- Scroll: the hero fades back slightly and About rises over it. Reduced motion: plain scroll.
- Footer wordmark: dot canvas, dots burst outward in a green star around the cursor; static image on touch and reduced motion.
- Section reveals: short fade and rise, once.

## Photo note
The hero images are derived from an AI-generated studio portrait made from Ganesh's own photo. They must stay faithful to his real look.

## Not in v2
No gymnastics or personal section, no projects, no Zero Day Crew, no skill lists, no contact form, no dot portrait, no stock photos.
