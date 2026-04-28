# Claude Code Team Primer — 60-Minute Outline

Delivered April 29-30 2026. Audience: 6-person CapTech consulting team, Copilot-experienced, CLI-comfortable, onboarding to a gqlgen-wrapped GraphQL client engagement. Live + recorded.

**Throughline**: CapTech sandbox → client-ready. Every tool/skill/command carries a stamp.

**Core thesis in one sentence**: Claude Code is not autocomplete; it is an autonomous coding agent, and the three levers that decide whether it helps or hurts are **what you put in context, what you let it do, and how you verify its work**.

---

## Section timings (60 min + 15 min Q&A)

| Min | Section | Depth | Motion |
|----:|---------|-------|--------|
| 0:00–3:00 | Cold open + the one-sentence thesis | — | Intro clip (60-90s) |
| 3:00–9:00 | What Claude Code is (vs. Copilot) | Aware | 20s "agentic loop" clip |
| 9:00–14:00 | Command tour: the headline April 2026 additions | Aware + micro-demo | — |
| 14:00–22:00 | Skills — writing and evaluating them | Deeper | — |
| 22:00–28:00 | CLAUDE.md and memory as behavior contracts | Deeper | — |
| 28:00–35:00 | Context hygiene + the load-bearing numbers | Deeper | 20s degradation clip |
| 35:00–40:00 | Subagents + hooks | Aware | — |
| 40:00–45:00 | Responsible use + CapTech→client stamp | Deeper | 20s motif clip |
| 45:00–52:00 | GraphQL scenario B (live demo) | Demo | — |
| 52:00–55:00 | GraphQL scenario D (screencast) | Demo | Pre-recorded |
| 55:00–60:00 | Agent teams + MCP (aware-only) + wrap | Aware | — |
| 60:00–75:00 | Q&A | — | — |

---

## Minute-by-minute

### 0:00–3:00 — Cold open

**On screen**: Remotion intro clip (60–90s). Terminal prompt types itself, Claude Code spawns, agent loop visualizes, fades to title.

**What you say (3 beats)**:
1. "You've all used Copilot. This is not Copilot."
2. "In the next hour I'll show you what it *is*, what's genuinely new in April 2026, and what we should actually use on the client side."
3. "One throughline: everything we look at carries a sandbox vs. client-ready stamp. I want you leaving with a clear mental model of what travels and what doesn't."

**Slide**: title slide with the CapTech→client stamp legend in the corner. The stamp will appear next to every major tool/skill/command introduced.

### 3:00–9:00 — What Claude Code is (vs. Copilot)

**Goal**: reset the mental model from "inline completion" to "agentic loop." This is the single most important concept shift for this audience.

**Slide 1 — The Copilot model** (30s): engineer types, ghost text appears, accept or reject, single file, no state beyond a few lines.

**Slide 2 — The Claude Code model** (90s): engineer delegates a task; Claude plans, reads files, edits files, runs commands, reflects, iterates. Operates across the codebase, not in one file. Lives across sessions via CLAUDE.md and memory.

**Motion clip** (20s): animated agent loop — Plan → Tool Use (Read / Edit / Bash) → Observe → Plan again → Done. Overlays the Copilot "accept or reject" model beside it for contrast.

**Surface tour** (60s): Terminal is primary, but Claude Code is everywhere — VS Code extension, JetBrains, Desktop, claude.ai/code, iOS. `claude --teleport` pulls a web session into the terminal. One session, many surfaces.

**The three levers** (90s): this is the slide the whole talk hangs on.
- **Context**: what you put in front of it (files, CLAUDE.md, memory, skills)
- **Capability**: what you let it do (permissions, hooks, tools)
- **Verification**: how you check its work (tests, review, `/security-review`, cite-the-line)

Everything else in the talk is a variation on these three. Say that explicitly.

**Sources**: R1 (mental model), R3 (community framing).

### 9:00–14:00 — Command tour: April 2026 additions

**Goal**: get them current as of today. These are commands the Claude Code team shipped in the last 90 days, post-everyone's-January-knowledge-cutoff.

