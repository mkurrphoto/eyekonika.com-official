# Step Page Concepts for Timeline Journeys

This document proposes dedicated page structures for the first four process timeline steps (Vision, Discovery, Prototype, Production), replacing the current `generic.html` links.

## Shared Page System (applies to all four pages)

- **Immersive hero with step progress**: top section with step number (`01/04`, etc.), concise value proposition, and “Continue to next step” CTA.
- **Sticky mini-timeline rail**: a vertical or horizontal indicator showing all 4 core steps, with current step highlighted.
- **“Glass-first” visual language**: frosted cards, subtle blur, layered gradients, soft glows, and high-contrast typography for a premium contemporary look.
- **Motion strategy**: micro-interactions on hover, scroll-reveal blocks, and optional reduced-motion fallback.
- **Cross-step persistent CTA**: fixed bottom-right action chip (“Book Consultation” or “Request Quote”) for conversion continuity.
- **Trust layer**: quality standards, laser precision indicators, and use-case snippets available as expandable accordions.

---

## Step 01 Page — Vision (“It Starts With a Feeling”)

### Recommended layout
1. **Hero panel (split layout)**
   - Left: emotional positioning copy (“From instinct to clarity”).
   - Right: cinematic loop/video or parallax image of crystal piece in ambient light.
2. **Intent capture section**
   - A guided “What are you creating?” chooser (memorabilia / corporate gift / campaign centerpiece / fundraiser).
3. **Moodboard stream**
   - Swipeable cards with style directions: minimalist, prestigious, artistic, heritage.
4. **Outcome framing**
   - “What success looks like” content blocks (brand impact, retention value, display prestige).
5. **CTA footer**
   - “Start the conversation” + quick calendar or form entry.

### Interactive elements
- **Dynamic brief starter**: 3-question wizard updates a live summary card (“Your concept profile”).
- **Aesthetic slider**: user drags between “Subtle” and “Bold” and sees visual examples shift.
- **Smart prompt chips**: tappable prompts (“Commemorative launch,” “Collector piece,” etc.) that prefill inquiry form.

### Contemporary design trends to use
- Bento-grid content blocks.
- Soft glassmorphism layers.
- Kinetic typography for headline fragments.

---

## Step 02 Page — Discovery (“We Sit With Your Idea”)

### Recommended layout
1. **Consultation hero**
   - Focus on collaborative planning and precision quote process.
2. **Question architecture map**
   - A visual map of factors considered: size, depth, finish, lighting, display context, quantity.
3. **Scenario explorer**
   - Interactive cards for use-cases (luxury retail, gala auction, internal recognition, investor event).
4. **Transparent pricing philosophy**
   - Explain quote drivers without exposing hard pricing if not desired.
5. **Decision-readiness panel**
   - Checklist users can complete before requesting final quote.

### Interactive elements
- **Config estimator (non-binding)**:
   - Inputs for quantity, complexity, finish class.
   - Output as relative tier (“Signature / Prestige / Collector”).
- **Live “Scope completeness” meter**:
   - As users answer discovery prompts, a meter fills toward “Ready for quote.”
- **FAQ accordion with intent routing**:
   - Selecting “I need this by a date” or “I need fundraising ROI guidance” surfaces relevant next-step modules.

### Contemporary design trends to use
- Progressive disclosure (show complexity only when needed).
- Interactive data chips and pill toggles.
- Clean enterprise-style UI blended with luxury visuals.

---

## Step 03 Page — Prototype (“You See It Before We Make It”)

### Recommended layout
1. **Proofing hero**
   - Emphasize confidence: “Approve every detail before production.”
2. **Preview gallery block**
   - Side-by-side concept render variants (lighting, angle, engraving depth simulation).
3. **Prototype pathway**
   - Two tracks: Digital proof path vs Physical sample path.
4. **Revision loop explainer**
   - Timeline strip with revision rounds and approval checkpoints.
5. **Sign-off module**
   - Clear handoff when concept is approved.

### Interactive elements
- **3D viewer / pseudo-3D rotator**:
   - Rotate crystal mockup and inspect engraving from multiple angles.
- **Before/after depth slider**:
   - Compare flat artwork vs translated 3D engraving form.
- **Annotation mode**:
   - Users click areas to leave comments (“increase depth,” “adjust logo placement”).
- **Approval simulator**:
   - “Approve with notes” flow demonstrating what happens next.

### Contemporary design trends to use
- Real-time preview behavior.
- Workspace-style UI (comment pins, version chips).
- Subtle neon edge glow on active prototype states.

---

## Step 04 Page — Production (“Made to an Exacting Standard”)

### Recommended layout
1. **Craftsmanship hero**
   - Visual of laser process and K9 optical glass standards.
2. **Production pipeline strip**
   - Stage cards: material prep → calibration → engraving passes → inspection → finishing.
3. **Quality assurance deep-dive**
   - “At every pass” validation blocks with measurable checkpoints.
4. **Scale confidence module**
   - “1 to 1000 units” comparison framing consistency controls.
5. **Delivery readiness CTA**
   - Encourage transition to Step 05 relationship/delivery narrative.

### Interactive elements
- **Process scrubber**:
   - Horizontal timeline where dragging reveals each production stage animation.
- **Quality checkpoint reveal**:
   - Clickable hotspots on a crystal model showing tolerances and inspection criteria.
- **Batch consistency visualizer**:
   - Small simulation showing how quality remains consistent across order volume.
- **Material integrity explainer**:
   - Hover cards describing why K9 optical glass is selected.

### Contemporary design trends to use
- Storytelling through scroll-driven panels.
- Technical UI overlays atop high-end photography.
- Minimal, high-contrast charts and metrics.

---

## Cross-page Interaction Architecture (recommended)

- **Persistent step navigator** with previous/next transitions and optional keyboard navigation.
- **Saved journey state** (session/local storage) so users resume where they left off.
- **Context-aware CTA messaging**:
  - Step 1: “Share your vision”
  - Step 2: “Define your scope”
  - Step 3: “Review your prototype”
  - Step 4: “Confirm production”
- **Lightweight personalization**:
  - Form answers from earlier pages pre-populate later steps.

## Content tone and UX principles

- Keep copy **premium, precise, and reassuring**.
- Use **short paragraphs + strong headers** to maintain scanability.
- Pair emotional storytelling (Vision) with operational confidence (Production).
- Ensure accessibility: high contrast, keyboard support, reduced motion mode, explicit labels.

## Suggested build sequence

1. Build a reusable “step page shell” template.
2. Ship Step 01 and Step 02 first (highest consultation impact).
3. Add Step 03 interactive proofing components.
4. Add Step 04 production storytelling + quality modules.
5. Connect all timeline buttons to dedicated step URLs.
