# Phase 3 Review — Slides 1-9

**Summary.** Opening is strong: slides 1, 2, 3 land. Middle of the section (4, 5, 6) suffer from vast top-half voids and weak visual hierarchy. Slide 6 is the worst — a wall of numbered prose with zero visual layout; needs a rebuild to match the component-rich hero treatment on slide 3. Slide 7 divider is OK but the terminal-pill row is too small. Slides 8-9 have the right ingredients but poor composition (the Plan Mode slide is 70% dead space).

Grades: **A: 1, 2, 3** · **B: 7, 9** · **C: 4, 5, 8** · **F: 6**.

---

**Slide 1 — Cold open hero (00-cold-open.html)**
- Grade: A
- What's on it: Gibson "Claude Code / Team Primer" h1, terminal with partial-typed `claude "refactor the a...`, subline about 30 minutes.
- Issues:
  - Terminal still uses the `$ claude "..."` shell-launch pattern (correct for cold open), but the command is only partially typed when screenshot fires (~1.2s into 2.2s animation). Minor: screenshot timing artifact, not a real issue.
- Fixes: ship.

---

**Slide 2 — Thesis (00-cold-open.html)**
- Grade: A
- What's on it: "ONE SENTENCE" kicker + "Claude Code is not autocomplete. It is an autonomous coding agent, and **three levers** decide whether it helps or hurts."
- Issues: none. Clean, centered, tight.
- Fixes: ship.

---

**Slide 3 — What Claude Code is hero divider (01-what-is-claude-code.html)**
- Grade: A
- What's on it: "1:30 — 4:30 · SECTION TWO" eyebrow in yellow, `.display-xxl` "Not autocomplete. / **An agent.**", sub-line "Copilot writes the next line. Claude Code writes the next pull request."
- Issues: none. Best hero in the deck.
- Fixes: ship. Use as template for future section hero dividers.

---

**Slide 4 — Copilot vs Claude Code (01-what-is-claude-code.html)**
- Grade: C
- What's on it: "THE MENTAL-MODEL SHIFT" kicker, h2 "Copilot is not the model.", two terminals labeled Copilot / Claude Code, bottom caption "next line → next pull request".
- Issues:
  - Both terminals are centered on the page but the "Copilot" / "Claude Code" labels are left-aligned — creates a broken axis.
  - The "Copilot" column shows just a code snippet but NO benefit-pill row; the "Claude Code" column shows terminal chrome but the prompt area is empty (no actual content). Huge dead space in the Claude terminal.
  - "next line → next pull request" line sits alone at the bottom, unmoored.
- Fixes:
  - `slides/sections/01-what-is-claude-code.html` — wrap each label+terminal pair in a grid: `display: grid; grid-template-columns: 180px 1fr; gap: var(--space-3)` so label + terminal share an axis.
  - Add actual content to the Claude Code terminal: typed command `> refactor the auth flow` + 3 output lines + benefit pills (match the kit example).
  - Move "next line → next pull request" as a `.footnote` below the right column, not centered orphan.
  - Tighten vertical: headline block is near-top already but the terminals sit too low — pull them up by ~100px.

---

**Slide 5 — Agentic loop (01-what-is-claude-code.html)**
- Grade: C
- What's on it: "THE AGENT LOOP" yellow kicker, h2 "Plan → Tool use → Observe → done.", SVG agent loop (Plan blue, Observe + Tool use dark circles), caption below.
- Issues:
  - Entire top half is empty; content starts at ~25% of viewport, SVG floats in the middle without anchoring.
  - SVG arrows are drawn but one is invisible (partial render between Tool use → Observe), and the dashed arcs look unfinished/glitchy.
  - Node positions look slightly off-center relative to each other — Plan is high-left, Tool use is mid-right, Observe is lower-left.
  - h2 uses right-arrows `→` mixed with sans text — feels like code not headline.
- Fixes:
  - `slides/sections/01-what-is-claude-code.html` — pull SVG up by ~120px; give the slide a top-aligned layout rather than vertically-centered.
  - Rebuild the SVG: use three equidistant nodes on a proper circle with consistent arrow rendering. Consider replacing the SVG entirely with a simpler CSS-based loop (three colored pills arranged in a circle with CSS transform: rotate).
  - Or: swap the whole SVG for three horizontal steps (Plan → Tool use → Observe → Done) as a linear diagram with `.tag-pill` badges — simpler, fits the deck's vocabulary, no broken-SVG risk.

---

