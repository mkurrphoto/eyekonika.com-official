# Eyekonika.com — Project Context for Claude Code

## What This Is
Static HTML/CSS/JS site for Eyekonika LLC — a custom subsurface laser crystal engraving company serving Orthodox churches, monasteries, universities, and institutions. No build system, no framework, no npm. Hosted on Cloudflare Pages pulling from GitHub (main branch → eyekonika.com).

---

## Two Parallel Codebases

### Production (`index.html`, `contact.html`, etc.)
**Do not modify these unless explicitly asked.** They are the live site. Leave them alone while the redesign is in progress.

### Dev Redesign (`index-dev.html`, `contact-dev.html`, etc.)
All redesign work uses the `-dev.html` suffix convention. These are:
- Monolithic (all HTML/CSS/JS in one file — no component injection)
- `<meta name="robots" content="noindex, nofollow">` on every dev page
- Accessible at `eyekonika.com/[page]-dev.html`
- Internally link to each other with `-dev.html` hrefs

---

## Production Site Architecture (don't change this)

`index.html` is a shell with placeholder divs. `js/load.js` fetches each component's HTML via `fetch()` and injects into slots, then loads `js/vendor/main.js` and `js/gallery-carousel.js` sequentially.

**Component injection slots in index.html:**
- `#sidebar-selector` → `components/sidebar-component/sidebar.html`
- `#introduction` → `components/introduction-component/introduction.html`
- `#proceses` → `components/proceses-component/proceses.html`
- `#gallery` → `components/gallery-component/gallery.html`
- `#get-in-touch` → `components/get-in-touch-component/get-in-touch.html`
- `#footer` → `components/footer-component/footer.html`

**Standalone pages:** `process.html`, `projects.html`, `contact.html`, `our-story.html`, `journey.html`, `begin.html`, `projects/jordanville.html`, `projects/st-tikhons.html`, `projects/lakewood.html`

---

## Dev Page Architecture

Dev pages are fully self-contained — sidebar HTML inline, all sections inline, CSS in a `<style>` block (or a linked dev CSS file), JS at bottom of body. No component injection.

**Already built:**
- `index-dev.html` — home page (full redesign)
- `shared-css/design-tokens.css` — CSS custom property foundation
- `contact-dev.html` — two-column contact form + side panel (Calendly card, client logos); custom `--glow-cool` radios, inline validation, Formspree submit
- `projects-dev.html` — hero + fixed project index rail + 3 alternating featured-project rows (link to production `projects/*.html`) + closing CTA. Each row carries a 3-thumbnail strip of that project's supporting angles; every thumbnail links to the project page
- `process-dev.html` — hero + 5 alternating numbered steps (K9/200k/0 stats on step 04) + closing CTA (step-06 copy). Editorial layout, NOT a port of the production 3D cube (`process.js`)
- `our-story-dev.html` — full-bleed hero + 5 editorial sections (origin, craft pull-quote, why, founder, CTA), reveal-on-scroll. Founder photo is still a "Photo" placeholder — needs a real image

**Still to build:**
- Nothing outstanding. All planned `-dev` pages are complete.

**Open follow-ups:**
- `process-dev.html` uses an editorial layout rather than porting the production 3D rotating cube (`process.js`). Decide whether to port that interaction. (Settled for `projects-dev.html` — see below.)
- `our-story-dev.html` founder photo placeholder awaits a confirmed image of Matthew Kurr.
- Detail pages still leak to production: `js/project-page.js` builds its back link as `/projects.html#${slug}`, so `projects-dev.html` → detail → back lands on the **production** projects page. Fix when the redesign is promoted; it needs a production JS edit.
- Image weight: project photos are 2–9 MB unoptimized JPEGs (~30 MB on `projects-dev.html`). `width`/`height`, `decoding`, and lazy/eager hints are in place, but real relief needs WebP/AVIF derivatives + `srcset`, which means adding an image step to a site with no build.

---

## Design System (LOCKED — do not re-litigate)