**Headline four** (75s each):

1. **`/ultrareview`** — multi-agent cloud review with independent verification. Runs 5–10 min in a cloud sandbox. Cite the pricing ($5–$20 after 3 free, expires May 5). **Client-ready stamp: NO** — requires claude.ai auth, not available on Bedrock/Vertex/Foundry. Use on CapTech side only for now.

2. **`/ultraplan`** — draft a plan in the cloud, review in a browser with inline comments. Choose whether to execute in cloud (opens a PR) or teleport back to the terminal.

3. **`/autofix-pr`** (the "pr-fix" you heard about) — spawn a cloud session that watches a PR, auto-fixes CI failures and review comments, replies on your behalf. **Warning**: can trigger Atlantis / Terraform Cloud comment-based automation. Client-ready stamp: with explicit approval only.

4. **`/context`** — visualizes context usage as a colored grid. No-op read; safe to run anytime. Sets up the context-hygiene section 20 min later.

**Also worth a sentence each**: `/effort` with the new `xhigh` default (breaking change as of April 2026 — everyone is burning more tokens per turn than they did in March); `/rewind` (checkpoint revert); `/branch` (fork the conversation); `/init` (generate a starter CLAUDE.md).

**Source**: R2. This section has the most "new to everyone" content — slow down here.

### 14:00–22:00 — Skills: writing and evaluating them

**Goal**: this is one of the deeper sections because the user called it out specifically. Two halves: how to write one, how to know it works.

**Part A — What a skill is** (90s):
- Frontmatter + markdown body in `~/.claude/skills/<name>.md` or `.claude/skills/` per project
- Invoked by slash command (explicit) or matched by description (implicit)
- Show the minimal anatomy on one slide using `skills-lab/01-minimal/SKILL.md`

**Part B — The counterintuitive rule about descriptions** (90s — this is the *surprising* bit that gets people talking):
- The `description` frontmatter field is a **behavior lever, not metadata**
- If the description summarizes the *workflow*, Claude follows the description and skips the skill body entirely
- Superpowers proved this empirically: description reading "code review between tasks" caused Claude to do one review despite the body mandating two
- Rule: descriptions describe **when to use** (third-person triggers and symptoms), never **what the skill does**

**Part C — How to know a skill works** (3 min):
The community does not have a formal evaluation framework. promptfoo is adjacent, not native — it can run a skill body concatenated with a query as a regression harness but cannot test whether Claude will *choose* to load the skill. So we propose a minimal methodology:

1. **Write three golden tasks with plain-English expected-behavior bullets before writing the skill.**
2. **Run them without the skill** in a fresh Claude Code session — capture the transcript as RED baseline.
3. **Write the skill to target the baseline failures.**
4. **Re-run the golden tasks.** Require GREEN on previously-failing bullets.
5. **Pressure test**: run each golden task 3x to check for nondeterminism.

Show `skills-lab/03-eval-harness/` with the golden tasks and a `test-prompts.json` modeled on `huashu-design/test-prompts.json` (four fields: id, prompt, expected, tests).

**Part D — A real skill we already use** (60s):
Show `~/.claude/skills/graphqlstagereport.md` — a working chunked-write skill from this user's own projects. Explain the chunked-write pattern (it dodges the 4096 output token cap we hit on this deck's research; community-evolved, not in Anthropic's docs).

**Sandbox vs. client stamp**: skill writing happens CapTech-side. Only validated skills travel.

**Source**: R4, plus R3's superpowers `writing-skills` findings.

### 22:00–28:00 — CLAUDE.md and memory as behavior contracts

**Goal**: reframe CLAUDE.md from "readme" to "constitution."

**Main point** (90s): top public CLAUDE.md files (anthropics/claude-code, cloudflare/agents, humanlayer, obra/superpowers, langchain-ai/langchain) are **behavior contracts**, not documentation: forbidden phrases, precedence rules, escalation triggers, tone rules.

