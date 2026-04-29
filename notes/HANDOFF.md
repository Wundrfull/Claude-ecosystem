# Handoff — Claude Code Team Primer deck

**Project**: 30-min Claude Code presentation for a 6-person CapTech consulting team.
**Delivery**: April 29-30 2026 (this week).
**Repo**: `/Users/npeloquin/Documents/AI/Claude-ecosystem` · `git@github.com:Wundrfull/Claude-ecosystem.git`
**State**: Deck is functional and ~70% A-grade. Ready to rehearse, minor polish remains.

## Read these first

1. `CLAUDE.md` — project rules (no emojis, no fabricated commands, audience framing).
2. `notes/outline-30min.md` — final 35-slide outline and timing.
3. `notes/phase3/action-list.md` — prioritized fix list (most top-10 done; second/third-tier remain).
4. `notes/phase3/review-*.md` — per-slide grades from the Phase 3 visual review.

## Layout

```
slides/
├── index.html                         # deck root, links all CSS + deck.js
├── kit.html                           # standalone component-kit preview page
├── rundeck                            # bash launcher (no-cache server + Chrome)
├── shoot.js                           # Playwright screenshot harness → screenshots/
├── js/deck.js                         # loader, navigation, populates context grids
├── css/
│   ├── brand.css                      # CapTech tokens + Gibson font
│   ├── deck.css                       # type scale + slide layout
│   ├── components.css                 # legacy components (stamps, rulebox)
│   ├── sections.css                   # utility-class consolidation
│   ├── kit.css                        # ★ main component kit (terminal, ctx grid, tree, graph, stat-duo, typography)
│   ├── animations.css / animations-loop.css  # scoped animations
│   └── chrome.css                     # footer, overview grid, notes panel
├── sections/                          # 8 active section files, 35 slides total
│   ├── 00-cold-open.html              # 2 slides: hero + thesis
│   ├── 01-what-is-claude-code.html    # 4 slides: hero, Copilot vs Claude, agent loop, 3 levers
│   ├── 02-commands.html               # 6 slides: divider + 5 commands (Plan Mode, /clear, /compact, /rewind, /memory)
│   ├── 03-skills.html                 # 7 slides: anatomy, progressive disclosure, frontmatter, etc.
│   ├── 04-claude-md.html              # 4 slides: divider + 3 (5-line rules, auto-memory, gqlgen line)
│   ├── 05-context-hygiene.html        # 6 slides: numbers, context-rot, decision rule, survives, tokenizer
│   ├── 07-responsible-use.html        # 4 slides: divider + data policy + cite-the-line + 5 things tonight
│   └── 10-wrap.html                   # 2 slides: 3-levers recap + Q&A
└── sections/ (DEAD)                   # 06-subagents-hooks, 08-scenario-b, 09-scenario-d — on disk but NOT in deck.js
```

## Git state

Recent commits (all pushed to `origin/main`):
- `99d5808` Polish pass (skills 14-18, decision zone color, 5-things accents, Q&A)
- `9870925` Second-tier layout fixes (slides 4, 5, 8, 11, 19-22, 27)
- `81489d4` **Critical fix** — deck.js style-loader bug; phase 2 kit applied + reviews
- `7cdd688` Reusable visual kit (kit.html + kit.css)
- `09c9db7` Trim to 30-min version (from original 60-min)

## What each phase did

| Phase | What | Commit |
|---|---|---|
| 1 (trim) | Cut scenarios B/D, rebuilt commands around Anthropic's docs, added auto-memory slide | `09c9db7` |
| 2 (kit) | Built kit.html + kit.css with 6 reusable components | `7cdd688` |
| 3a (apply) | Applied kit across ~20 slides | part of `81489d4` |
| 3b (bug fix) | Fixed deck.js to lift `<style>` tags into `<head>` — this was the biggest unlock | `81489d4` |
| 3c (review) | Playwright screenshots, 4 review docs, action list | part of `81489d4` |
| 3d (iterate) | 2 rounds of agent-driven fixes | `9870925` + `99d5808` |

## Active components (in kit.css)

