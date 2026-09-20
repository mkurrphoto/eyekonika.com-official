# /questrom/ — Course assignment, not part of Eyekonika LLC

Landing page for **Great Minds Cafe**, a hypothetical cafe built as a Questrom
group assignment. It has nothing to do with Eyekonika LLC, the crystal
engraving business, or the rest of this site.

Live at: <https://eyekonika.com/questrom/> and
<https://eyekonika.com/questrom/growth-strategy/>

## Self-contained

Everything this page needs is inside this folder:

```
questrom/
├── index.html            Week 1 landing page — all HTML, CSS and JS inline
├── fonts/                2 woff2 files
├── images/               11 jpg/png files
└── growth-strategy/      Week 3 assignment — its own self-contained folder
    ├── index.html        all HTML and CSS inline, NO JavaScript at all
    ├── fonts/            the same 2 woff2 files, copied
    └── images/           6 campaign jpgs + 3 brand pngs
```

`growth-strategy/` is deliberately a **sibling, not a dependency**: it copies the
fonts and logos rather than reaching up into `../`, so the folder can be zipped or
dropped onto Blackboard on its own and still render. The only link between the two
is a plain `../` href back to the cafe page.

- No file outside `/questrom/` is referenced by it.
- No file outside `/questrom/` links to it.
- It does not touch `shared-css/`, `js/`, `components/`, or any production page.
- Course requirement is the filename `index.html`; because it sits in its own
  subfolder it does not conflict with the site's root `index.html`.

## Search visibility

Deliberately kept out of search results:

- `<meta name="robots" content="noindex, nofollow">` in both `index.html` files
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

## Notes

- The original delivery (`assignmentmim1/`) also shipped `.htaccess` and its own
  `sitemap.xml`. Both were left out on purpose: this site runs on Cloudflare
  Pages, which ignores `.htaccess` entirely, and a sitemap would work against
  keeping the page unindexed.