**Five lines that appear in most of them** (put on slide, read aloud):
- "Before writing code, state the plan."
- "Never run git push --force without explicit confirmation."
- "If a test was passing and now fails, stop and ask before modifying the test."
- "When unsure, ask one question rather than guessing."
- "Do not add dependencies without asking."

**Memory iteration pattern** (90s): CLAUDE.md is a living document. End-of-session habit: ask Claude to propose CLAUDE.md edits based on mistakes from this session. Version CLAUDE.md in the repo. Every edit goes through code review like any other code.

**Per-subdirectory CLAUDE.md** (60s): Anthropic documents this; community underuses it. On a gqlgen subgraph with multiple domains, a `graph/CLAUDE.md` with resolver conventions, an `loader/CLAUDE.md` with dataloader patterns, scales better than one monolith.

**The single most important CLAUDE.md line for a gqlgen subgraph** (30s — say it twice): `"Regenerate code: go run github.com/99designs/gqlgen generate. Never edit generated files by hand."` One line that prevents the most common catastrophic mistake.

**CapTech→client**: draft a CapTech-standard CLAUDE.md template. Engineers customize per engagement. The template itself is client-ready (non-sensitive); the customizations are per-engagement.

**Source**: R3 (community CLAUDE.md patterns), R5 (gqlgen specifics).

### 28:00–35:00 — Context hygiene + the load-bearing numbers

**Goal**: the segment the user flagged as load-bearing. Give the team concrete numbers and one decision rule they can apply Monday morning.

**The number to say aloud** (30s): "Sonnet 4.5 scored 77.2% on SWE-bench Verified at 200K context and 78.2% at 1M context. Essentially flat. Anthropic itself documents the effect as **context rot** and says, verbatim: *'as token count grows, accuracy and recall degrade.'* You are paying for 1M tokens and cashing in usable performance on a much smaller slice."

