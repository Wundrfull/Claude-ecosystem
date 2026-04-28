# Navigation Index

Quick-reference guide for finding resources in this repository. If you are looking for a specific file or section, start here.

---

## Before the Talk (Rehearsal)

**Who needs this:** Presenter preparing for delivery

- `rehearsal/speaker-notes.md` - Full speaker script with beat-by-beat talking points and transition cues
- `rehearsal/pre-flight.md` - 30-minute pre-talk checklist for environment setup and demo verification
- `rehearsal/timing-cues.md` - Section timings, hard stops, and pacing guides to stay within 60 minutes
- `rehearsal/qa-seeds.md` - Anticipated audience questions with prepared answers and deflection strategies

**Note:** Rehearsal directory is being filled by a teammate during production phase. Files may not exist until final prep.

---

## During the Talk (Presenter Resources)

**Who needs this:** Presenter during live delivery

### Slide Deck

- `slides/index.html` - Main entry point for the presentation (open in browser, use arrow keys to navigate)
- `slides/sections/00-cold-open.html` through `slides/sections/10-wrap.html` - 11 section files totaling 66 slides

**To run:** `cd slides && python -m http.server 8000`, then open `http://localhost:8000`

### Motion Graphics

- `motion/out/intro.mp4` - 60-90 second intro clip (terminal prompt types itself, agent loop visualizes)
- `motion/out/agentic-loop.mp4` - 20 second explainer of the agent loop model (Read/Edit/Bash/MCP cycle)
- `motion/out/context-rot.mp4` - 20 second visualization of context degradation as input grows
- `motion/out/captech-stamp.mp4` - 20 second branding motif showing sandbox vs. client-ready distinction

**Note:** These files are generated after running `npm run render:all` in the `motion/` directory. They do not exist in the repository until rendered locally.

### Live Demos

- `demos/synthetic-subgraph/DEMO-SCRIPT-B.md` - Scenario B walkthrough (consumer-driven field addition with dataloaders)
- `demos/synthetic-subgraph/DEMO-SCRIPT-D.md` - Scenario D walkthrough (CI/PR triage for codegen drift)
- `demos/synthetic-subgraph/CLAUDE.md` - The behavior contract Claude Code reads during the demo

### Fallback Files (If Live Demo Fails)

- `demos/synthetic-subgraph/fallback/expected-output-step-1-plan.md` - Pre-captured output showing the planning phase
- `demos/synthetic-subgraph/fallback/expected-output-step-2-schema-diff.md` - Pre-captured diff of schema changes
- `demos/synthetic-subgraph/fallback/expected-output-step-3-resolver.md` - Pre-captured resolver implementation
- `demos/synthetic-subgraph/fallback/expected-output-step-4-test.md` - Pre-captured test output showing green suite
- `demos/synthetic-subgraph/fallback/expected-terminal-transcript.md` - Full terminal session recording as text
- `demos/synthetic-subgraph/fallback/FALLBACK-PLAN.md` - Instructions for switching to pre-recorded content mid-demo

**When to use:** If network drops, Claude API is down, or demo environment breaks during live delivery.

---

## After the Talk (Attendee Resources)

**Who needs this:** Engineers who attended the talk and want to apply concepts on their projects

### CLAUDE.md Template

- `templates/CLAUDE.md.template` - Production-ready behavior contract template for client projects
- `templates/README.md` - Instructions for filling placeholders and customizing rules

**Use case:** Copy this template to the root of your client project, replace placeholders, commit to version control. Claude Code will read it automatically and follow your project-specific conventions.

### Custom Skills Examples

- `skills-lab/01-minimal/SKILL.md` - Smallest possible skill showing basic anatomy (trigger, instructions, examples)
- `skills-lab/02-chunked-write/SKILL.md` - Pattern for handling 4096 output token limit with chunked writes
- `skills-lab/03-eval-harness/SKILL.md` - Golden-task suite pattern for testing skills before deploying them

**Use case:** Reference these when writing your own custom skills. Each folder includes teaching notes and test prompts.

