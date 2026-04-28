# Research R4: Evaluating Claude Code Skills

Audience: six CapTech consulting engineers authoring skills on client engagements.
Date: 2026-04-28.

## TL;DR

1. No community standard exists for evaluating Claude Code skills. The closest to a standard is Anthropic's own "build evaluations first" guidance, which is methodology not tooling.
2. promptfoo is the most mature generic prompt-eval harness, but it does not natively understand Claude Code skills. It can be adapted as an outer harness if you treat a skill invocation as a prompt under test.
3. For consulting work, adopt a minimal three-to-five-step eval loop: define gaps, write golden tasks, run baseline, add the skill, compare. That is what Anthropic documents and what the superpowers community practices under a different name (RED-GREEN-REFACTOR).

## What Anthropic officially says about skill evaluation

Anthropic publishes skill-authoring guidance in two places that matter here.

### 1. Claude Code skills reference

URL: https://code.claude.com/docs/en/skills (canonical; the old `docs.claude.com/en/docs/claude-code/skills` URL 301s here).

This page covers skill mechanics: frontmatter fields, invocation, lifecycle, permissions, substitutions, dynamic context injection with backtick-bang, subagent forking, and content budgets (skill description truncated at 1,536 characters, re-attached skills share a 25,000-token budget after compaction, first 5,000 tokens preserved per skill). It contains a short "Troubleshooting" section ("Skill not triggering", "Skill triggers too often", "Skill descriptions are cut short") which is the closest official surface-level diagnostic guidance.

It does not publish an evaluation framework. There is no `/eval`, no golden-task runner, no scoring rubric built in.

### 2. Agent Skills best practices (the authoring doc)

URL: https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices (redirects to `platform.claude.com`).

This doc has the only official evaluation guidance Anthropic publishes. The key section is titled "Build evaluations first" and prescribes evaluation-driven development:

1. Identify gaps by running Claude on representative tasks without the skill, document specific failures.
2. Create evaluations, build three scenarios that test these gaps.
3. Establish baseline by measuring Claude's performance without the skill.
4. Write minimal instructions, create just enough content to address the gaps and pass evals.
5. Iterate: execute evaluations, compare against baseline, refine.

They supply a JSON evaluation schema with `skills`, `query`, `files`, and `expected_behavior` fields. Critically they state: "We do not currently provide a built-in way to run these evaluations. Users can create their own evaluation system."

That is the official confirmation: no Anthropic-shipped harness exists.

## The "v2 skill-writing" methodology

The term "v2 skill-writing prompt" does not appear in Anthropic's public docs under that name. What the community calls "v2" maps to the current Agent Skills best-practices doc (https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices) plus the accompanying Skills overview at https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview. Web searches for the literal string returned nothing authoritative, so treat "v2" as informal shorthand for the current doc set rather than a discrete artifact.

The methodology it documents, in six points the team should internalize:

1. "The context window is a public good." Every token in SKILL.md competes with conversation history. Target: SKILL.md under 500 lines, skill frontmatter description under 1,024 characters. Progressive disclosure via linked reference files that Claude loads only when needed.
2. Match degrees of freedom to task fragility. High freedom (prose) for judgment calls. Low freedom (exact scripts) for migrations and fragile operations. The "robot on a narrow bridge vs open field" analogy.
3. Description field rules: third person, includes both what the skill does and when to use it, front-loads the key use case. This field is what Claude sees when selecting among many skills.
4. Build evaluations first, before writing extensive documentation.
5. Develop skills iteratively with two Claude instances: Claude A refines the skill, Claude B tests it in real tasks. Observe where B struggles, return to A with specifics.
6. Test with every model you plan to use (Haiku, Sonnet, Opus). A skill that works on Opus may need more explicit guidance for Haiku.

Surprising pattern to know: the description field is a behavior lever, not metadata. If a description summarizes the workflow, Claude follows the description and skips the skill body. The superpowers writing-skills doc proved this empirically (a description saying "code review between tasks" caused Claude to do one review despite the skill body mandating two). Rule: descriptions describe when to use, never what the skill does.

## Patterns from the superpowers writing-skills skill

File: `/Users/npeloquin/Documents/AI/Claude-ecosystem/vendor/superpowers/skills/writing-skills/SKILL.md`

