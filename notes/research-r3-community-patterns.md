# Research R3: Community Patterns for Claude Code

Audience: six CapTech consulting engineers, Copilot-experienced, onboarding to a GraphQL-heavy client engagement. Focus is on patterns that are NOT in Anthropic's official docs, and an opinionated read on what is hype versus substance.

Research date: 2026-04-28. Primary artifact surveyed: Jesse Vincent's "superpowers" plugin (vendored at `vendor/superpowers/`), plus secondary signal from Simon Willison's blog (simonwillison.net), public CLAUDE.md files on GitHub, Hacker News threads under "claude code", and recent posts from @bcherny and @swyx on X.

## TL;DR: Top five patterns worth deck time

1. Brainstorm-then-plan-then-execute as three distinct sessions with hard gates. Community consensus: the biggest lift from Claude Code is forcing a written spec and plan before any code. Sources: `vendor/superpowers/skills/brainstorming/SKILL.md`, `writing-plans/SKILL.md`, `executing-plans/SKILL.md`.
2. Subagent-driven development with a fresh subagent per task and two-stage review (spec then quality). Different from Anthropic's Task tool framing, which treats subagents as parallelism, not a quality gate. Source: `skills/subagent-driven-development/SKILL.md`.
3. Git worktrees as default isolation for any non-trivial session. Absent from Anthropic's quickstart. Sources: `skills/using-git-worktrees/SKILL.md`, Willison 2025-09 (simonwillison.net/2025/Sep/).
4. Verification-before-completion: force the agent to rerun the verification command in the current turn before claiming done. Source: `skills/verification-before-completion/SKILL.md`.
5. CLAUDE.md as a behavior-shaping contract, not a readme. Popular public files (Cloudflare Agents SDK, langchain, humanlayer, obra/superpowers) read like constitutions with forbidden phrases, precedence rules, escalation triggers. Source: github.com/search?q=filename%3ACLAUDE.md.

## Superpowers library: overview and honest assessment

Jesse Vincent (@obra on X and GitHub) maintains `superpowers`, a plugin/skills library for Claude Code that has become the de facto reference implementation for the "agentic discipline" school of prompt engineering. It ships 14 skills that together encode one opinionated workflow: brainstorm to spec, spec to plan, plan to worktree, worktree to subagent execution with reviews, then a finishing ceremony.

Assessment of the library as a whole: substance, with caveats. The design philosophy is sound and the skills are visibly tested (there is an explicit RED-GREEN-REFACTOR methodology for skills themselves in `writing-skills/SKILL.md`, and testing-with-subagents evidence in the repo). The library's contributor CLAUDE.md explicitly states a 94 percent PR rejection rate and warns off AI-generated slop PRs, which is a good signal that the maintainer cares about quality.

The caveats for a consulting context: (1) the skills are Jesse's workflow, not a universal workflow. They presuppose access to subagents, git worktrees, and the ability to spend tokens liberally on reviewer passes. (2) The tone is dogmatic in places ("Iron Law", "Violating the letter of the rules is violating the spirit of the rules"). This is deliberate behavior shaping, but it can feel cultish on first read. (3) Several skills overlap substantially and would confuse an engineer browsing the list for the first time. Install the three or four that matter, skip the rest until needed.

Net recommendation: install `test-driven-development`, `systematic-debugging`, `verification-before-completion`, and `using-git-worktrees`. Read but do not install `brainstorming` until the team has a stable client project where brainstorming gates make sense.

## Superpowers skill-by-skill verdicts

**brainstorming** (`skills/brainstorming/SKILL.md`). Forces a written design doc with explicit user approval before implementation. Verdict: worth knowing. Adopt on greenfield work, skip for bug fixes. Caveat: the "visual companion" opens a local browser. Do not enable on client-managed machines without infosec signoff.

**dispatching-parallel-agents** (`skills/dispatching-parallel-agents/SKILL.md`). When to fan out to multiple Task subagents: independent failure domains, no shared state, specific scope per agent. Verdict: worth knowing, do not install. Internalize once, apply without tooling.

**executing-plans** (`skills/executing-plans/SKILL.md`). Thin wrapper around "read plan, execute, stop on blockers." Verdict: skip. The skill itself recommends `subagent-driven-development` instead when subagents are available.

**finishing-a-development-branch** (`skills/finishing-a-development-branch/SKILL.md`). Presents a four-option menu at end of a feature branch: merge locally, push and PR, keep, or discard. Verdict: adopt. Stops the agent from unilaterally pushing. Consulting adaptation: drop option 1 if client enforces PR-only; drop option 4 if client requires audit trails.

**receiving-code-review** (`skills/receiving-code-review/SKILL.md`). Disciplines the agent against performative agreement ("You're absolutely right!" explicitly banned) and requires verifying reviewer claims against the codebase before implementing. Verdict: adopt. Highest-leverage skill for the consulting dynamic of external review.