```css
/* From shared-css/design-tokens.css */
:root {
  --bg-void:    #0a0a0d;
  --bg-surface: #0f0f14;
  --bg-raised:  #141419;

  --glow-warm:  #f4ede0;   /* primary accent, crystal light */
  --glow-cool:  #7fb8c9;   /* links, category tags */
  --glow-blue:  #60a5fa;   /* legacy — phase out */

  --text-primary: #e8e4dc;
  --text-muted:   rgba(232, 228, 220, 0.50);
  --text-faint:   rgba(232, 228, 220, 0.25);

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', 'Poppins', sans-serif;
  --font-ui:      'Poppins', sans-serif;

  --section-pad-v: clamp(80px, 10vw, 140px);
  --section-pad-h: clamp(24px, 5vw, 80px);

  --border-subtle: 1px solid rgba(232, 228, 220, 0.07);
  --border-light:  1px solid rgba(232, 228, 220, 0.14);

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Typography rules:**
- Display/headings: Cormorant Garamond, often italic, weight 300–500
- Body copy: Inter
- Nav labels, buttons, eyebrows: Poppins, uppercase, tracked
- Google Fonts import: `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&family=Poppins:wght@300;400;500`

**The signature interactions (established in index-dev.html):**
- **3D tilt:** `mousemove` on `.crystal-tilt` → `rotateX` / `rotateY` ±11° with `perspective(900px)`. `data-tilting` attribute added on `mouseenter` to suppress the return transition; removed on `mouseleave`.
- **Glow:** `.crystal-glow` div inside `.crystal-tilt`, same `background-image` as the card photo, `filter: blur(45px) brightness(0.40)`, `mix-blend-mode: screen`, `opacity: 0` → `0.85` on hover.
- **Fade-in:** IntersectionObserver, threshold 0.1, staggered via `data-stagger` attribute (0, 1, 2...), 90ms per step. JS adds `.is-visible` which transitions `opacity: 0 → 1` and `translateY(22px) → 0`.
- **No background parallax** (per spec — remove any `background-attachment: fixed` or GSAP parallax on background positions).

---

## CDN Libraries (already on every dev page — do not re-import)
- GSAP 3.12.5: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- Lenis 1.1.20: `https://unpkg.com/lenis@1.1.20/dist/lenis.min.js` (also `lenis.css`)
- Available globally as `gsap`, `ScrollTrigger`, `window.lenis`

## Vendor Scripts (already in `js/vendor/` — use these)
`jquery.min.js`, `jquery.scrollex.min.js`, `jquery.scrolly.min.js`, `browser.min.js`, `breakpoints.min.js`, `util.js`, `main.js`

`main.js` is the Hyperspace template core — it removes `is-preload` from body on window load (which triggers sidebar animation), and initialises scrollex-based active link tracking on `#sidebar nav a`.

---

## Sidebar Structure (Hyperspace template)

The sidebar is `position: fixed; left: 0; width: 15em; height: 100vh`. Content wrapper `#wrapper` gets `margin-left: 14em` (set in `shared-css/main.css`). At `≤1280px` sidebar collapses to a 3.5em topbar; `#wrapper` gets `padding-top: 3.5em`. At `≤736px` sidebar is hidden; a `.mobile-nav` element slides in after scrolling past the hero.

All sidebar layout CSS is in `components/sidebar-component/sidebar.css` — link this in the `<head>` of dev pages.

---

## Forms
All forms use Formspree endpoint `https://formspree.io/f/movyqgop`. Honeypot: `<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />`. Submit via `fetch()` with `Accept: application/json` header. On success: hide form, show confirm div. On error: re-enable button, show error text.

---

## Assets Available
**Hero/gallery images (ready to use):**
- `images/project_photos/St. Alexander Nevsky Cathedral.JPG`
- `images/project_photos/key_image_st_tikhons-monastery-waymart_PA.JPG`
- `images/project_photos/front-detail-high-detail-st-tikhons-monastery-waymart-PA.JPG`
- `images/project_photos/Lakewood_main_image.JPG`
- `images/project_photos/Lakewood_top_down_with_double_lighting.JPG`
- `images/project_photos/unusual_angle_lakewood_model.JPG`
- `images/project_photos/reverse of St. Tikhons model.JPG`
- `images/process/Gracanica_Cinematic.jpg`
- `images/process/Eyekonika_EngravedDetail.jpg`
- `images/process/gracanica_model_with_other_engravings_in_the_background_eyekonika.JPG`
- `images/process/see_before_mass_production.JPG`
- `images/backgrounds/Eyekonika_Hero.jpg` (hero background)
- `images/backgrounds/Eyekonika_ContactSection.jpg` (contact section bg)
- `images/misc/PXL_20251231_195947317.PORTRAIT.ORIGINAL.jpg` (and several more in misc/)

