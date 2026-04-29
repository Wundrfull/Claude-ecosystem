# Claude Code Team Primer — 30-minute revision

~20 min content + ~10 min Q&A. Delivered April 29-30 2026.

## What changed vs. 60-min version

- **Cut**: Scenario B live demo, Scenario D screencast, `/ultraplan`, `/autofix-pr`, `/branch`, `/effort xhigh`, `/rewind` framing, separate subagents+hooks section, ZDR caveat slide, CapTech-stamp legend as its own slide.
- **Replaced**: The entire "April 2026 command tour" (which relied on commands not documented by Anthropic) with "Top commands Anthropic actually recommends" — sourced from docs.
- **Expanded**: Skills section — structure, progressive disclosure, write-your-own walkthrough, today-start examples.
- **Folded in**: Subagents + hooks become a 60s aside inside the skills section (skills can fork to subagents; hooks are the "mechanical enforcement" lever).
- **Motif**: "Sandbox vs client-ready" stamp remains, but introduced implicitly via the stamp component, not as a dedicated legend slide.

## Verified commands (Anthropic docs, April 2026)

Daily drivers from code.claude.com/docs/en/best-practices and /slash-commands:

1. `/init` — generate starter CLAUDE.md from repo. First step on any project.
2. `/clear` — reset context between unrelated tasks. The single most-recommended habit.
3. `/compact [instructions]` — summarize to free context while preserving decisions. Optional instructions bias the summary.
4. `/rewind` (or Esc+Esc) — checkpoint revert. Every action creates a checkpoint.
5. Plan Mode (Shift+Tab) — read-only exploration, then plan, then execute. Anthropic's recommended workflow.
6. `/memory` — view and edit CLAUDE.md and auto-memory files.
7. `/permissions` — allowlist specific tools to reduce approval prompts.
8. `/review` and `/security-review` — bundled skills; run before PRs touching auth/data.
9. `/btw` — side question that does not enter conversation history. Context-safe curiosity.
10. `claude --continue` / `--resume` — pick up past sessions. Treat sessions like branches.

Direct Anthropic quote to anchor the section:
> "Give Claude a way to verify its work... This is the single highest-leverage thing you can do."

## Skills structure (Anthropic docs, April 2026)

- Skill = directory with `SKILL.md` entrypoint. Directory name becomes the `/slash-command`.
- Locations: `~/.claude/skills/<name>/` (personal), `.claude/skills/<name>/` (project).
- Required: `SKILL.md`. Optional: `reference.md`, `examples.md`, `scripts/*`, any supporting files.
- Frontmatter — only `description` is truly recommended. Key fields:
  - `description` — what it does AND when to use it. First 1,536 chars are what Claude sees in the index.
  - `disable-model-invocation: true` — manual invocation only (use for side-effect workflows like deploy/commit).
  - `allowed-tools` — pre-approve tools while skill is active.
  - `context: fork` + `agent: Explore|Plan|general-purpose` — run the skill in an isolated subagent.
  - `paths` — glob patterns; skill only loads automatically when working with matching files.
- Progressive disclosure:
  - Skill names always in context.
  - Description loaded in context.
  - Full body only loads when invoked.
  - Supporting files only load when the body tells Claude to read them.
- Size guidance: keep `SKILL.md` under 500 lines. Keep description front-loaded.
- Shell injection: `` !`command` `` lines execute BEFORE Claude sees the skill; the output replaces the placeholder. This is how live context gets into skills.

## Slide-by-slide plan (~20 min)

| # | Section | Min | Slides | Note |
|--:|---------|----:|--------|------|
| 00 | Cold open | 0:00-1:30 | 2 | Keep the typing terminal animation. Drop the stamp-legend slide. |
| 01 | What Claude Code is | 1:30-4:30 | 3 | Copilot vs agentic loop; surfaces; three levers. |
| 02 | Commands worth learning today | 4:30-10:00 | 5 | Plan Mode + `/clear` + `/compact` + `/memory` + `/rewind`. Each slide: what it does (top), CSS-animated "here's what happens" (bottom). |
| 03 | Skills — structure and writing your own | 10:00-16:30 | 6 | Anatomy, progressive disclosure diagram, frontmatter reference card, write-your-own walkthrough, where subagents + hooks fit. |
| 04 | CLAUDE.md + auto memory | 16:30-19:00 | 3 | Behavior contract framing; five lines; auto-memory is new and worth naming. |
| 05 | Context hygiene | 19:00-22:30 | 4 | Verbatim Anthropic quote, decision rule, 5K/25K survives-compaction, tokenizer gotcha. |
| 06 | Responsible use + start today | 22:30-25:00 | 3 | Data policy, cite-the-line, five things to install tonight. |
| 07 | Wrap | 25:00-26:00 | 1 | Three levers final callback → Q&A. |

## Design principles (for impeccable agents)

- Consistent type: h1 5rem, h2 3.25rem, body 1.5rem — already in `deck.css`, enforce across slides.
- Every slide has: label (top-left kicker), h1/h2 (single dominant element), 1-3 supporting elements max. No walls of text.
- Command slides use the pattern user asked for: headline (what it does) → visual/CSS animation (what it looks like in practice) → one-line takeaway.
- Animations: subtle, looping, never blink-fast. Use `prefers-reduced-motion: reduce` to disable for accessibility.
- CSS animations illustrate: typing, context filling up, plan-mode dual-pane, skill progressive disclosure, compaction before/after, rewind checkpoint revert.
- Stamp component stays but is used sparingly — not every slide needs one.
- First-slide critique: the terminal animation feels off against the type above it. Fix: center-align the terminal to the main column, set a consistent max-width that matches the h1 block, and reduce vertical gap between heading and animation.

## Agent assignments

- `content-lead` (Opus 4.7): rewrite `rehearsal/timing-cues.md` and `rehearsal/speaker-notes.md` for the 30-min shape; produce `00-cold-open.html` + `01-what-is-claude-code.html` polished.
- `commands-author` (Opus 4.7): rewrite `02-commands.html` as the new 5-slide commands section with CSS-animated demos per command.
- `skills-author` (Opus 4.7): rewrite `03-skills.html` as the expanded skills section (structure, progressive disclosure, write-your-own).
- `hygiene-author` (Opus 4.7): rewrite `04-claude-md.html` + `05-context-hygiene.html` + `06-subagents-hooks.html` → new `06-responsible-use.html` compressed, and update `10-wrap.html`. Delete `08-scenario-b.html` and `09-scenario-d.html` from the loader.
- `impeccable-polish` (Opus 4.7 1M, final): whole-deck consistency pass — type scale, spacing, alignment, animation timing, cross-slide rhythm. Runs last.

Each agent reads this doc + its target files only. No cross-spawning.
