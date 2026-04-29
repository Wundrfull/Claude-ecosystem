# Phase 3 Review — Slides 28-35

**Summary.** Mixed. Slide 28 and 32 work. Slide 29 tokenizer is broken (text runs together). Slide 30 divider is dull — no promised "redacted-cell grid." Slide 31 is an oversized lock icon ONLY, with no content. Slide 33 five-terminals is readable but crowded. Slide 34 three-levers reprise has the SAME layout bug as slide 6 — grid collapses to a vertical list.

Grades: **A: 28, 32** · **B: 33, 35** · **C: 30, 34** · **F: 29, 31**.

---

**Slide 28 — Survives compaction (05-context-hygiene.html)**
- Grade: A
- What's on it: "What survives /compact" kicker, h2 "Skills re-attach. Tails get cut.", 20×10 context grid in compact state (purple fills top rows, free outlines below), terminal typing `/compact F`, three takeaway paragraphs, footnote about auto-compaction env var.
- Issues: none serious. Grid is the dominant element. The compact-grid animation lands.
- Fixes: ship. Minor: "Progressive disclosure beats dumping a manual into the body." is a nice line but slightly out of place on a compaction slide; consider moving to the skills section.

---

**Slide 29 — Opus 4.7 tokenizer (05-context-hygiene.html)**
- Grade: F
- What's on it: "Opus 4.7 tokenizer" kicker, h2 "Same text. Up to **35%** more tokens.", left-column stats (Opus 4.6 / 100 chars / 100 tok / baseline / Opus 4.7 / same 100 chars / 135 tok / +35%), italic explanation to the right, vast empty bottom half.
- Issues:
  - The left-column stats render as run-on lines: "Opus 4.6100 chars of prose" / "100 tokbaseline" / "Opus 4.7same 100 chars" / "135 tok+35%". Spaces missing between label and value.
  - NO bar-comparison visual (the section brief called for "two horizontal bars showing the 35% difference"). The whole point of this slide is a visual comparison and the visual is missing.
  - Empty bottom 60% of the slide.
- Fixes:
  - `slides/sections/05-context-hygiene.html` — the stats are stacked as sibling spans without separators. Wrap each pair in `<div>` with `display: flex; gap: var(--space-2)` so "Opus 4.6" / "100 chars of prose" / "100 tok" / "baseline" each get their own cell.
  - Add the comparison bars: two horizontal bar-charts side-by-side (Opus 4.6 = 100 cells, Opus 4.7 = 135 cells filled with yellow/amber at the tail to visualize the 35% growth). Use the same cell size as the context grid for visual consistency.
  - Pull content up so it starts at ~15% from top, not ~50%.

---

**Slide 30 — Responsible use divider (07-responsible-use.html)**
- Grade: C
- What's on it: "22:30 — 25:00" yellow timecode kicker, white h1 "Responsible use.", grey sub-line "Three rules. One habit. Start tonight."
- Issues:
  - The divider is supposed to carry a "redacted-cell grid" (diagonal-hatched blocks to convey safety/boundaries) per the Phase 2 brief. Whatever was coded did not render — the slide shows only text.
  - Too much empty space on the right half.
  - h1 "Responsible use." reads smaller than other section h1s (compare to slide 3 and 13 which use `.display-xxl`).
- Fixes:
  - `slides/sections/07-responsible-use.html` — check if the redacted-grid markup is present but invisible (broken CSS selector or missing stylesheet). If present, fix. If not, add: an 8-column × 4-row grid of small squares, most transparent-outlined, a scattered few with diagonal `linear-gradient(45deg, ...)` hatching in `--dark-blue`, plus ONE cell highlighted `--yellow` as the accent.
  - Bump h1 to `.display-xxl` treatment to match the other section-hero dividers.

---

**Slide 31 — Data policy (07-responsible-use.html)**
- Grade: F
- What's on it: A MASSIVE lock icon (SVG, probably 900×900+) taking 95% of the slide. No text visible. Bottom-left kicker "22:45 — DATA POLICY". Page counter "31 / 35". That's it.
- Issues:
  - **The slide is broken.** The Phase 2 agent said it built a two-column layout with pull-quote + lock icon side by side. What rendered is ONLY the lock, full-bleed, with all the content (Anthropic quote, rulebox action item) either missing or hidden behind/below the icon.
  - Report flagged this as Y-overflow; confirmed — the content is spilling below the viewport because the lock SVG is taking all available space.