**requesting-code-review** (`skills/requesting-code-review/SKILL.md`). Dispatches a reviewer subagent with curated context. Verdict: worth knowing. Teach the pattern, do not install the skill for day-to-day use.

**subagent-driven-development** (`skills/subagent-driven-development/SKILL.md`). The crown jewel. Per-task fresh subagent, spec-compliance reviewer, code-quality reviewer, re-review loops. Includes model-selection guidance (cheapest model per role). Verdict: adopt for larger tasks. Caveat: reviewer roundtrips 3x to 5x token spend. Get client alignment on billable work.

**systematic-debugging** (`skills/systematic-debugging/SKILL.md`). Four-phase protocol (root cause, pattern analysis, hypothesis, implementation) with an architectural-escape-hatch ("three fixes failed, question the architecture"). Verdict: adopt. Stops Claude thrashing on bugs. Directly addresses the Copilot-to-Claude failure mode: trying fix after fix without a hypothesis.

**test-driven-development** (`skills/test-driven-development/SKILL.md`). Red-green-refactor with an Iron Law ("no production code without a failing test first") plus a rationalization table. Verdict: adopt. Even without strict TDD practice, the skill gives the team a lever to invoke on demand. Caveat: on legacy client codebases with poor testability, use the skill's escape clause rather than fighting it.

**using-git-worktrees** (`skills/using-git-worktrees/SKILL.md`). Auto-detects worktree directory, verifies gitignore safety, runs setup, confirms clean baseline. Verdict: adopt. Caveat: some enterprise git hosts disable worktrees or have hooks that break on them. Verify with client first.

**using-superpowers** (`skills/using-superpowers/SKILL.md`). Meta-skill telling Claude to check for applicable skills before responding. Verdict: skip. But lift the instruction-priority ladder (user CLAUDE.md beats skills beats system prompt) into your own CLAUDE.md. It is not clearly stated in Anthropic's docs.

**verification-before-completion** (`skills/verification-before-completion/SKILL.md`). One rule: before claiming done, run the verification command in the current turn and quote output. Verdict: adopt. Highest-leverage skill in the library for consulting: directly addresses the reputation risk of Claude saying "tests pass" when they do not.

**writing-plans** (`skills/writing-plans/SKILL.md`). Checkbox-style implementation plan, exact file paths, exact commands, forbids placeholders. Verdict: adopt for multi-day features. Caveat: the default save path `docs/superpowers/plans/` will surprise clients. Override in project CLAUDE.md.

**writing-skills** (`skills/writing-skills/SKILL.md`). Meta-skill for authoring skills, framed as TDD-for-documentation. Verdict: skip for the team's first ninety days. Only relevant if CapTech decides to publish its own library.

## Broader community patterns worth knowing

**Plan-before-code as a hard gate.** Strongest community signal in the last ninety days: engineers who get reliable Claude Code output treat planning as non-skippable. Willison's posts on planning mode (simonwillison.net/2025/Aug/) and Cherny on X (@bcherny) converge: agent output quality is bounded by the written plan. Anthropic's docs acknowledge plan mode but do not lean on it. Adopt. On client work the plan doubles as a status artifact.

**TDD loops with agent-written tests.** HN threads and Willison's blog report that forcing Claude to write and run a failing test before implementation measurably reduces hallucinated APIs. Superpowers is the rigorous version; simpler: prompt "write the test, run it, show me failure, then implement." Adopt. GraphQL-heavy work benefits since schema-driven code is naturally testable via contract tests.

**Chunked-write protocol for long artifacts.** When `CLAUDE_CODE_MAX_OUTPUT_TOKENS` caps output (commonly 4096 in enterprise deployments), single-shot Writes of large files truncate. Community workaround in swyx's X posts and several public CLAUDE.md files: write an initial chunk then Edit-append with sentinel markers. Adopt for any document over roughly 1500 tokens. Not in Anthropic's docs.

**Worktree workflows for parallelism.** Beyond Superpowers, Willison, Cherny, and public CLAUDE.md files (humanlayer, Cloudflare Agents SDK) treat `git worktree add` as the standard way to run parallel Claude Code sessions without clobbering. Adopt. Consulting adaptation: store worktrees outside the repo (`~/.config/superpowers/worktrees/<project>/` or a client-approved scratch location) to avoid accidental commits.

**Memory iteration patterns.** Recurring HN theme: CLAUDE.md as a living document. Practices: ask Claude at end of session to propose CLAUDE.md edits based on mistakes; version CLAUDE.md in the repo; use per-subdirectory CLAUDE.md for module conventions (Anthropic documents this, community underuses it). Worth knowing. Every CLAUDE.md edit goes through normal code review.

