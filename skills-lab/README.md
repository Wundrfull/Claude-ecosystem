# skills-lab

Example custom skills used during the "writing and evaluating skills" segment of the talk. Each skill here exists for teaching, not production.

## Planned examples (filled in during Phase 3 production)

- `01-minimal/` — the smallest possible SKILL.md, used to show anatomy
- `02-chunked-write/` — a real-world pattern (cribbed from `~/.claude/skills/graphqlstagereport.md`) that works around the `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` cap
- `03-eval-harness/` — a tiny 3-prompt golden-task suite showing how to spot-check whether a skill works

Each folder will contain:
- `SKILL.md` — the skill itself
- `NOTES.md` — what it teaches, why it's shaped this way, what to say on stage
- `test-prompts.md` — input prompts you'd run to evaluate it