**Client logos (for trust strip):**
- `images/clients/JordanvilleLogo.png`
- `images/clients/st-tikhons-logo.png`
- `images/clients/HTCS-Logo-FIN.avif`
- `images/clients/hts-seminary-logo.png`

**Brand:**
- `images/brand/Eyekonika_logo_blue_rectangle.png` (primary logo, use on dark)
- `images/brand/favicon.png`

---

## Constraints — Never Break These
- Formspree endpoint: always `https://formspree.io/f/movyqgop`
- Canonical URLs: preserve on every page
- Existing `index.html` and all production pages: untouched
- `shared-css/main.css`: do not edit
- Sidebar anchor IDs (`#intro`, `#one`, `#two`, `#three`): preserved on index-dev.html
- `noindex, nofollow` on every `-dev.html` page
- FontAwesome social icons work via class names like `icon brands fa-instagram` (loaded via main.css → fontawesome-all.min.css)

---

## What index-dev.html Contains
Read the file before making changes. Key sections:
- `#intro` — hero with Cormorant heading, trust strip, scroll indicator
- `.process-teaser` (`#one`) — 4-step teaser grid, links to `process.html`
- `.gallery-dev` (`#two`) — 6-card crystal grid with tilt/glow, links to `projects.html`
- `.git-section` (`#three`) — contact form, dark card
- `.dev-footer` — social icons, nav links

All interactions (tilt, observer, form, lenis) are in the inline `<script>` at the bottom of `index-dev.html`.

---

## What projects-dev.html Contains

**No catalogue UI — do not re-litigate.** There are only three projects. Filter bars, search, tag chips, and dense index/article lists were considered and rejected: over three items they advertise emptiness, and they break the page's cinematic register. Navigability here means the whole set is visible at once and no image is a dead end.

Key sections:
- `.pj-topbar` — logo + "Back to Home"
- `.pj-rail` — fixed project index, one entry per project (tick + number + name). Real `#slug` anchors, so jumps work with JS off
- `.pj-hero` — Cormorant italic heading, eyebrow, tagline
- `.pj-featured` — 3 alternating `article.feature-row`, each `id`'d with its slug. Row contents: counter, location, type, name, description, "View Project" link, and a `.feature-thumbs` strip of 3 supporting images
- `.pj-cta` — closing CTA → `contact-dev.html`
- `.dev-footer`

**Rules specific to this page:**
- Project names, locations, and types are canonical in `js/projects-data.js` (which also drives `projects/*.html` and the production slider). Change them there first, then mirror. Markup is intentionally static, not rendered from the module — the page must work without JS.
- Every image lives inside an `<a>`. Thumbnails duplicate a link already in the row, so they carry `tabindex="-1" aria-hidden="true"` and empty `alt`.
- The rail is fixed and lives in a left gutter opened by `body { padding-left: 320px }` at `≥1280px`; below that the rail is `display: none`. The rail is capped at `250px` and names wrap — "St. Alexander Nevsky Cathedral" is 271px on one line and would overlap the content.
- Scroll-spy uses one ScrollTrigger per row with `endTrigger` set to the *next* row, so the ranges are contiguous and exactly one entry is lit at a time. The last row holds through the CTA and footer.
- Rail clicks are handed to `window.lenis.scrollTo`, falling back to `scrollIntoView` when Lenis is absent (reduced motion).

All interactions (rail scroll-spy, rail jump, deep-link resync, observer, tilt, lenis) are in the inline `<script>` at the bottom of `projects-dev.html`.

---

## Course assignment page — `/questrom/` (unrelated to Eyekonika)

`questrom/` holds a landing page for **Great Minds Cafe**, a hypothetical cafe
built for a Questrom group assignment. It is **not** Eyekonika content and is
not part of the redesign.

- Fully self-contained: `questrom/index.html` (inline CSS, no JS) + `questrom/fonts/` + `questrom/images/`
- Nothing outside the folder references it; nothing inside it references the site
- `noindex, nofollow` on the page, `Disallow: /questrom/` in `robots.txt`, absent from `sitemap.xml`
- Do not modify it, link to it, or fold it into the site's CSS/JS
- To remove: `rm -rf questrom/`, drop the `/questrom/` lines from `robots.txt`, and delete this section. See `questrom/DELETE-ME-README.md`