**Slide**: the context-awareness snippet Claude sees internally:
```
<budget:token_budget>1000000</budget:token_budget>
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

**Motion clip** (20s): animated "performance gradient" — accuracy stays flat for a long stretch, then begins to erode as context fills. Not a cliff, a slope.

**The decision rule** (90s — put on a slide, read it):
> If the next thing you are going to do is **unrelated** to what you just did → `/clear`.  
> If it is **related** and you need continuity → `/compact`.  
> If you are **not sure** → `/context` first, then decide.  
> **Quit and re-launch** only when you suspect the session picked up a bad assumption. `/compact` will summarize that bad assumption into the summary and it persists.

**What survives compaction** (30s): skills and memory re-attach, but each skill is capped at the first 5K tokens post-compaction, inside a 25K total budget. Huge skill files lose their tails after a compact. Keep skills short.

**The auto-compaction trigger** (30s): ~95% of context. Override via `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE` to trigger earlier. 80 is a sensible value for long-running work.

**Opus 4.7 tokenizer gotcha** (30s): new tokenizer uses up to **35% more tokens** for the same text vs older models. If you migrated from Opus 4.6, your daily spend went up by default. Budget for it.

**CapTech→client stamp** on the whole segment: this matters more on the client side because tokens are budgeted there.

**Source**: R6.

### 35:00–40:00 — Subagents + hooks (aware-only)

**Subagents** (2.5 min): a focused helper agent you spawn mid-session. Own context window. Reports back to you. Anthropic frames as parallelism; the community has shown subagents are also a **quality gate** — a fresh subagent per task with a spec-compliance reviewer and a code-quality reviewer. Token-expensive; only worth it for larger tasks.

**Show one example on screen**: "Spawn a code reviewer subagent on these 3 files." Result comes back summarized. Don't trust the summary — inspect the diff.

**Hooks** (2.5 min): shell commands that run in response to tool-call events. `PreToolUse`, `PostToolUse`, `TeammateIdle`, `TaskCompleted`. Exit code 2 sends feedback to Claude and keeps it working.

**One concrete example on screen**: a `PreToolUse` hook that blocks `git push --force` without an explicit flag. Enforces the CLAUDE.md rule mechanically.

**CapTech→client stamp**: subagents are generally client-ready (inherits your permissions). Hooks are client-ready, but the commands they run need audit.

**Source**: R1 (subagents), R3 (subagents-as-quality-gate framing).

### 40:00–45:00 — Responsible use + the CapTech→client stamp

**Goal**: the one-slide policy the team takes with them.

**Anthropic's data policy** (60s, quoted): *"By default, we will not use your inputs or outputs from our commercial products to train our models."* The exception: thumbs-up / thumbs-down feedback buttons. **Action**: Team/Enterprise admins should disable feedback submission via *Organization settings → Data and Privacy → "Rate chats."* Do this once, org-wide, before touching client data.

**API-key and secret hygiene** (90s, checklist slide):
1. Never paste real API keys, OAuth secrets, or bearer tokens into prompts. Use placeholders.
2. Never commit `.env`, `credentials.json`, anything under `~/.aws/`. Explicit filenames only, never `git add -A`.
3. Scrub logs before pasting. Error traces leak hostnames, IPs, session IDs.
4. Scope the bash allowlist so Claude cannot curl internal endpoints.
5. Treat `/export` transcripts as client deliverables.
6. Run `/security-review` before every PR that touches auth or data flow.

**Motion clip** (20s): the CapTech→client stamp in motion — sandbox side has loose limits, client side has the stricter policy. *"The stricter policy applies on the client-billed side, always."*

**The single highest-ROI habit** (60s — this lands): **"Cite the file and line."** Whenever Claude references a function, type, or GraphQL field, require a path and line number. If it cannot cite, it is guessing. Put it in CLAUDE.md. Cheapest insurance against shipping a hallucinated Apollo hook or phantom schema field.

**ZDR note** (30s): Zero Data Retention is available as a separate arrangement; negotiate it before code if the client requires it. Caveat: ZDR disables `/ultrareview` and `/ultraplan`.

**Source**: R6.

### 45:00–52:00 — Scenario B: live demo (consumer field addition)

**Goal**: show Claude Code doing the exact work the team will do on the client.

**Setup** (30s): "We've got a synthetic gqlgen subgraph at `demos/synthetic-subgraph/`. It mirrors the real client's structure. Consumer team just requested two new fields on the `Product` type."

**The demo** (5 min, live):
1. Open Claude Code in the demo repo. Show `/context` — mostly empty.
2. Type the prompt (from `DEMO-SCRIPT-B.md`): *"A consumer team needs two new fields on the Product type: `skuCode: String!` and `inventoryCount: Int!`. Read the CLAUDE.md and schema, then propose a plan before making any changes."*
3. Claude reads CLAUDE.md, reads schema, proposes a plan (schema edit → regen → resolver update → test).
4. Approve the plan. Claude edits the schema, runs gqlgen, updates the resolver, writes a test.
5. Run the test. Show it passing.
6. Show the diff. Point out: Claude respected the *"never edit generated files"* CLAUDE.md line. It only touched handwritten files.

**Narration during the demo**:
- "Watch how it reads the CLAUDE.md first — that's the three levers in action."
- "Notice it's citing file paths when it describes the plan — that's the cite-the-line rule we talked about."
- "If it tried to edit generated.go, CLAUDE.md would have caught it."

**Fallback plan** (if anything breaks): pre-captured screenshots in `demos/synthetic-subgraph/fallback/`. If Claude misses the dataloader pattern live, say *"It missed the dataloader pattern — here's where we'd catch it in `/ultrareview`"* and show the screenshot.

**Source**: R5, plus the scaffolded repo at `demos/synthetic-subgraph/`.

### 52:00–55:00 — Scenario D: pre-recorded screencast (CI/PR triage)

**Goal**: demonstrate `/autofix-pr` and `/ultrareview` without risking live failures (research-preview commands, claude.ai auth, cloud timing).

**Setup** (20s): "Same subgraph. A PR was opened; CI is failing with a codegen-drift error. Watch Claude take it from red to green without us in the loop."

**The screencast** (2 min, pre-recorded from `demos/synthetic-subgraph/DEMO-SCRIPT-D.md`):
1. CI log on screen: the drift error.
2. `/autofix-pr` — Claude detects the PR from the current branch, investigates.
3. Claude posts a comment, pushes the regen, CI goes green.
4. Then `/ultrareview` on the cleaned PR — multi-agent review, findings with cited file+line references.
5. End on the finding with a cited line. Tie back: "This is cite-the-line, automated."

**The caveats slide** (30s):
- `/autofix-pr` is a research preview — behavior will change.
- `/ultrareview` requires claude.ai auth — **does not work on Bedrock**. CapTech-sandbox-only today.
- Both commands can trigger comment-based automation (Atlantis, Terraform Cloud). Approve per-client before using.

**Source**: R2 + R5.

### 55:00–60:00 — Agent teams + MCP (aware-only) + wrap

**Agent teams** (90s — aware): like subagents but teammates can message each other directly and share a task list. This presentation was built using one — six Sonnet 4.6 researchers, Opus 4.7 lead. Show a one-line `TeamCreate` example and the architecture diagram. **Stamp: experimental, token-heavy; not expected on-client any time soon.**

**MCP** (60s — aware, then move on): open standard for connecting AI to external data. Useful at CapTech; **client will not allow it**. Mention the name so they recognize it later; move on. The repo README has a link into Anthropic's MCP docs for anyone curious.

**The wrap** (2 min — back to the thesis):
- "Three levers: context, capability, verification."
- "Five things I want you to install on your machine tonight" (slide):
  1. Claude Code (if you don't have it)
  2. A CapTech-standard starter CLAUDE.md (link to this repo)
  3. Four superpowers skills: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `using-git-worktrees`
  4. The org feedback-disable setting if you're an admin
  5. A habit of running `/context` at the start of anything you're about to do for real
- "The repo at [github-link] is the reference index. It has everything from this talk plus the research that informed it. The motion clips you saw are in `motion/`. The scenario scripts are in `demos/`."
- "Questions?"

### 60:00–75:00 — Q&A

**Seeded questions** (in case Q&A dies — in `rehearsal/qa-seeds.md`):
1. "What do we do on the client side if they won't install Claude Code org-wide?"
2. "How is Claude Code different from Cursor?"
3. "Can we version the CLAUDE.md in the client's repo, or does it need to be gitignored?"
4. "Won't Claude just hallucinate the gqlgen config if we ask it to set one up?"
5. "What's the cheapest way to try `/ultrareview` given we're on Bedrock?"

---

## What each Remotion clip needs to do

| Clip | Duration | Where | What's on screen |
|------|---------:|-------|------------------|
| `intro` | 60–90s | 0:00 | Terminal types itself, Claude Code spawns, agent loop pulse, title |
| `agentic-loop` | 20s | 3:30 | Plan → Tool → Observe → Plan, Copilot model beside it for contrast |
| `context-rot` | 20s | 28:30 | Accuracy stays flat, then slopes down as token count grows |
| `captech-stamp` | 20s | 40:15 | The two-environment stamp animating in, sandbox-loose → client-strict |

All four built in Phase 3 from the Remotion starter.

---

## Notes for the slide deck

- Browser-based, served from `slides/`. One HTML per section to keep files small and editable.
- Reserve the right-hand corner for the CapTech→client stamp.
- No emojis anywhere.
- Code snippets use a monospace block with the file path at the top (e.g. `~/.claude/skills/graphqlstagereport.md`).
- The "three levers" (Context / Capability / Verification) appears three times: minute 7, minute 40, minute 59. Visual callback. Same icon each time.

## Open questions before Phase 3 production

1. Do we lock the title ("Claude Code Team Primer") or do you want a punchier one?
2. Should the CapTech-standard CLAUDE.md template be an artifact in this repo, or is it a Phase 4 follow-up? (If Phase 3, it becomes a concrete downloadable; if Phase 4, it's promised and shipped later.)
3. Is there a company brand color / font I should match in slides and Remotion clips?
4. Confirm OK to cite Anthropic pricing and SWE-bench numbers on stage — they're public but the talk is recorded.

