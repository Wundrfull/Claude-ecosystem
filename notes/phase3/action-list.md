# Phase 3 — Prioritized action list

Consolidated from reviews 01-09, 10-18, 19-27, 28-35.

## Grade distribution
- **A (ship)**: 1, 2, 3, 13, 16, 24, 25, 26, 28, 32 — 10 slides
- **B (tweak)**: 7, 9, 10, 12, 15, 18, 20, 33, 35 — 9 slides
- **C (rework)**: 4, 5, 8, 11, 14, 19, 21, 22, 23, 27, 30, 34 — 12 slides
- **F (rebuild)**: 6, 17, 29, 31 — 4 slides

## Top 10 fixes, in order

1. **SLIDE 6 + 34 — Three-levers grid collapsed to a list.** Root cause: `.levers-hero .lever-row` CSS not applying, likely specificity fight with `.three-levers` in components.css or missing wrapper. Fix both slides with one diagnosis. Restore grid with lever names at 2.75rem as the dominant element, colors applied.

2. **SLIDE 31 — Data policy is a giant lock icon with no content.** SVG has no `max-width`, filling the viewport. Constrain to ~320px, restore the two-column pull-quote + icon layout, make the Anthropic quote dominant.

3. **SLIDE 29 — Tokenizer stats run together ("Opus 4.6100 chars of prose").** Missing spans/flex separators between label and value. Add the comparison bars — two horizontal bars of cells visualizing the 35% difference.

4. **SLIDE 17 — Run-on caption "1mkdir 2write…".** Numbered steps lost their separators. Replace the inline caption with `<ol class="steps-inline">` + `.step-num` spans with proper spacing.

5. **SLIDE 30 — Responsible use divider is missing its redacted-cell grid.** Either broken markup or missing CSS. Add an 8×4 grid with diagonal-hatched cells + one yellow accent, bump h1 to `.display-xxl` to match other section heroes.

6. **SLIDE 11 — /rewind is 70% empty with an orphan chip.** Promised checkpoint timeline is missing. Add a row of 4-5 `.tag-pill` checkpoints above the terminal, highlight the active one in amber. Pull headline up.

7. **SLIDE 8 — Plan Mode terminals are empty.** Both terminal panes have chrome only, no content. Add actual commands + output to both. Consider side-by-side instead of stacked. Fix the mashed-together "planread-only" title.

8. **SLIDE 12 — Labels run into filenames ("CLAUDE.mdyou wrote it").** Missing space between spans. Wrap filename + label in separate spans with `margin-right: var(--space-1)`.

9. **SLIDE 21 — "01State the plan" — numbered rules have no gap.** Add `padding-right: 0.6em` to `.rule-num` so the number + rule read as distinct units.

10. **SLIDE 27 — Decision rule slide is pure prose, no visual.** Brief called for three mini context-grid panels (one showing /clear, /compact, /context post-state). Build the 3-card grid so the decision rule reads visually.

## Second-tier fixes (after top 10)

- **Slides 19, 20, 21, 22** — persistent top-half voids on the CLAUDE.md cluster. Pull content up to start at ~15-20% from top instead of centered.
- **Slide 4** — terminals centered while labels left-aligned; add label+terminal grid.
- **Slide 5** — rebuild the agentic-loop SVG or replace with linear 3-step diagram.
- **Slide 23** — terminal shows `go run github.com...` cut off; fix the rendering and make it feel intentional (dark bg may be accidental).
- **Slide 14** — headline too wide (~1700px); split into two lines, shrink inline mono.
- **Slide 15 + 17** — label-in-gutter + centered content breaks axes; apply `180px 1fr` grid.
- **Slide 18** — subagent vs hook terminals look identical; differentiate with amber tint on hook chrome.
- **Slide 33** — 5 full-width terminals feel like a spreadsheet; narrow each or shift to 2x3 grid, add per-step color accents.

## Third-tier (nice-to-have)

- Eyebrow/caption/inline-mono styles drift across the deck. Collapse into shared utilities: `.eyebrow`, `.footnote`, `.mono-inline`.
- Slide 35 — add sky-blue accent to the `?` char for personality.
- Slide 26 — missing ACCURACY axis label that slide 25 has (inconsistency between neighboring graph slides).
- Slide 27 — olive shaded region should be `--yellow` to read as "danger zone."

## Cross-cutting CSS work

Before applying fixes, confirm:
- `.levers-hero` markup + CSS is loaded consistently across slides 6 and 34 (same bug, same fix).
- `.stamp`, `.tag-pill`, `.eyebrow`, `.caption` are the canonical utilities.
- No file has local inline `<style>` that shadows kit.css / sections.css.

## Cross-section requests

- **Slide 13 — add `/grug` terminal gag.** Author the skills agent's new slide 13 to include a small `.term-sm term-session` typing `/grug explain promises` with output like: `matched: grug` / `reading SKILL.md...` / `✓ Promise is rock you get later. Rock maybe good, maybe bad. You wait. You no block fire.` / caption: "From The Grug Brained Developer. Skills can be serious. They can also be for the bit."