Superpowers treats skill authoring as test-driven development applied to documentation. The RED-GREEN-REFACTOR cycle:

- RED: run a pressure scenario with a subagent without the skill. Document the exact rationalizations the agent uses verbatim. This is the baseline failure.
- GREEN: write the minimal skill that addresses those specific rationalizations. Re-run the scenario. Agent should comply.
- REFACTOR: when the agent finds a new rationalization, add an explicit counter. Build a rationalization table. Maintain a "Red Flags" list. Re-test until bulletproof.

Key tactics documented in `testing-skills-with-subagents.md`:

- Combine at least three pressures in a scenario (time, sunk cost, authority, exhaustion, social, pragmatic). Single-pressure scenarios are too weak.
- Force A/B/C choices rather than open-ended questions. "What do you do?" not "What should you do?".
- Use real file paths, specific times, concrete consequences. Make the agent believe it is real work.
- Meta-test after failure: ask the agent how the skill could have been written to prevent their choice. Three classes of answer (skill was clear but I ignored it, skill should have said X, I missed section Y) point to different fixes.

Note the superpowers `CLAUDE.md` explicitly states their philosophy differs from Anthropic's published guidance and that "compliance" PRs changing skills to match Anthropic docs will not be accepted without eval evidence. The team should read this as: two legitimate schools exist, pick the one that matches the client's risk profile.

## Patterns from a real custom skill

File: `/Users/npeloquin/.claude/skills/graphqlstagereport.md`

Concrete evaluation-adjacent patterns the team should copy:

- Chunked-write protocol. The skill explicitly names `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` as the constraint and specifies a five-chunk write plan with Edit-append between chunks. The skill encodes its own operational constraint as an instruction. Eval corollary: if your skill has a known failure mode (output-token cap, rate limit, model drift), name it in the skill body.
- Phased execution with explicit phase labels (Research, Write Report in 5 Chunks, Verify). Each phase has a concrete verification artifact. Eval corollary: skills with named phases are easier to evaluate because you can assert per-phase artifacts exist.
- Writing style rules stated upfront (no emojis, no em-dashes, professional tone). Eval corollary: style constraints are cheap to grep for in output, which makes them the easiest assertions to automate.

## Community frameworks (honest assessment)

### promptfoo

URL: https://promptfoo.dev/docs/providers/anthropic/

Real tool, mature, open source. It runs prompts against providers, supports model-graded assertions (factuality, rubric scoring), JSON-schema assertions, tool-call assertions, multi-turn, and can authenticate via an existing Claude Code OAuth session (useful so engagement-level API keys are not needed for Claude Pro/Max subscribers).

What it is NOT: promptfoo has no first-class concept of a Claude Code skill. It does not install SKILL.md files, does not simulate the skill-discovery phase where Claude selects which skill to load, does not model the 1,536-character description budget or the 25,000-token re-attach budget. Skills are a Claude Code feature, promptfoo is a provider-level prompt harness.

Useful for skills if: you extract the skill body, concatenate it with a test query, and treat the result as a prompt under test. That measures "given this skill loaded, does Claude do the right thing?" but does not measure "does Claude choose to load this skill in the first place?". The second question is arguably more important and promptfoo cannot answer it.

Verdict: adjacent, not native. Useful as an outer harness for golden-task regression tests. Not a replacement for running the skill end-to-end in Claude Code.

### Golden-task methodology

Not a branded framework, a pattern. Maintain a checked-in set of input queries plus expected-behavior assertions. Re-run them when the skill or model changes. Anthropic's JSON schema (`skills`, `query`, `files`, `expected_behavior`) is the schema shape to adopt. The huashu-design example below is this pattern in practice.

### huashu-design test-prompts.json

File: `/Users/npeloquin/Documents/AI/Claude-ecosystem/vendor/huashu-design/test-prompts.json`

Six test entries, each with four fields: `id`, `prompt` (user request), `expected` (verbose natural-language assertions about outputs), `tests` (short tag listing which skill features this prompt exercises). Example entry asserts that for "做一个 Habit Tracker App 原型" the output must use the ios_frame asset (not hand-written Dynamic Island), pick overview layout by default, deliver at least five screens, and include at least three information-density elements per screen.

