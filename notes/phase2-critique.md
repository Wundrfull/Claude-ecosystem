# Phase 2 critique — per-slide fixes

User feedback on every slide. Agents apply the kit (`slides/kit.html`, `slides/css/kit.css`) across these.

Global goals:
- More visuals, more fun. This is a farewell talk. Enjoyable > polished.
- Stronger typography hierarchy. Titles should not overwhelm support copy.
- Avoid AI-writing tells. Run the `humanizer` skill on copy.
- Reuse terminal + context grid everywhere it fits.

## Slide map (1-34)

| # | File | data-section | Critique + fix |
|--:|------|---|---|
| 1 | 00-cold-open | 0:00 Cold open | Already approved. No change. |
| 2 | 00-cold-open | 1:00 The thesis | Already approved. No change. |
| 3 | 01-what-is | 1:30 What Claude Code is | **Beef up.** Typography too big, no impact. Use `.display-xxl` for title or split into smaller sized elements with hierarchy. Add a visual. |
| 4 | 01-what-is | 1:45 Copilot vs Claude Code | **Dull.** Needs a visual. Consider side-by-side terminal comparison: left = Copilot-style autocomplete snippet, right = `.term-session` with agent loop. |
| 5 | 01-what-is | 2:45 Agentic loop | **SVG is broken.** Lines not aligned. Fix with Playwright iteration in Phase 3. For now, consider simpler diagram or CSS-based loop animation. |
| 6 | 01-what-is | 3:30 Three levers | **Hierarchy wrong.** "Three levers" title reads first, then the subtext appears BEFORE the lever names. Fix: the three lever names should read as the dominant text after the title. Also yellow is hard to see — swap yellow accent for a darker/higher-contrast color. |
| 7 | 02-commands | 4:30 Commands divider | **Grey and dull.** Add something interesting. Fun visual. |
| 8 | 02-commands | 4:30 Plan Mode | **Too dense.** Use `.term-session` terminal. Simpler "plan mode" visual — maybe two terminals side by side showing Plan Mode (read-only) → Normal Mode (executing), or a badge/toggle. |
| 9 | 02-commands | 5:30 /clear | Apply `.ctx-real.ctx-clear` grid + `.term-session` showing `/clear` typed with benefit pills. |
| 10 | 02-commands | 6:30 /compact | Apply `.ctx-real.ctx-compact-real` grid + `.term-session` typing `/compact Focus on the API changes`. |
| 11 | 02-commands | 7:30 /rewind | Apply `.term-session` with `/rewind`. Visual of a checkpoint timeline. |
| 12 | 02-commands | 8:30 /memory | Apply `.term-session`. Show the two-file dance: CLAUDE.md ↔ MEMORY.md. Can use `.tree` to show the memory dir. |
| 13 | 03-skills | 10:00 Skills divider | Fine. Check rhythm with other dividers. |
| 14 | 03-skills | 10:00 What a skill is | Skill body + description is fine. |
| 15 | 03-skills | 11:00 Progressive disclosure | **Use terminal.** The current three-column layer diagram is OK but a terminal-driven demonstration would be more engaging. Show `/skill-name` typing, then the skill body appearing in a second pane. |
| 16 | 03-skills | 12:00 Frontmatter reference | **Big title weird.** "Only `description` is recommended. The rest tune behavior." reads oddly. Use `.display-quote-lg` or compress the title. |
| 17 | 03-skills | 13:30 Writing your first skill | **Needs animation/interesting visuals.** Use `.tree.tree-grow` for the skill folder structure appearing + `.term-session` for the create-and-invoke flow. |
| 18 | 03-skills | 15:00 Subagents and hooks | **Not fun.** Structure is okay but dull. Add visual: split into two columns each with a mini-terminal + icon/badge. Show a hook firing as animated. |
| 19 | 03-skills | 16:00 The description rule | OK. |
| 20 | 04-claude-md | 16:30 CLAUDE.md + memory divider | **Make it more fun!** Maybe a visual of the tree structure with CLAUDE.md highlighted, or context grid showing where it loads. |
| 21 | 04-claude-md | 16:45 Five-line CLAUDE.md | **Needs hierarchy + fun.** Long-form list. Add visual: mini-terminal showing each rule "enforced" live, or use `.tree` to show where CLAUDE.md lives. |
| 22 | 04-claude-md | 17:30 Auto memory | **Reading-friendly, not presenting-friendly.** Too text-heavy. Break into visual: `.tree` showing the memory dir structure + `.term-session` showing "remember that..." flow. |
| 23 | 04-claude-md | 18:15 gqlgen one-liner | **Hard to read.** Font/colors/spacing issue on the dark background. Fix contrast. Consider using `.term-session` to frame the line as a literal terminal quote. |
| 24 | 05-context-hygiene | 19:00 Context hygiene divider | OK. |
| 25 | 05-context-hygiene | 19:15 The numbers (77.2 / 78.2) | **Need a graph.** Use `.graph` + `.stat-duo` combined. Stats are the numbers, graph is the shape. Pair them. |
| 26 | 05-context-hygiene | 20:00 Context rot verbatim | **Need visual.** Add `.graph` beside the quote, or use it as a backdrop. |
| 27 | 05-context-hygiene | 20:45 Decision rule | **Better organization.** /clear vs /compact vs /context — use three mini-panels, each with a tiny `.ctx-real` in the relevant mode. Visual shortcut for the decision rule. |
| 28 | 05-context-hygiene | 21:45 Survives + tokenizer | **Split.** Two topics on one slide. Give each its own slide. Survives-compact slide: `.term-session` typing `/compact` + `.ctx-real.ctx-compact-real` grid. Tokenizer slide: visual showing 100 chars → 100 tokens (Opus 4.6) vs 135 tokens (Opus 4.7), like a bar/token-count comparison. |
| 29 | 07-responsible-use | 22:30 Responsible use divider | **Needs fun thoughtful visual.** Shield icon, or a grid with some cells highlighted as "redacted" to convey safety. |
| 30 | 07-responsible-use | 22:45 Data policy | **Hierarchy.** Visual callout for the quote. Maybe a lock icon or big pull-quote treatment. |
| 31 | 07-responsible-use | 23:45 Cite the line | **Font too big overwhelms.** Use `.display-quote-lg` instead of the current oversized h2. Add visual: `.term-session` showing a citation being rendered. |
| 32 | 07-responsible-use | 24:30 Five things tonight | **Visual.** Use a terminal for each step, or a checklist that animates in. |
| 33 | 10-wrap | 25:00 Three levers final | **Same issue as slide 6.** Fix hierarchy. |
| 34 | 10-wrap | 25:45 Q&A | OK. |

## Constraints for every agent

- Apply `humanizer` skill to slide copy. Keep it punchy; strip AI tells.
- No emojis. Typographic marks (✓ → ↑) OK.
- Every slide fits 100vh with `padding: 6vh 8vw`. No scroll.
- `<aside class="notes">` on every non-divider slide, 30-90s speaker cues.
- Reuse components from `kit.css`. Do not duplicate CSS that already exists there.
- Honor `prefers-reduced-motion: reduce` on any new CSS you write.
- Link `kit.css` in `slides/index.html` if not already linked.

## Agent carve

- Agent A: slides 3-6 (01-what-is)
- Agent B: slides 7-12 (02-commands)
- Agent C: slides 13-19 (03-skills)
- Agent D: slides 20-28 (04-claude-md, 05-context-hygiene) — densest, may need split
- Agent E: slides 29-34 (07-responsible-use, 10-wrap)
