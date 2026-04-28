# Claude Ecosystem Presentation Repo

Repo for a 1-hour Claude Code intro talk for a 6-person CapTech team onboarding to a GraphQL-heavy client project. Delivered April 29-30 2026; published publicly afterward as a reference.

## Layout

- `slides/` — browser-based deck
- `motion/` — Remotion compositions (3 x ~20s clips + README intro)
- `demos/` — GraphQL scenario walkthroughs (B: consumer field add, D: CI/PR triage)
- `notes/` — research synthesis, outline, speaker notes
- `skills-lab/` — example custom skills for the "writing skills" segment
- `rehearsal/` — timing cues, Q&A seeds
- `vendor/` — reference clones (gitignored): superpowers, impeccable, huashu-design, remotion

## Working with this repo

- **Audience framing**: Copilot users, new to Claude Code. Use Copilot analogies, not "what is AI."
- **Depth**: "aware it exists" for most topics. Deeper on skills-writing, memory, context hygiene, responsible use.
- **Two-environment motif**: every tool/skill/command should carry a "CapTech sandbox vs. client-ready" label.
- **No emojis** unless explicitly requested.
- **Agent team use**: lead is Opus 4.7 (1M); teammates are Sonnet 4.6 or Opus 4.6. Never Haiku.

## GraphQL scenario scope

Demo scenarios chosen: **B** (consumer-driven field addition on a gqlgen-wrapped subgraph) and **D** (CI/PR triage on a codegen-drift failure, showcasing `/pr-fix` / `/ultra-review` style commands). A and C (resolver scaffolding, mapping automation) are mentioned as callbacks only.

## Output format cap

`CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` — for long documents, use chunked Write + Edit appends (see `~/.claude/skills/graphqlstagereport.md` for the pattern).
