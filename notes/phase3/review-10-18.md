# Phase 3 Visual Review — Slides 10–18

**Summary.** Commands run (10–12) is solid but uneven: slide 10 is dense/bottom-heavy while 11 reads empty. Skills run (13–18) has the deck's best divider but loses hierarchy on 14 (headline too wide) and 17 (micro-caption typography broken). Eyebrow and caption styles drift — consolidate into shared utilities.

---

**Slide 10 — /compact [instructions]**
- Grade: B
- What's on it: eyebrow, /compact headline, lede, context-grid card, terminal, bottom caption.
- Issues:
  - Five focal elements — one too many.
  - Grid card + terminal are centered while headline column is left-aligned, leaving the headline feeling abandoned.
  - Bottom italic `/clear wipes…` caption competes with the lede.
- Fixes:
  - `slides/sections/02-commands.html` — wrap ctx grid + terminal in one `.stack` with `gap: var(--space-3)`.
  - Move `/clear wipes…` under the lede as a `.footnote`; drop from bottom.
  - Narrow terminal to ~640 px (`.term-session--sm`) so it does not outweigh the grid.

**Slide 11 — /rewind**
- Grade: C
- What's on it: eyebrow, `/rewind` headline, lede, one orphaned `restore to: edit` chip, terminal, caption.
- Issues:
  - Large empty band across the top half.
  - The chip is floating with no timeline — the advertised "checkpoint timeline" is missing.
  - Terminal anchored lower-right, disconnected from everything.
- Fixes:
  - `slides/sections/02-commands.html` — add a horizontal row of 4–5 `.tag-pill` checkpoints above the terminal; highlight active in `--amber`.
  - Center the terminal; place timeline directly above it.
  - Raise headline/lede from ~30 % down to ~18 %.
  - Switch caption from italic to `.footnote` to match slide 10.

**Slide 12 — /memory**
- Grade: B+
- What's on it: eyebrow, `/memory` headline, lede, folder tree card, terminal, CLAUDE.md ↔ MEMORY.md flow, caption.
- Issues:
  - The bottom-left flow renders as "CLAUDE.mdyou wrote it" / "MEMORY.mdClaude wrote it" — no space between filename and label.
  - Arrow sits alone on its own line; three-line flow looks accidental.
- Fixes:
  - `slides/sections/02-commands.html` — split filename and label into spans with `margin-right: var(--space-1)`; filename gets `.mono`, label gets `.meta`.
  - Collapse the flow into one row: `display: flex; gap: var(--space-2); align-items: baseline`.
  - Move the flow next to the tree card as a sibling caption, not a floating footer element.

**Slide 13 — Skills divider**
- Grade: A
- What's on it: amber timestamp `10:00 — 16:30`, `Skills` wordmark, subhead `Write one tonight. Ship it Monday.`
- Issues: none. Strong hierarchy, good breathing room.
- Fixes: none — use this as the template for future dividers.

**Slide 14 — A skill is a folder with SKILL.md**
- Grade: B−
- What's on it: eyebrow, long sans+mono headline, two stacked code cards (tree + frontmatter), caption.
- Issues:
  - Headline runs ~1700 px wide — reads like a paragraph.
  - Mono `SKILL.md` in the headline is visually heavier than surrounding sans; baselines off.
  - Two code cards stacked identically — no hierarchy between "structure" vs "contents."
- Fixes:
  - `slides/sections/03-skills.html` — split headline into two lines, second line carries the mono; `max-width: 22ch`.
  - Shrink inline mono in headline to `0.85em` to match x-height.
  - Add eyebrows to each card: "STRUCTURE" on the tree, "CONTENTS" on the SKILL.md card.
  - Convert caption to `.footnote`, drop italic.

**Slide 15 — Progressive disclosure**
- Grade: B
- What's on it: eyebrow, headline, "Trigger" label + terminal, "Body loads on invoke" label + SKILL.md excerpt, centered caption.
- Issues:
  - Labels sit in the left gutter while paired visuals are centered — axes do not align.
  - SKILL.md excerpt is plain text with no card — looks like stray prose next to the styled terminal.
  - Gap between the two blocks is larger than the section gap, so they read as unrelated.
- Fixes:
  - `slides/sections/03-skills.html` — two-column grid `grid-template-columns: 180px 1fr; align-items: start` so labels and content share a baseline.
  - Wrap the excerpt in `.code-card`; apply `.dim` to the `# … 130 more lines …` line.
  - Tighten vertical gap between trigger and body blocks to `var(--space-4)`.

**Slide 16 — Frontmatter reference**
- Grade: A−
- What's on it: dashed eyebrow, two-line display headline, six-row table.
- Issues:
  - Eyebrow is ~40 % smaller than eyebrows on slides 10/11 — inconsistent scale.
  - Table is flat; six rows could scan better with light zebra striping.
  - Key-column widths drift; colons misalign between `allowed-tools` and `disable-model-invocation: true`.
- Fixes:
  - `slides/sections/03-skills.html` — apply shared `.eyebrow` class.
  - `tbody tr:nth-child(even) { background: var(--paper-2); }` on the reference table.
  - Fix key column to `font-family: var(--mono)` with `min-width: 22ch` so colons align.

**Slide 17 — Ship your first skill tonight**
- Grade: C
- What's on it: eyebrow, headline `Five steps. Ten minutes.`, "The folder" / "The run" labels, tree card, terminal, a micro caption with five numbered steps.
- Issues:
  - The numbered caption renders as one run-on line: "1mkdir the folder 2write SKILL.md 3description…" — digits glued to words. Worst typography on the deck.
  - Cards are centered; section labels are left-aligned — axis break (same as slide 15).
  - "that is it" annotation next to `SKILL.md` is unstyled — looks like a typo.
- Fixes:
  - `slides/sections/03-skills.html` — replace run-on caption with `<ol class="steps-inline">`, `display: flex; gap: var(--space-3)`; wrap numerals in `.step-num` spans tinted `--amber`.
  - Apply the slide-15 grid fix: 180 px label gutter aligned with cards.
  - Style "that is it" with `.callout` (muted italic, `--ink-3`).

**Slide 18 — Subagents and hooks**
- Grade: B
- What's on it: eyebrow with middle dot, headline, two stacked sections (Subagents, Hooks), each with prose + a small terminal.
- Issues:
  - Both terminals are identical size and centered — no visual distinction between the `claude` main-session and the `PostToolUse hook`.
  - Inline mono (`context: fork`, `agent: Explore`, `.claude/settings.json`) is inconsistent weight.
  - H2s "Subagents" and "Hooks" are same size/color — the slide reads as two half-slides with no connective tissue.
- Fixes:
  - `slides/sections/03-skills.html` — tint the hook terminal chrome with `--amber` (border-left or title-bar dot) to separate it from the `claude` terminal.
  - Add `.mono-inline { font-size: 0.92em; background: var(--paper-2); padding: 0 4px; border-radius: 3px; }` and apply everywhere.
  - Lock H2 colors: Subagents `--captech-blue`, Hooks `--sky-blue`.
  - Consider a two-column layout (subagent left, hook right) to use the empty right half.

---

**Cross-cutting**
- Eyebrow sizes drift on 14 and 16 — lock all to `.eyebrow`.
- Captions alternate italic / roman / mono — lock all to `.footnote`.
- Inline mono needs a shared `.mono-inline` utility; each slide styles ad hoc.
- The label-in-gutter pattern (15, 17) needs actual grid alignment to work.
