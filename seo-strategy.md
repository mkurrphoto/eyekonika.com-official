# Eyekonika SEO Strategy

## The Situation

**Competing brand:** Eyekonik (eyewear, Amsterdam) — completely different product. Name collision only matters for pure brand-name searches, not product queries. You're not competing for their customers.

**Real challenge:** New site, near-zero domain authority, almost no backlinks, thin content. That's the gap to close.

---

## 5 Pillars

### 1. Brand Entity Signals
Help Google understand Eyekonika is a distinct entity.
- Add social profile URLs to `sameAs` in the JSON-LD schema
- Submit to free directories: Crunchbase, LinkedIn Company page, About.me
- Keep name + URL + description identical everywhere
- **No physical address is fine** — change schema from `LocalBusiness` → `ProfessionalService`

**Needs from user:** Instagram URL, LinkedIn URL

---

### 2. On-Page Content (high leverage)
Current gaps:
- `what-we-do` component is completely empty
- Project pages have placeholder text ("description to be added")
- No FAQ content anywhere
- Image alt text is generic or missing

---

### 3. Content Hub / Blog
Target ~6 articles. These queries have real volume and zero overlap with Eyekonik eyewear.

| Article | Keyword logic |
|---|---|
| "What is subsurface laser engraving?" | Educates, owns the niche term |
| "Custom crystal awards for churches and nonprofits" | Direct buyer intent |
| "3D laser engraved donor recognition gifts" | Fundraising audience |
| "How to commission a custom crystal piece" | Captures research phase |
| "Crystal vs acrylic awards: which lasts longer?" | Comparison, high intent |
| "Commemorative gifts for monasteries and religious institutions" | Hyper-niche, near-zero competition |

Each article links to project pages and /contact — builds internal authority.

---

### 4. Backlinks
Backlinks = other sites linking to yours. Google treats them as trust votes.

**Realistic plays:**
- Ask existing clients (Holy Trinity Monastery, Lakewood, St. Tikhon's) to add a credit link on their site
- Submit to Orthodox Christian directories, nonprofit gift supplier listings, awards industry sites
- Once blog content exists: pitch to nonprofit fundraising newsletters and church administrator blogs

---

### 5. Technical Fixes
All implementable in code:
- [ ] Add `robots.txt`
- [ ] Add `lastmod` dates to sitemap.xml
- [ ] Change schema `@type` from `LocalBusiness` → `ProfessionalService`
- [ ] Add `sameAs` array with social URLs to JSON-LD
- [ ] Add FAQ schema to process page (earns rich results / extra SERP space)
- [ ] Image `alt` text audit across all pages

---

## Implementation Order

1. **Technical fixes** — robots.txt, schema, sitemap (quick)
2. **Fill `what-we-do` component** — write + build
3. **Complete project page descriptions** — need facts/story from user for each
4. **FAQ schema on process page**
5. **Build blog structure** — /blog index + first article

---

## Still Needed From User

- [ ] Instagram URL
- [ ] LinkedIn URL
- [ ] Project details for Jordanville (Holy Trinity Monastery) — occasion, what was made, what was meaningful
- [ ] Project details for Lakewood
- [ ] Project details for St. Tikhon's

---

## Google Search Console
Already set up. Use it to monitor which queries are showing impressions — this will guide which blog topics to prioritize first.