- **`.term-*`** — terminal window. Variants: `.term-sm/md/lg`, `.term-session` (in-Claude-session header with "claude" pill and `>` prompt), `.term-typing` (command types itself), `.term-output-lines` (output fades in), `.term-benefits` (pills below). Use `data-text` on `.term-typed` + CSS vars `--term-typed-steps` + `--term-typed-width` to size typing animation.
- **`.ctx-real`** — faithful /context mock. 20×10 grid, info panel to the right. Modes: `.ctx-real-animate`, `.ctx-clear` (morph to empty), `.ctx-compact-real` (messages → summary). Populated automatically by `populateCtxGrids()` in `deck.js` from `data-fill="category:count,..."`.
- **`.tree`** — folder tree. Variants: `.tree-grow` (animated reveal), `.tree-dark`, `.tree-highlight` (pulse one line).
- **`.graph`** — hand-authored SVG line chart for context rot curve. Variants: `.graph-dark`, `.graph-animate`.
- **`.stat-duo`** — two-number typography treatment with delta.
- **Typography**: `.display-xxl`, `.display-quote-lg`, `.eyebrow`, `.tag-pill` (+ variants).

## Local dev workflow

```bash
# Launch the deck in Chrome with cache-busting
./slides/rundeck

# Screenshot every slide at 1920×1080
cd slides && node shoot.js
# Outputs: slides/screenshots/slide-NN.png + report.md + report.json
# (gitignored)

# View the component kit
# After rundeck: http://localhost:PORT/kit.html
```

Screenshots and `node_modules/` are gitignored.

## Known quirks

1. **4096 output-token cap** on this project (set in `~/.claude/settings.json`). Sub-agents hit it often when writing long files or reports. Strategy: scope work tightly per agent (1 file, narrow change set), or use chunked Write + Edit append pattern.
2. **Image-cache quirk** — re-reading the same screenshot path can return stale content. Workaround: `cp /path/to/slide.png /tmp/fresh_name.png` then Read from /tmp.
3. **`<style>` tag lifting** in `deck.js:28-35` is load-bearing. Don't revert — any scoped CSS in section files depends on it.
4. **Context grids populate from `data-fill`** in `deck.js:populateCtxGrids()`. Markup example: `<div class="ctx-real__grid" data-cells="200" data-fill="messages:54,free:140,autocompact:3">`. Helper skips grids that already have children so kit.html's inline-populated examples don't double-fill.
5. **Cache-busting** — `rundeck` sets no-cache headers + timestamp query param. If the browser seems to show stale content, **Cmd+Shift+R**.

## Installed skills worth knowing about

- **`humanizer`** at `~/.claude/skills/humanizer/` — strips AI-writing tells. Apply to any copy changes.
- **`impeccable`** at `~/.claude/skills/impeccable/` — frontend design review/polish.
- **`update-config`** — modifies settings.json / permissions.

## What's done vs. what remains

**Done:**
- All 35 slides render cleanly (no overflow)
- All F-grade slides fixed (the `<style>`-lift unlocked most of them)
- Top-10 action-list items resolved
- Second-tier fixes (4, 5, 8, 11, 19-22, 27) done
- Polish pass on skills + wrap slides

**Remaining (nice-to-have, third-tier):**
- Consolidate drifting `.eyebrow` / `.caption` / `.mono-inline` styles into shared utilities
- Optional: pull SWE-bench graph data from an official source if you want real curves instead of illustrative ones
- Optional: QR code on slide 35 linking to the repo
- Any specific issues you notice during rehearsal

## How to rehearse

1. `./slides/rundeck` — deck opens in Chrome.
2. Arrow keys to navigate. `S` to toggle speaker notes. `Esc` for overview grid. `F` for fullscreen.
3. Rehearsal docs at `rehearsal/timing-cues.md` + `rehearsal/speaker-notes.md`.
4. Target: ~20 min content + 10 min Q&A.

## Audience context (from memory)

- 6 CapTech consultants. Copilot-experienced, CLI-comfortable, new to Claude Code.
- Onboarding to a **GraphQL-heavy client project** (gqlgen-wrapped subgraphs).
- Client runs Claude Code on AWS Bedrock via ailab profile — commands gated to claude.ai auth won't work for them. Avoid fabricating commands that aren't in Anthropic's docs.
- Two-environment workflow: experiment on CapTech side, carry only validated assets to client side.
- Agent teams preferred: Opus 4.7 1M lead, Sonnet 4.6 / Opus 4.6 teammates, never Haiku.
- This is a **farewell talk** — the presenter is leaving after this. Prioritize fun/enjoyable over corporate polish.

## Resume after `/clear`

> "Read `notes/HANDOFF.md` to get up to speed on the Claude Code presentation deck. I want to [rehearse / polish slide N / do a final review / ship it]."
