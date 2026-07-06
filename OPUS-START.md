# Eyekonika Redesign — Opus Starting Prompt

> Paste everything below this line as your first message in the Opus session.
> The session should be opened in /home/mkurrphoto/eyekonika.com-official
> so that CLAUDE.md is auto-loaded as context.

---

Read CLAUDE.md in this directory before doing anything else. It contains the full project context: architecture, design system, constraints, and what's already been built.

Once you've read it, your job is to continue building the Eyekonika redesign. Here is the current state and your task list:

## What already exists (don't rebuild these)
- `shared-css/design-tokens.css` — CSS custom property foundation (all color, type, spacing tokens)
- `index-dev.html` — full redesigned home page (hero + process teaser + crystal gallery + contact form + footer)

## Your tasks, in priority order

---

### Task 1 — `contact-dev.html`

A standalone contact page. Model it after `contact.html` (read that file — it's good and has the right copy) but restyled to match the dev design system.

**Layout:** Two-column on desktop (form left, side panel right), stacks on mobile.

**Form fields** (same as contact.html, preserve all):
- Name* (required)
- Email* (required)
- Organization (optional)
- "Do you have a clear design concept?" radio group (yes-clear / still-exploring)
- "What is the subject of the engraving?" radio group (building-monument / abstract / logo / something-else)
- "Do you have a 3D model?" radio group (yes / no / not-sure)
- "When does your project need to be completed?" text input
- "Tell us about your project" textarea

**Side panel** (same as contact.html):
- "Prefer a call?" card → Calendly link `https://calendly.com/eyekonika`
- Client logo grid (4 logos from `images/clients/`)

**Header:** Same pattern as `contact.html` — full-bleed dark hero with Cormorant heading, back-to-home link.

**Style rules:**
- All CSS tokens from `shared-css/design-tokens.css`
- Radio buttons: custom styled with `var(--glow-cool)` dot, not browser defaults
- Form validation same as contact.html (inline JS, no external library)
- Submit via fetch to `https://formspree.io/f/movyqgop`
- On success: fade form out, show confirm message
- `noindex, nofollow`
- Link back to `index-dev.html` (not `index.html`)

---

### Task 2 — `projects-dev.html`

Full portfolio page. Read `projects.html` to understand what exists (it's a basic slider — replace it entirely).

**Design:** Editorial full-bleed grid. Same crystal-card system as `index-dev.html` gallery section (copy the `.crystal-wrap / .crystal-tilt / .crystal-glow / .crystal-inner` pattern and JS exactly).

**Category filter tabs** above the grid:
- All | Liturgical | Institutional
- Clicking a tab filters cards by `data-category` attribute
- Active tab: `var(--glow-warm)` bottom border, white text
- Inactive: `var(--text-faint)`, no border

**Cards to include** (use these exact images and labels):

| Image | Title | Category |
|-------|-------|----------|
| `images/project_photos/St. Alexander Nevsky Cathedral.JPG` | St. Alexander Nevsky Cathedral | Liturgical |
| `images/project_photos/key_image_st_tikhons-monastery-waymart_PA.JPG` | St. Tikhon's Monastery | Liturgical |
| `images/project_photos/front-detail-high-detail-st-tikhons-monastery-waymart-PA.JPG` | St. Tikhon's — Detail | Liturgical |
| `images/project_photos/reverse of St. Tikhons model.JPG` | St. Tikhon's — Reverse | Liturgical |
| `images/project_photos/Lakewood_main_image.JPG` | Lakewood Memorial | Institutional |
| `images/project_photos/Lakewood_top_down_with_double_lighting.JPG` | Lakewood — Dual Light | Institutional |
| `images/project_photos/unusual_angle_lakewood_model.JPG` | Lakewood — Detail Angle | Institutional |
| `images/process/Gracanica_Cinematic.jpg` | Gracanica Monastery | Liturgical |
| `images/process/gracanica_model_with_other_engravings_in_the_background_eyekonika.JPG` | Gracanica — Full Display | Liturgical |
| `images/process/Eyekonika_EngravedDetail.jpg` | Engraved Detail — Close-up | Institutional |

**Grid:** 3 columns desktop → 2 tablet (≤900px) → 1 mobile (≤540px). Cards use `aspect-ratio: 4/3`.

**Page header:** Dark hero panel, Cormorant heading "Our Past Projects", brief subtitle, back link to `index-dev.html`.

**No sidebar on this page** — standalone page with just a minimal top nav (logo + back to home), same pattern as `contact.html`'s `cn-topbar`.

**CTA at bottom:** Link to `contact-dev.html` — "Start your own project →"

---

### Task 3 (only if time/tokens allow) — Apply tokens to `process-dev.html`

Read `process.html`. That page has a very polished 3D cube interface — don't replace it. Instead, create `process-dev.html` as a copy with:
- `shared-css/design-tokens.css` linked
- Background color → `var(--bg-void)`
- Heading font → `var(--font-display)` Cormorant Garamond
- Accent color (currently blue) → `var(--glow-cool)` or `var(--glow-warm)` where appropriate
- `noindex, nofollow`

---

## Output format
- Output each file as a complete file, not a diff
- State the filename clearly before each code block
- After each file, briefly confirm what you did and what comes next
- Do not explain every CSS property — just build and note anything non-obvious

## Important — read before starting
- Read `index-dev.html` to understand the exact HTML/CSS/JS patterns to replicate (crystal cards, tilt JS, observer, lenis init, form handler). Copy these patterns exactly rather than reinventing them.
- Read `contact.html` for the contact page copy and structure to preserve.
- Link `shared-css/design-tokens.css` AND `components/sidebar-component/sidebar.css` in the `<head>` of any page that uses the sidebar.
- For standalone pages (no sidebar), skip those two links and use your own minimal layout.
- Always include the Google Fonts import for Cormorant Garamond + Inter + Poppins.
- Formspree endpoint is always `https://formspree.io/f/movyqgop` — do not change it.
