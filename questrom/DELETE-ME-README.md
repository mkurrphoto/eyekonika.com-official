# /questrom/ — Course assignment, not part of Eyekonika LLC

Landing page for **Great Minds Cafe**, a hypothetical cafe built as a Questrom
group assignment. It has nothing to do with Eyekonika LLC, the crystal
engraving business, or the rest of this site.

Live at: <https://eyekonika.com/questrom/>,
<https://eyekonika.com/questrom/growth-strategy/> and
<https://eyekonika.com/questrom/flow-constraint-map/>

## Self-contained

Everything this page needs is inside this folder:

```
questrom/
├── index.html            Week 1 landing page — all HTML, CSS and JS inline
├── fonts/                2 woff2 files
├── images/               11 jpg/png files
├── growth-strategy/      Week 3 assignment — its own self-contained folder
│   ├── index.html        all HTML and CSS inline, NO JavaScript at all
│   ├── fonts/            the same 2 woff2 files, copied
│   └── images/           6 campaign jpgs + 3 brand pngs
└── flow-constraint-map/  Week 4 assignment — ONE file, nothing beside it
    └── index.html        HTML, CSS, JS, SVG and both fonts, all inline
```

The two subfolders are deliberately **siblings, not dependencies**. `growth-strategy/`
copies the fonts and logos rather than reaching up into `../`; `flow-constraint-map/`
carries everything inside the single file, fonts included as base64. Either can be
zipped or dropped onto Blackboard on its own and still render. The only link back is
a plain `../` href to the cafe page.

- No file outside `/questrom/` is referenced by it.
- No file outside `/questrom/` links to it.
- It does not touch `shared-css/`, `js/`, `components/`, or any production page.
- Course requirement is the filename `index.html`; because it sits in its own
  subfolder it does not conflict with the site's root `index.html`.

## Search visibility

Deliberately kept out of search results:

- `<meta name="robots" content="noindex, nofollow">` in all three `index.html` files
- `Disallow: /questrom/` in the site-root `robots.txt`
- **not** listed in the site-root `sitemap.xml`

The URL still works normally for anyone given the link.

## To delete it later

```bash
rm -rf questrom/
```

Then remove the two `/questrom/` lines from the site-root `robots.txt`, and the
"Course assignment page" section from `CLAUDE.md`. Nothing else needs changing.

## What's in the page

Deliberately a showcase of current (2026) platform features, all progressively
enhanced — the page is complete and readable with JavaScript off and none of
these supported:

- CSS scroll-driven animations (`animation-timeline: view()` / `scroll(root)`)
- View Transitions API — the day/dusk switch reveals as a circle out of the toggle
- variable-font axis animation (Fraunces `opsz` + `wght`) on the headline
- `@property`-typed custom properties (animated conic rim, pointer spotlight)
- container queries, `@scope`, `:has()`, `color-mix()`, `text-wrap`
- native CSS carousel (`::scroll-marker`, `::scroll-button()`)
- CSS anchor positioning + the Popover API
- `interpolate-size` + `::details-content` for height:auto transitions

The inline `<script>` only adds: theme persistence, the live open/closed pill,
the pointer light, the bento spotlight, magnetic buttons, and scroll-velocity
on the ticker. Nothing structural depends on it.

## `growth-strategy/` — MS718 Week 3, "Build Your Growth Campaign"

The campaign page for **The Introduction**, the cafe's in-house introduction
network. Built to the Week 3 prompt pack: the brief, then the three pieces in
funnel order (awareness → purchase → repeat & recommendation), each with its
image, its copy, and a line naming which of the four Smart-Spend questions it
answers. Below that, a shareholder debrief with a cost-vs-return chart, the
four-question check, and the red-team answer to "could the shop across the
street copy this?"

Deliberately different from the Week 1 page in two ways:

- **Zero JavaScript**, because the assignment's output rules forbid it. Day/dusk
  comes from `prefers-color-scheme` alone — there is no theme toggle here.
- **Chart colours are pinned, not themed.** The debrief band stays `#1B211F` in
  both colour schemes so the two series (`#C2802A` return, `#4E8FD6` cost) keep
  the contrast and colour-blind separation they were validated for. The same
  figures also appear as a real `<table>` under the chart, which is what a screen
  reader gets and what renders if the SVG doesn't.

All figures on the page are modelled illustrations for the assignment, and the
footer says so.

## `flow-constraint-map/` — MS718 Week 4, "Build Your Flow & Constraint Map"

A top-down plan of the cafe at Saturday peak with both flows drawn over each
other, the binding constraint lit, and six moves against it that redraw the map
and recalculate two readouts — completed journeys and cost to serve.

The operations story it tells is the one the assignment asks for, and the one
worth defending: **the single order point is the constraint.** The register is
the only station in the room that can do one thing at a time, so it caps the
morning at 152 orders against 190 arrivals, and 38 people leave without ordering.
Move A (cut the floater) is the trap — it saves $34 of payroll and loses $221 of
coffee, and cost to serve goes *up*. The move defended is **E**: re-sequence so
orders are taken out in the line and payment happens at the pass, plus a $22 wage
floor under the four people working the peak. 144 → 185 journeys, $4.17 → $3.61
to serve, $256 a Saturday for $18 spent.

Different from the other two pages in three ways:

- **One file and nothing else.** The brief says "one self-contained HTML file …
  so there's no images folder and no zip." The plan is inline SVG and both woff2
  fonts are base64 data URIs, which is where its 220 KB goes. Don't split it.
- **JavaScript is required here**, unlike Week 3 — but **no frameworks and no
  CDN**, also per the brief. It is vanilla JS and hand-written SVG.
- **The arithmetic has one source.** The `MOVES` object stores only primitives;
  every derived figure is computed from them at runtime. The proof table repeats
  those figures in the markup so the page is complete without scripting, so a
  changed primitive means re-checking the table.

The page opens in a short guided walkthrough that alternates between the customer's
chair and the cafe's; finishing or skipping it leaves the full console, which is
also what renders with JavaScript off.

## Notes

- The original delivery (`assignmentmim1/`) also shipped `.htaccess` and its own
  `sitemap.xml`. Both were left out on purpose: this site runs on Cloudflare
  Pages, which ignores `.htaccess` entirely, and a sitemap would work against
  keeping the page unindexed.
