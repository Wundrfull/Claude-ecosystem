---
name: evaluate-skill
description: When you need to validate whether a custom skill produces the expected behavior change using the five-step RED-GREEN methodology
args: skill_name
---

# Evaluate a Claude Code Skill

Run a structured five-step evaluation on a custom skill to determine whether it reliably changes Claude's behavior in the intended way.

## Usage

`/evaluate-skill [skill_name]`

Example: `/evaluate-skill graphql-dataloader`

## The Five-Step Methodology

This methodology comes from Anthropic's "build evaluations first" guidance combined with community RED-GREEN-REFACTOR practice. It measures whether the skill adds value by comparing behavior before and after.

### Step 1: Load Golden Tasks

Look for a `test-prompts.json` or `test-prompts.md` file in the skill directory (`.claude/skills/[skill_name]/`). Golden tasks are representative user queries that the skill should handle correctly.

Each golden task must include:
- `id`: unique identifier
- `prompt`: the user request
- `expected`: natural-language assertions about correct behavior
- `tests`: list of skill features this prompt exercises

If no golden tasks exist, stop and report: "No test-prompts file found. Write 3 golden tasks before evaluating."

### Step 2: Run RED Baseline (Without Skill)

For each golden task:

1. Start a fresh Claude Code session (or use a subagent) with the skill DISABLED
2. Execute the prompt
3. Capture the transcript
4. Score each `expected` assertion as PASS or FAIL
5. Document the specific behaviors Claude exhibits without the skill

Save transcripts to `baseline-transcript.md` or report them inline.

The baseline is the RED phase. If all assertions pass without the skill, the skill may be unnecessary (Claude already does the right thing).

### Step 3: Run GREEN Test (With Skill)

For each golden task:

1. Start a fresh Claude Code session with the skill ENABLED
2. Execute the same prompt
3. Capture the transcript
4. Score each `expected` assertion as PASS or FAIL
5. Document whether the skill was invoked (explicitly or implicitly)

Save transcripts to `with-skill-transcript.md` or report them inline.

The with-skill phase is GREEN. For the skill to be useful, it must pass assertions that failed in Step 2.

### Step 4: Compare and Analyze

For each golden task, produce a comparison table:

| Assertion | RED (no skill) | GREEN (with skill) | Improved? |
|-----------|----------------|---------------------|-----------|
| ...       | FAIL           | PASS                | Yes       |

Report:
- Which assertions improved (FAIL to PASS)
- Which assertions regressed (PASS to FAIL)
- Which assertions remained unchanged

A useful skill must show at least one improvement per golden task with zero regressions.

### Step 5: Pressure Test

Run each golden task 2-3 additional times with the skill enabled to check for nondeterminism. If results vary across runs, the skill may be underspecified or Claude is guessing.

Report:
- Consistency rate (e.g., "3/3 runs passed all assertions")
- Any variations in behavior across runs
- Recommendations for stabilizing the skill if inconsistent

## Output Format

Produce a structured evaluation report:

```markdown
# Skill Evaluation: [skill_name]

**Evaluated on:** [date]
**Model:** [Sonnet/Opus/Haiku version]

## Summary

[2-3 sentences: does this skill work as intended?]

## Golden Tasks

1. [id]: [brief description]
2. [id]: [brief description]
3. [id]: [brief description]

## RED Baseline (no skill)

### Task 1: [id]
- Expected: [assertion 1] → FAIL/PASS
- Expected: [assertion 2] → FAIL/PASS
- Observed behavior: [what Claude did]

[Repeat for tasks 2-3]

## GREEN Test (with skill)

### Task 1: [id]
- Expected: [assertion 1] → FAIL/PASS
- Expected: [assertion 2] → FAIL/PASS
- Skill invoked: Yes/No
- Observed behavior: [what Claude did]

[Repeat for tasks 2-3]

## Comparison

| Task | Assertion | RED | GREEN | Improved? |
|------|-----------|-----|-------|-----------|
| ...  | ...       | ... | ...   | ...       |

## Pressure Test Results

- Task 1: 3/3 consistent
- Task 2: 2/3 consistent (one run used different approach)
- Task 3: 3/3 consistent

## Verdict

[PASS / FAIL / NEEDS REVISION]

**Rationale:** [Why this verdict? What improved? What regressed? What needs fixing?]

## Recommendations

[If FAIL or NEEDS REVISION, list specific changes to the skill]
```

## Tips for Accurate Evaluation

1. Use fresh sessions for each run. Prior context can contaminate results.
2. Score assertions objectively. "Uses dataloader pattern" means you must grep for `DataLoader` or see the import.
3. If an assertion is vague ("code is clean"), make it concrete or skip it.
4. Check whether the skill was invoked. A skill that is never loaded cannot change behavior.
5. Test with the same model version. Opus and Haiku may behave differently even with identical skills.

## What This Does NOT Test

This methodology tests whether Claude's behavior changes when the skill is loaded. It does NOT test:

- Whether Claude chooses to load the skill in the first place (selection phase)
- Performance on tasks outside the golden set
- Behavior under adversarial pressure (time constraints, sunk cost, authority)

For discipline skills (skills that enforce process, not provide knowledge), add pressure scenarios from the superpowers testing-skills-with-subagents methodology.

## When a Skill Fails Evaluation

Common failure modes and fixes:

- **Skill never invoked:** Description does not match when-to-use triggers. Rewrite description to describe symptoms, not what the skill does.
- **Assertions fail even with skill loaded:** Instructions are unclear or too abstract. Add explicit steps, examples, or counter-examples.
- **Behavior is inconsistent:** Skill has too much freedom or relies on inference. Add constraints, make rules explicit.
- **Skill invoked but ignored:** Claude followed the description and skipped the body. Do not summarize workflow in description field.

After fixing, re-run the full five-step evaluation. Do not ship a skill that fails its own golden tasks.