**Slide 6 — Three levers first appearance (01-what-is-claude-code.html)**
- Grade: F
- What's on it: "THE SLIDE THE WHOLE TALK HANGS ON" kicker, h2 "Three levers decide whether Claude helps or hurts.", then a vertical stack: `01 / Context / What you put in front of it. Files, CLAUDE.md, memory, skills. / 02 / Capability / What you let it do. ... / 03 / Verification / How you check its work. ...`, footnote.
- Issues:
  - **This is the worst slide in the deck.** The design I coded into HTML/CSS didn't survive — it's rendering as a single vertical left-aligned list of 9+ stacked text lines with NO three-column layout, NO lever cards, NO color accents.
  - The numbers "01", "02", "03" are tiny and grey, almost invisible.
  - "Context" / "Capability" / "Verification" render at normal weight, not as the dominant element.
  - Vast right 60% of slide is empty.
  - Top 30% of slide is empty.
  - No separators, no color, no hierarchy between lever names and their descriptions.
- Fixes:
  - `slides/sections/01-what-is-claude-code.html` — the `.levers-hero .lever-row` CSS defines `grid-template-columns: repeat(3, 1fr)` but the rendered output is clearly not applying it. Likely CSS specificity conflict with `.three-levers` in components.css, or the markup isn't using `.levers-hero` wrapper. Diagnose and fix.
  - Confirm the inline `<style>` block at top of file is correctly scoped and the markup wraps the three items in `.levers-hero > .lever-row > .lever-item.context/.capability/.verification`.
  - After fix: lever names at 2.75rem display weight in their respective brand colors; descriptions small (1.05rem) muted grey below.
  - Also add the footnote "Everything else in the next 25 minutes is a variation on these three." as a `.footnote` beneath the lever row, left-aligned with the row.

---

**Slide 7 — Commands section divider (02-commands.html)**
- Grade: B+
- What's on it: "4:30 — 10:00" amber timecode kicker, white display headline "Five commands. / Monday morning.", sub-line "Anthropic's short list. The ones you will reach for first.", row of 5 `.tag-pill`s: `Shift+Tab · Plan Mode`, `/clear`, `/compact`, `/rewind`, `/memory`.
- Issues:
  - The 5 pills are cluttered visually — `/rewind` has a yellow background that stands out inconsistently (highlights the "active" command but without context).
  - The pill row is quite small relative to the massive headline.
  - "Anthropic's short list" — typo: should be "Anthropic's" without apostrophe after s, or actually is correct. Fine.
- Fixes:
  - `slides/sections/02-commands.html` — normalize pill colors so one doesn't stand out arbitrarily; drop the yellow bg on `/rewind`.
  - Bump pills from `.tag-pill` (small) to a medium variant: increase font-size to 1.1rem and padding to 0.4em 0.9em so they read as prominent at ~200px width each.
  - Add a tiny separator char between pills ("·" or "/" mark) if they feel like a list, or put them on their own row with `gap: 1rem`.

---

**Slide 8 — Plan Mode (02-commands.html)**
- Grade: C
- What's on it: "01 OF 05 · SHIFT + TAB" amber kicker, h2 "Plan Mode", lede about toggling read-only → execute, two stacked terminal windows (plan read-only / execute writes allowed), a left-aligned orphan `→` arrow, footnote.
- Issues:
  - Top ~15% of slide is empty (content starts at the kicker).
  - The two terminal panes stack vertically but are both EMPTY inside (no content, just chrome). 60% of slide is black terminal with nothing in it.
  - The "→" arrow floats alone on the left gutter, not between the two terminals.
  - Terminal title bars show "plan read-only" and "execute writes allowed" as mashed text without spacing.
- Fixes:
  - `slides/sections/02-commands.html` — add content to both terminals. Plan mode: `> read src/auth/session.ts` + a few read lines. Execute mode: `> /plan approved` + edit lines + `✓ done`.
  - Move the `→` arrow into the GAP between the two terminals, centered horizontally.
  - Add a proper space between "plan" and "read-only" in the title bar: "Plan Mode · read-only" and "Execute · writes allowed".
  - Consider converting to SIDE-BY-SIDE terminals (two columns) rather than stacked — this slide has plenty of horizontal room and the vertical version wastes the bottom half.

---

**Slide 9 — /clear (02-commands.html)**
- Grade: B
- What's on it: "02 OF 05" amber kicker, cyan `/clear` headline, two-line lede, `.ctx-real.ctx-clear` grid card (287k → 17.1k tokens, showing cleared state), `.term-session` terminal typing `> /c...`, footnote Anthropic quote.
- Issues:
  - Composition is good overall — this slide works.
  - The terminal at bottom only shows `/c` (screenshot timing) which looks incomplete.
  - The grid card + terminal are stacked vertically which creates a very tall slide that JUST fits the viewport.
  - The "Anthropic: Use `/clear` frequently between tasks..." footnote at bottom-left is italic and a bit cramped against the terminal above.
- Fixes:
  - Screenshot timing is fine (terminal finishes typing at ~2.8s, screenshot hits at 1.2s). Real audience sees the full animation.
  - Consider SIDE-BY-SIDE layout: grid card on left, terminal on right. Frees up vertical space, lets the Anthropic footnote breathe.
  - Swap footnote to align left-justified with the grid/terminal block, not italic. Use `.footnote` utility if one exists.