**CLAUDE.md as a behavior contract.** Top public CLAUDE.md files (github filename:CLAUDE.md; anthropics/claude-code, cloudflare/agents, humanlayer, obra/superpowers, langchain-ai/langchain) are constitutional, not documentation: forbidden phrases, precedence rules, escalation triggers, tone rules. Adopt. Draft a CapTech-standard CLAUDE.md template engineers customize per engagement.

**Responsible-use patterns for sensitive data.** Consensus from Willison and HN for client-sensitive work: (1) never let Claude read files it does not need, use narrow scopes; (2) keep secrets out of context with env vars referenced symbolically; (3) review every outbound network call (WebFetch, curl, gh api) before allowing; (4) log sessions for auditability; (5) disable any skill that opens a browser or local server on a machine with client data. Not Anthropic prescriptions; community-evolved. Non-negotiable for the GraphQL engagement.

**CLAUDE.md snippets that keep recurring.** Worth lifting: "Before writing code, state the plan." "Never run git push --force without explicit confirmation." "If a test was passing and now fails, stop and ask before modifying the test." "When unsure, ask one question rather than guessing." "Do not add dependencies without asking." These or close variants appear in five-plus of the top ten public CLAUDE.md files surveyed.

## Anti-patterns the community has identified

**Letting Claude run on main.** Every mature CLAUDE.md forbids this. Superpowers subagent-driven-development lists it as a red flag. Anthropic does not emphasize it. Table stakes.

**Single-shot "build me X" prompts.** Most-recycled HN failure mode. Without a plan gate, Claude produces plausible code that drifts within two or three iterations. Fix: require a written plan.

**Treating subagents as free parallelism.** Dispatching many subagents on related problems creates integration hell. Community rule: fan out only on truly independent failure domains. Opposite of how Copilot-trained engineers think about agents.

**Skipping verification to look productive.** Willison's frequent complaint: the agent says "tests pass" without running them this turn. Verification-before-completion is the direct countermeasure.

**Trusting subagent success reports.** Orchestrator takes subagent's word; the work is not actually there. Always inspect the VCS diff after a subagent returns. Never trust the summary alone.

**Performative agreement in reviews.** "You're absolutely right!" and "Great catch!" signal capitulation without evaluation. Receiving-code-review explicitly forbids these. In consulting, performative agreement produces wrong implementations the reviewer must catch again.

**Over-installing skills.** Every installed skill bloats context. Install three to five that match your workflow.

**Using skills to replace judgment.** HN pushback on Superpowers as "ritual over thought." Skills are scaffolding for agents that would otherwise cut corners. Humans still do the engineering.

**Blindly forking public CLAUDE.md files.** Many encode project-specific assumptions (paths, test commands, personas). Lift patterns, not text.

**Browser-opening skills on client-managed machines.** Visual Companion opens a local HTTP server. Fine on a personal laptop, potentially a compliance incident on client-provisioned devices. Do not enable.

## Filtering note: hype vs substance

The honest take on the current Claude Code community ecosystem, calibrated for consulting engineers:

**Substance.** Plan-before-code. Worktree isolation. Verification-before-completion. Systematic-debugging's four-phase protocol. TDD loops with agent-written tests. Fresh-subagent-per-task with a spec reviewer and a quality reviewer. CLAUDE.md as behavior contract. These patterns repeatedly produce measurable improvements in output quality and in reduced rework. Adopt.

**Hype.** The maximalist framing of Superpowers as a universal workflow. The implication that installing fourteen skills makes you more effective than installing four. The "Iron Law" rhetoric that treats agentic discipline as a moral position rather than an engineering tradeoff. The visual-companion browser integration. Meta-skills that tell Claude to use skills. These are not wrong, but they are overbuilt for most situations and they confuse new users about where the actual leverage is.

**Jury still out.** Subagent-driven development with two-stage review. Genuinely powerful on large tasks, genuinely expensive on small ones, and the token economics will matter on billable work. Measure before defaulting to it.

**The actual advice for the CapTech team.** Install four skills: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `using-git-worktrees`. Write a CapTech-standard CLAUDE.md template cribbed from the common patterns above. Require a written plan for any task over roughly two hours. Keep `subagent-driven-development` and `writing-plans` on the bench for when the work justifies them. Ignore the rest of the ecosystem noise until the team has ninety days of practice on a real client engagement.

## Sources

- Superpowers plugin (vendored): `/Users/npeloquin/Documents/AI/Claude-ecosystem/vendor/superpowers/`
- Superpowers on GitHub: https://github.com/obra/superpowers
- Simon Willison blog, Claude Code tag: https://simonwillison.net/tags/claude-code/
- Boris Cherny on X: https://x.com/bcherny
- Shawn Wang (swyx) on X: https://x.com/swyx
- GitHub CLAUDE.md search: https://github.com/search?q=filename%3ACLAUDE.md&type=code
- Hacker News "claude code" search: https://hn.algolia.com/?q=claude+code
- Anthropic Claude Code docs (for comparison): https://docs.anthropic.com/claude/docs/claude-code

