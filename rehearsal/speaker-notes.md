# Speaker Notes — Claude Code Team Primer (30-minute cut)

Cues, not a script. Read once the day before; skim the opening and exit lines the hour of.

The throughline is three levers: context, capability, verification. Say the phrase at minute ~4, minute ~22, and minute ~25. Do not skip any of them.

---

## Section 00 | 0:00–1:30 | Cold open

**Key points**
- Opening line: "You have all used Copilot. This is not Copilot."
- Second beat: "In the next 30 minutes I'll show you what Claude Code is, the commands worth learning today, and how to write your own skills."
- Let the terminal animation type itself once before you speak. Silence is the reframe.
- Thesis slide lands second: agent, not autocomplete. Three levers decide helps-or-hurts. Name the phrase but not the individual levers yet.

**Walk-away**
One mental model swap: completion → agent. One promise: three things coming in 30 minutes.

**Q&A fallback**
"How is this different from Cursor?" — Cursor is an IDE with inline completion and chat. Claude Code is an agent that lives outside the IDE and runs across surfaces. Different opinionation on review and verification.

---

## Section 01 | 1:30–4:30 | What Claude Code is

**Key points**
- Divider lands the section title; do not linger.
- Comparison slide: Copilot writes the next line; Claude Code writes the next pull request. Read the right-column bullets out loud slowly.
- Agentic-loop animation: let it pulse. Silence is fine. Say one sentence after a full cycle: "Plan, act, observe — and the handles on this loop are three levers."
- Three-levers slide: name each lever explicitly. Context = what you put in front of it. Capability = what you let it do. Verification = how you check its work.

**Walk-away**
Claude Code runs a loop, not a completion. Three levers shape the loop.

**Q&A fallback**
"Does it work offline / in a restricted network?" — terminal agent needs API reachability; plan for a proxy or claude.ai/code web if the client locks down egress.

---

## Section 02 | 4:30–10:00 | Commands worth learning today

**Key points**
- Five commands, ~60 seconds each on average. Each slide has a CSS animation; let it run a cycle before narrating.
- **Plan Mode (Shift+Tab)**: Anthropic's recommended default. Read-only first, execute second. Skip for one-line changes.
- **`/clear`**: "Use frequently between tasks to reset the context window entirely." After two failed corrections, `/clear` and rewrite the prompt.
- **`/compact [instructions]`**: preserves a decision-level summary. Optional instructions bias it (e.g. `/compact Focus on the API changes`).
- **`/rewind` (Esc Esc)**: every action is a checkpoint. Enables risky experimentation — if it fails, rewind. Not a git replacement.
- **`/memory`**: view and edit CLAUDE.md + the auto-memory Claude writes itself. Auto-memory is the newer half.

**Walk-away**
Five habits to install Monday morning. Clear frequently, plan before executing, rewind fearlessly.

**Q&A fallback**
"When do I use `/clear` vs `/compact`?" — `/clear` when the next task is unrelated. `/compact` when you need continuity but want to drop turn-by-turn noise. `/context` first if unsure.

---

## Section 03 | 10:00–16:30 | Skills — structure and writing your own

**Key points**
- Anatomy: SKILL.md plus optional reference/examples/scripts, living in `~/.claude/skills/<name>/` or `.claude/skills/<name>/`. Directory name becomes the slash-command.
- Progressive disclosure: name always in context, description in context, body only when invoked, supporting files only when the body tells Claude to read them. This is how skills scale without bloating the window.
- Frontmatter card: `description` (what + when; first 1,536 chars are what Claude sees in the index), `disable-model-invocation`, `allowed-tools`, `context: fork`, `paths`.
- The counterintuitive rule: descriptions describe *when* to use, not *what* the skill does. Superpowers proved this empirically.
- Write-your-own walkthrough: minimal SKILL.md on screen, point at each field, say what goes where. Scaffold is in `skills-lab/01-minimal/`.
- Subagents + hooks 60-second aside: skills can fork to subagents (`context: fork`); hooks are mechanical enforcement of CLAUDE.md rules. Culture in CLAUDE.md, enforcement in hooks.

**Walk-away**
Skills are markdown. You can write one by Wednesday. Descriptions are behavior, not metadata.

**Q&A fallback**
"Do skills work on Bedrock?" — yes, skills are client-side. They ship with your Claude Code install, not the model.

---

## Section 04 | 16:30–19:00 | CLAUDE.md + auto memory

