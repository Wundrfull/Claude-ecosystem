# Phase 3 Review — Slides 19-27

Dark hygiene slides (24-27) feel intentional; light CLAUDE.md cluster (19-23) has persistent top-half void with content floating around vertical middle.
Recurring issues: top-half whitespace on light slides, terminal chrome too small vs H1s, axis shifts between H1 (left) and content (center).
Strongest: 24, 25, 26. Weakest: 23 (missing payload), 27 (prose-as-slide).

---

**Slide 19 — Description rule (03-skills.html)**
- Grade: C
- What's on it: H1 "Descriptions say when, never what." with two labeled example pairs.
- Issues:
  - Top half of slide is empty; content starts near vertical middle.
  - No visual separation between bad/good cards — reads as one block.
  - Footnote italic is center-indented, breaking the left margin.
  - No bad/good cue (no color, no strikethrough, no card).
- Fixes:
  - `slides/sections/03-skills.html` — wrap pairs in side-by-side `.card` grid; `border-left: 3px solid var(--medium-grey)` on "what" card (muted), `3px solid var(--captech-blue)` on "when".
  - Promote "what — skipped" / "when — invoked" to shared `.kicker` style (uppercase, `var(--medium-grey)`, 0.75rem) matching slides 20/23.
  - Left-align the footnote to slide margin.
  - Pull block up ~120px so H1 sits at ~30% from top.

---

**Slide 20 — CLAUDE.md + memory divider (04-claude-md.html)**
- Grade: B
- What's on it: Timecode kicker, two-line H1 "CLAUDE.md and auto memory", subtitle, tree card.
- Issues:
  - H1 wraps awkwardly — "CLAUDE.md" and "and auto memory" read as equal weight.
  - Tree card is narrow, bottom-left; right half empty.
  - Annotations "behavior contract, in the repo" are crammed inline with filename chips.
- Fixes:
  - `slides/sections/04-claude-md.html` — change H1 to "CLAUDE.md + auto memory" (single line, shorter).
  - Add a right column with a one-line takeaway "one you write · one Claude writes" in `.kicker`.
  - Move annotations below each chip at `font-size: 0.9rem; color: var(--medium-grey)` instead of inline.

---

**Slide 21 — Five-line CLAUDE.md (04-claude-md.html)**
- Grade: C
- What's on it: Kicker, H1 "A behavior contract, not a README", terminal mockup, five numbered rules.
- Issues:
  - Terminal centered, rules left-aligned — two axes, no shared grid.
  - Numbers and text collide ("01State the plan") — no gap.
  - Terminal shows only `> git p`, zero payload; decorative.
  - Rules are the story but visually subordinate to empty terminal.
- Fixes:
  - `slides/sections/04-claude-md.html` — either drop the terminal, or render the 5 lines as CLAUDE.md file content inside it so chrome reinforces content.
  - Add `padding-right: 0.6em` to `.rule-num` span.
  - Align rules to H1's left edge; if keeping terminal, put rules LEFT of terminal in 2-col grid, not below.
  - Demote "Under 200 lines..." italic to `.kicker` style.

---

**Slide 22 — Auto memory (04-claude-md.html)**
- Grade: B
- What's on it: Kicker "NEW IN v2.1.59", H1, tree card, terminal, long caption.
- Issues:
  - Tree and terminal stacked vertically, both centered — two unrelated floating objects.
  - Caption runs edge-to-edge (~1900px); dominant and unreadable.
  - H1 left-aligned, rest center-aligned — axis change mid-slide.
- Fixes:
  - `slides/sections/04-claude-md.html` — 2-col grid: tree left, terminal right.
  - Caption `max-width: 60ch`, left-align to H1 axis, break into two sentences.
  - Highlight `MEMORY.md` chip with `--yellow` accent so the eye lands there.

---

**Slide 23 — gqlgen one-liner (04-claude-md.html)**
- Grade: D
- What's on it: Yellow kicker, terminal with `> go run github.com`, caption.
- Issues:
  - Only dark-bg slide in this cluster — jarring, no reason.
  - Terminal does NOT show the "one line" the slide promises; payload missing.
  - Kicker is 11 words and acts as H1 — there is no real H1.
  - "TEMPLATE TRAVELS" badge top-right is unexplained.
- Fixes:
  - `slides/sections/04-claude-md.html` — swap to light bg to match 20/21/22, OR add a white H1 "The one line." to justify the dark treatment.
  - Render the actual rule in the terminal (the gqlgen `go generate` guard line) — without it, the joke has no punchline.
  - Shorten kicker to "THE ONE LINE THAT PAYS FOR ITSELF".
  - Remove or explain the "TEMPLATE TRAVELS" badge (tie to the two-environment motif).

---

**Slide 24 — Context hygiene divider (05-context-hygiene.html)**
- Grade: A
- What's on it: Timecode kicker "19:00 — 22:30", H1 "Context hygiene", caption.
- Issues: None significant. Clean divider.
- Fixes: No changes required.

---

**Slide 25 — 77.2 / 78.2 (05-context-hygiene.html)**
- Grade: A-
- What's on it: Kicker "Sonnet 4.5 · SWE-bench Verified", H1, two giant stats with Δ+1.0, accuracy line chart.
- Issues:
  - Strong slide — best in set.
  - Chart has no endpoint markers; viewer misses that accuracy holds at ~74%.
  - "TOKEN COUNT" axis label overlaps "1M" tick.
- Fixes:
  - `slides/sections/05-context-hygiene.html` — add 8px `var(--captech-blue)` dots at 200K and 1M endpoints.
  - Left-align "TOKEN COUNT" at x=0 or move below tick row.

---

**Slide 26 — Context rot quote (05-context-hygiene.html)**
- Grade: A-
- What's on it: Small kicker, degradation curve with shaded 200K-1M region, verbatim quote with blue left-rule, URL.
- Issues:
  - Chart has no y-axis label (slide 25 had "ACCURACY"); inconsistent.
  - Shaded region is olive on blue-grey — muted contrast loses the "danger zone" message.
  - URL doesn't visually tie to the quote.
- Fixes:
  - `slides/sections/05-context-hygiene.html` — add "ACCURACY" label top-left of chart for consistency with slide 25.
  - Swap shade to `rgba(253, 218, 36, 0.12)` using `--yellow` so it reads as warning, not neutral.
  - Prefix URL with "→ " or em-dash.

---

**Slide 27 — Decision rule: /clear /compact /context (05-context-hygiene.html)**
- Grade: C
- What's on it: Kicker, H1 "When to /clear, /compact, or /context.", three vertically-stacked command blocks.
- Issues:
  - Brief called for "three mini context grids" — no grids/visuals here. Pure prose stacked vertically.
  - All three blocks styled identically — no visual cue for which to pick when.
  - 7+ lines per command; past the 2-3 focal elements cap.
  - Bottom "Quit and re-launch" italic is a fourth idea on a three-idea slide.
- Fixes:
  - `slides/sections/05-context-hygiene.html` — restructure as 3-col grid, each column a card with (a) command name in mono/`--captech-blue` header, (b) one-line trigger, (c) outcome as muted chip.
  - Add a tiny context-fill bar per card (empty for /clear, half for /compact, full for /context) — that's the "mini context grid" the brief references.
  - Move "Quit and re-launch" note to speaker notes or a footer kicker.
  - Pull content up; top 25% is empty like 19-22.
