# Stage Notes: 03-eval-harness

**Teaching target:** Close the skills segment with a practical methodology. This is the slide that answers "how do I know my skill works?"

**Duration on stage:** 3 minutes (this is the closer for the 14:00-22:00 block).

## What This Teaches

Writing a skill is half the job. Knowing whether it works is the other half. This skill encodes the five-step evaluation methodology from research-r4-skill-evaluation.md as a runnable process.

The five steps map directly to Anthropic's "build evaluations first" guidance plus the community's RED-GREEN-REFACTOR loop:
1. Load golden tasks (the test cases you wrote before the skill)
2. Run RED baseline without the skill (document failures)
3. Run GREEN test with the skill (document improvements)
4. Compare (did assertions move from FAIL to PASS?)
5. Pressure test (is it consistent across runs?)

This is not a novel framework. It is the honest minimum that the CapTech team can run on a client engagement without needing external tools. No promptfoo, no CI integration, just Claude Code itself used as the harness.

## Why It Exists

The community does not have a standard skill evaluation tool. Anthropic documents the methodology but ships no runner. This skill fills that gap by making the methodology executable. You invoke `/evaluate-skill graphql-dataloader` and it runs the five steps, produces a report, tells you pass or fail.

It is a meta-skill: a skill that evaluates skills.

## What To Say On Stage

"This is the slide that closes the skills section. You have seen how to write a skill. You have seen the counterintuitive description rule. You have seen a real pattern for large outputs. Now: how do you know it works?

The answer is a five-step loop. Step 1: write three golden tasks before you write the skill. Step 2: run them without the skill and document what fails. That is the RED baseline. Step 3: write the skill. Step 4: re-run the golden tasks with the skill loaded. That is GREEN. Step 5: compare. Did the failures turn into passes?

This skill encodes that loop. You invoke `/evaluate-skill [name]` and it runs all five steps, produces a report, and tells you whether the skill works. The report format is the same one we used in research: a comparison table showing which assertions improved, which regressed, which stayed the same.

If a skill passes its golden tasks, ship it. If it fails, the report tells you why. The most common failure: the skill is never invoked because the description does not match when-to-use triggers. That ties back to the behavior lever rule we covered earlier.

The key point: do not ship a skill without running this. A skill that fails its own test cases is documentation theater. A skill that passes its test cases is a tool the team can rely on."

Then show the test-prompts.json file structure on screen (id, prompt, expected, tests). Say: "This is the golden task format. Four fields. Concrete assertions. You can write this in five minutes. Do not skip it."

## Why This Is The Closer

This skill synthesizes everything from the segment:
- Golden tasks (write tests first)
- The description field (if the skill is not invoked, fix the description)
- RED-GREEN comparison (measure behavior change, not opinions)
- Pressure testing (nondeterminism means underspecified instructions)

It is also the most actionable. The team can run this Monday morning on any skill they find or write. It gives a concrete verdict: pass, fail, or needs revision.

The segment opened with anatomy (01-minimal), showed a real pattern (02-chunked-write), and closes with validation (03-eval-harness). That is the arc: how to write, what works, how to know.

## Caveats and Limitations

This methodology tests behavior change given the skill is loaded. It does NOT test whether Claude will choose to load the skill in the first place. That is the selection problem, and it is harder to test (requires observing skill-discovery phase, which is not exposed in transcripts).

For discipline skills (skills that enforce process under pressure), this methodology is not enough. You need adversarial scenarios with time constraints, sunk cost, authority, exhaustion. Those come from superpowers testing-skills-with-subagents.md and are beyond scope for this talk.

The evaluation is also model-specific. A skill that passes on Opus may fail on Haiku. If the client uses multiple models, run the eval on each.

Finally, this is a manual process. Each step requires reading transcripts and scoring assertions by hand. If the team wants to automate this, they can adapt it into a promptfoo config (see R4 for details), but that is a follow-on step.