### Deep Research

- `notes/research-r1-anthropic-official.md` - Official Anthropic documentation synthesis (mental models, training materials, official features)
- `notes/research-r2-commands-inventory.md` - Built-in commands as of April 2026 (what they do, when to use them, sandbox vs. client-ready)
- `notes/research-r3-community-patterns.md` - Discord, Reddit, and GitHub patterns from early adopters
- `notes/research-r4-skill-evaluation.md` - How to write, test, and validate custom skills before production use
- `notes/research-r5-graphql-workflows.md` - GraphQL-specific patterns for gqlgen, dataloaders, schema-first vs. code-first
- `notes/research-r6-context-and-responsible-use.md` - Context hygiene, token economics, sensitive data handling, hallucination mitigation

**Use case:** If you want to go deeper on any topic from the talk, start with the corresponding research file. These are dense technical documents with citations and examples.

---

## Source Material (For the Curious)

**Who needs this:** Engineers who want to understand how the talk was built or verify claims

### Talk Structure

- `notes/outline.md` - Minute-by-minute breakdown with section timings, slide descriptions, and speaking notes
- `notes/outline-skeleton.md` - High-level structure without detailed timing (useful for understanding flow)
- `notes/brand-spec.md` - Visual design decisions, typography, color palette, CapTech brand integration

**Use case:** If you are adapting this talk for another audience or building a related presentation.

### Demo Repositories

- `demos/synthetic-subgraph/` - Complete gqlgen-based GraphQL subgraph used in live demos (schema, resolvers, dataloaders, tests, CI config)

**Use case:** Clone this repo and practice the demos yourself. It is a fully functional (though synthetic) codebase designed for teaching.

### Vendor References

- `vendor/superpowers/` - Jesse Vincent's skill collection (referenced during skills segment, gitignored, must clone locally)
- `vendor/impeccable/` - Another community skill repo used for comparison (gitignored)
- `vendor/huashu-design/` - Design system reference (gitignored)
- `vendor/remotion/` - Remotion framework clone for motion graphics development (gitignored)

**Note:** These directories are gitignored. To access them, you must clone the referenced repositories manually. Paths are documented in `.gitignore`.

---

## Built With

**Claude Code Platform:** Anthropic's agentic coding tool (https://code.claude.com)  
**Remotion:** Motion graphics framework for programmatic video (https://remotion.dev)  
**Gibson Typeface:** CapTech brand typography  
**gqlgen:** Go library for building GraphQL servers (https://gqlgen.com)

**Anthropic Documentation:** https://docs.claude.com, https://code.claude.com/docs  
**Anthropic Skilljar Training:** Claude Code 101, Claude Code in Action (https://learn.anthropic.com)

---

## Quick Lookups

### "I want to run the slides locally"

`cd slides && python -m http.server 8000`, then open `http://localhost:8000`

### "I want to render the motion graphics"

`cd motion && npm install && npm run render:all`

### "I want to see the live demo scripts"

`demos/synthetic-subgraph/DEMO-SCRIPT-B.md` and `DEMO-SCRIPT-D.md`

### "I want the CLAUDE.md template for my project"

`templates/CLAUDE.md.template`

### "I want to write a custom skill"

`skills-lab/01-minimal/SKILL.md` (start here), then `skills-lab/02-chunked-write/` and `skills-lab/03-eval-harness/` for advanced patterns

### "I want the research behind a specific topic"

Check `notes/research-r1-anthropic-official.md` through `notes/research-r6-context-and-responsible-use.md` based on topic

### "I want the minute-by-minute talk outline"

`notes/outline.md`

### "I need the pre-talk checklist"

`rehearsal/pre-flight.md`

---

## File Counts and Verification

This navigation index references:
- 11 slide section files
- 4 motion compositions
- 6 research documents
- 3 skill lab examples
- 2 demo scripts
- 6 fallback files
- 2 template files
- 4 rehearsal files (being filled by teammate)
- 4 vendor repositories (gitignored, must clone locally)

Last verified: 2026-04-28