This is a pragmatic implementation of the golden-task pattern. Strengths: assertions are specific and tied to skill sections. Weaknesses: assertions are natural-language so grading requires a human or a rubric-graded LLM pass. No baseline-without-skill comparison is captured in the file itself.

Honest assessment: a good template for the CapTech team. Copy the four-field shape. Keep entries under ten per skill so engineers actually run them.

### A/B prompt testing

Generic ML technique, not skill-specific. Useful when choosing between two candidate wordings for the same skill. Run both over the same prompt set, compare model-graded scores. Works fine with promptfoo's rubric assertions. Not a framework, a technique.

### "Skill regression" tools

Web search returned nothing branded. There is no "Jest for skills". The superpowers `testing-skills-with-subagents.md` doc is the closest thing to a tested methodology, but it is a document not a runner.

## Proposed minimal eval methodology for CapTech engagements

Five steps. Designed to fit into a one-week skill authoring sprint. Produces artifacts the client can own.

### Step 1. Write three golden tasks before writing the skill

Pick three user queries that represent the skill's job. Capture them as a JSON file with the shape Anthropic documents: `query`, optional `files`, `expected_behavior` (three to five bullet assertions in plain English). Ten minutes of work. Commit this file first.

### Step 2. Run the baseline without the skill

Execute each golden task in a fresh Claude Code session with the skill disabled (or before the skill exists). Paste the transcripts into a `baseline.md`. Note which `expected_behavior` bullets passed and which failed. This is the RED phase. If everything passes, delete the skill idea, Claude already does the job.

### Step 3. Write the skill targeting the specific failures

Author SKILL.md addressing only the baseline failures. Do not add content for hypothetical cases. Follow the five authoring rules from Anthropic: third-person description, "Use when" triggers, under 500 lines, progressive disclosure via linked files, match degrees of freedom to fragility.

### Step 4. Re-run the golden tasks with the skill

Fresh session, skill loaded. Paste transcripts into `verified.md`. For each expected_behavior bullet score pass/fail. Require pass on at least the bullets that failed in Step 2. If a bullet still fails, the skill is unclear. Revise and re-test.

### Step 5. Pressure test and meta-review

For skills that enforce discipline (rather than pure reference skills), add one scenario per pressure type from superpowers (time, sunk cost, authority). For reference skills, skip this step. Then run a human review of the final SKILL.md against a four-point checklist: description does not summarize workflow, body under 500 lines, one excellent example not five mediocre ones, no time-sensitive claims. Ship.

Optional step 6 for teams with promptfoo in place: convert the golden-task JSON into a promptfoo config and run it in CI on every skill edit. The harness will not catch every behavior regression (see promptfoo limits above) but catches stylistic and structural drift.

## What NOT to do (anti-patterns)

- Do not write the skill first and eval later. The baseline transcript is the eval. Skipping it means you cannot prove the skill adds value.
- Do not ship a skill whose description summarizes the workflow. Claude will follow the description and skip the body. Description = triggers, body = process.
- Do not use academic test prompts ("explain what this skill does"). Use real-work scenarios that force a choice.
- Do not test once and declare victory. The superpowers doc reports six RED-GREEN-REFACTOR iterations to bulletproof a single discipline skill. Expect to iterate.
- Do not treat promptfoo output as sufficient. It validates a skill's body given the skill is loaded. It does not validate that Claude will choose to load the skill.
- Do not put project-specific conventions in a skill. Those go in CLAUDE.md. Skills are for reusable patterns.
- Do not bulk-create skills in a batch. Superpowers explicitly forbids it. Write one, test it, ship it, then start the next.
- Do not skip testing on every model the client uses. A skill tuned for Opus can underperform on Haiku.
- Do not include time-sensitive facts in the skill body. Put deprecated patterns in a collapsible "Old patterns" section.
- Do not forget the output-token cap. If the skill produces long output (reports, decks, migrations), write a chunked-write protocol into the skill body, as the graphqlstagereport skill does.

## Summary for the team

No formal framework exists. Anthropic published a methodology ("build evaluations first") but no runner. The community best-practice is golden tasks plus a baseline comparison, implemented in whatever harness you have (plain markdown transcripts work, promptfoo works better for regression). Superpowers adds a disciplined TDD-style loop with pressure scenarios for discipline skills. The five-step methodology above is the honest middle ground: enough rigor to defend, cheap enough to actually run.