**Key points**
- Reframe: CLAUDE.md is a behavior contract, not a readme. Forbidden phrases, precedence rules, escalation triggers.
- Five lines, read aloud from the slide, slowly:
  1. "Before writing code, state the plan."
  2. "Never run `git push --force` without explicit confirmation."
  3. "If a test was passing and now fails, stop and ask before modifying the test."
  4. "When unsure, ask one question rather than guessing."
  5. "Do not add dependencies without asking."
- Auto memory is new and worth naming: Claude saves learnings across sessions to `~/.claude/projects/<project>/memory/`. Open `/memory` to audit or edit. Plain markdown.
- gqlgen line (say twice, slowly): "Regenerate code: `go run github.com/99designs/gqlgen generate`. Never edit generated files by hand." Prevents the single most common catastrophic mistake.

**Walk-away**
CLAUDE.md is a contract you version. Auto-memory is Claude's side of the conversation, editable anytime.

**Q&A fallback**
"Do we gitignore CLAUDE.md on client repos?" — version it. Non-sensitive. Review like any other file.

---

## Section 05 | 19:00–22:30 | Context hygiene

**Key points**
- Opening line: "A 900k-token request costs the same per token as a 9k-token request. It does not perform the same. Anthropic calls the drop context rot."
- Verbatim Anthropic quote on screen: "as token count grows, accuracy and recall degrade." Let it sit.
- Numbers: Sonnet 4.5 scored 77.2% on SWE-bench Verified at 200K, 78.2% at 1M. Essentially flat — you pay for a million tokens and get usable performance on a much smaller slice.
- Decision rule, read aloud (do not paraphrase):
  - Unrelated next task → `/clear`.
  - Related, need continuity → `/compact`.
  - Not sure → `/context` first, then decide.
  - Bad-assumption smell → quit and relaunch, do not `/compact`.
- Survives-compaction: skills + memory re-attach. Each skill capped at first 5K tokens inside a 25K total budget. Keep skills short.
- Tokenizer gotcha: Opus 4.7 uses up to 35% more tokens for the same text. Budget for it.

**Walk-away**
Context is a first-class resource. `/clear` is free. `/compact` is a scalpel. Big context windows do not mean big usable context.

**Q&A fallback**
"What's the right `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE`?" — 80 for long-running work. Do not extemporize.

---

## Section 07 | 22:30–25:00 | Responsible use + start today

**Key points**
- "One slide of policy. If you leave with one artifact, this is it."
- Anthropic data policy, verbatim: "By default, we will not use your inputs or outputs from our commercial products to train our models." Exception: thumbs feedback. Admins disable org-wide before touching client data.
- Hygiene checklist (summarize, do not recite): placeholders for secrets, never `git add -A`, scrub logs, scope bash, exports are deliverables, `/security-review` on auth/data PRs.
- Cite-the-line: when Claude references a function or field, require path + line. If it cannot cite, it is guessing. This is verification — the third lever. Second instance of the three-levers callback lands here.
- Five things to install tonight:
  1. Claude Code (if missing).
  2. A starter CLAUDE.md — `/init`, then edit.
  3. Three Superpowers skills: `test-driven-development`, `systematic-debugging`, `verification-before-completion`.
  4. The org feedback-disable setting (admins only).
  5. A habit: run `/context` at the start of anything you are about to do for real.

**Walk-away**
Sandbox vs client-ready is a stance, not a feature. Cite the line. Install three skills tonight.

**Q&A fallback**
"Can we use `/ultrareview` on the client?" — not on Bedrock. CapTech sandbox only today. Negotiate claude.ai auth separately if the client wants it.

---

## Section 10 | 25:00–26:00 | Wrap

**Key points**
- Third and final three-levers callback. Point at the slide. Say the words: context, capability, verification.
- One-sentence close: "Everything you saw today was one of those three. Go install three skills tonight."
- Do not end with "any questions?" with rising intonation. Say "Questions." Stop talking. Moderator takes over.

**Walk-away**
Three levers. Three skills. One habit (`/context` first).

**Q&A fallback**
Rehearsed seeds live in `rehearsal/qa-seeds.md`. If the room goes quiet, read the first seed as if you were asked it: "One question we get a lot is…"

---

## Global landmines

- Do not oversell. Claude Code does not replace anyone.
- Do not claim Claude Code is better than Copilot. Claim it is different.
- Do not speculate on unreleased features. "I do not know, and I do not want to guess on the record."
- Do not read bullets off slides. Narrate around them.
- If a demo or animation breaks, do not apologize twice. Say what broke, pivot, move on.