- Fixes:
  - `slides/sections/07-responsible-use.html` — the SVG needs a max-width constraint. Probably the current CSS has `width: 100%` without `max-width`. Add `max-width: 320px; height: auto;` to the lock SVG inline or via class.
  - Restore the two-column grid: `grid-template-columns: 2fr 1fr` with the pull-quote on the LEFT and the lock icon at ~240-320px on the right.
  - Ensure the `.display-quote-lg` Anthropic quote ("By default, we will not use your inputs or outputs...") is visible and dominant.
  - Keep the rulebox-warn action item below the quote, left column.

---

**Slide 32 — Cite the line (07-responsible-use.html)**
- Grade: A-
- What's on it: "the single highest-ROI habit" grey kicker, big cyan h2 quote `"Cite the file and line."`, two-line lede, `.term-session` terminal showing a real citation (path:line, function name, verified check), footnote.
- Issues:
  - Composition works well. The terminal with actual output is a strong visual.
  - Top ~30% empty — could pull content up.
- Fixes:
  - `slides/sections/07-responsible-use.html` — pull headline block up by ~100px.
  - Otherwise ship.

---

**Slide 33 — Five things tonight (07-responsible-use.html)**
- Grade: B
- What's on it: "your Monday-morning starter kit" kicker, h2 "Five things to install tonight.", FIVE stacked full-width terminal bars (install / bootstrap / memory / permissions / habit), each with a `claude` pill + step number + one-line instruction. Footnote at bottom.
- Issues:
  - The five terminal bars stack vertically and span full width (~1650px) but each is only two lines tall — feels like a spreadsheet, not a starter kit.
  - Each terminal has a "claude" pill + "01/02/03/04/05" label at the RIGHT — the pill crowds the right side.
  - Terminal windows are visually identical except for their step text — no color variation or icon to differentiate.
- Fixes:
  - `slides/sections/07-responsible-use.html` — either compress to 2×3 grid (two columns, three rows, fifth spanning bottom) or keep 5×1 but NARROW each terminal to ~960px so they don't stretch full width.
  - Move the step number from right of the pill to a prominent left position (big "01" eyebrow inside each terminal's body text).
  - Add distinct color accents per step: step 1 = blue, 2 = sky, 3 = amber, 4 = teal, 5 = yellow. Uses the brand palette + gives the grid visual rhythm.

---

**Slide 34 — Three levers final callback (10-wrap.html)**
- Grade: C
- What's on it: "three levers · final callback" kicker, cyan h2 "The whole talk on one slide.", then a vertical left-aligned stack: `01 / Context / What you put in front of it. / CLAUDE.md. Auto memory. Skills. /clear and /compact. / 02 / Capability / What you let it do. / Plan Mode. /permissions. Tool allowlists. Per-client approval. / 03 / Verification / ...`
- Issues:
  - **SAME BUG AS SLIDE 6.** The three-levers grid collapsed to a vertical list. No three-column layout, no color accents, no dominant lever names.
  - The fix for slide 6 will likely fix this too — same components, same CSS.
- Fixes:
  - `slides/sections/10-wrap.html` — inspect why `.levers-hero .lever-row` (or whatever wrapper) isn't rendering as a three-column grid. Probably the wrapper class isn't on the markup, or CSS is conflicting with `.three-levers` from components.css.
  - Confirm markup wraps items in `.lever-row > .lever-item.context/.capability/.verification`.
  - After fix: lever names at 2.75rem display, each in a distinct brand color (`--captech-blue`, `--sky-blue`, `--light-teal`), short description below each in muted grey.

---

**Slide 35 — Q&A closing (10-wrap.html)**
- Grade: B
- What's on it: "THE REFERENCE INDEX" yellow kicker, white h1 "Questions?", lede about slides/notes/research in GitHub org, metadata line with talk title + date.
- Issues:
  - Clean composition overall.
  - No visual accent — a closing slide could use a little personality (a Q char in sky-blue, a mic icon, something warm since this is a farewell talk).
- Fixes:
  - `slides/sections/10-wrap.html` — consider making the `?` in "Questions?" the sky-blue accent (single character color swap).
  - Optional: add a subtle QR code linking to the repo in the bottom-right corner, small (~120px).
  - Otherwise ship.
