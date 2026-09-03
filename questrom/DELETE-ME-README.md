# /questrom/ — Course assignment, not part of Eyekonika LLC

Landing page for **Great Minds Cafe**, a hypothetical cafe built as a Questrom
group assignment. It has nothing to do with Eyekonika LLC, the crystal
engraving business, or the rest of this site.

Live at: <https://eyekonika.com/questrom/>

## Self-contained

Everything this page needs is inside this folder:

```
questrom/
├── index.html            single file — all HTML, CSS inline; zero JavaScript
├── fonts/                2 woff2 files
└── images/               11 jpg/png files
```

- No file outside `/questrom/` is referenced by it.
- No file outside `/questrom/` links to it.
- It does not touch `shared-css/`, `js/`, `components/`, or any production page.
- Course requirement is the filename `index.html`; because it sits in its own
  subfolder it does not conflict with the site's root `index.html`.

## Search visibility

Deliberately kept out of search results:

- `<meta name="robots" content="noindex, nofollow">` in `questrom/index.html`
- `Disallow: /questrom/` in the site-root `robots.txt`
- **not** listed in the site-root `sitemap.xml`

The URL still works normally for anyone given the link.

## To delete it later

```bash
rm -rf questrom/
```

Then remove the two `/questrom/` lines from the site-root `robots.txt`, and the
"Course assignment page" section from `CLAUDE.md`. Nothing else needs changing.

## Notes

- The original delivery (`assignmentmim1/`) also shipped `.htaccess` and its own
  `sitemap.xml`. Both were left out on purpose: this site runs on Cloudflare
  Pages, which ignores `.htaccess` entirely, and a sitemap would work against
  keeping the page unindexed.
