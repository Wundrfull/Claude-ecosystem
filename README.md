# Claude Code Team Primer

A 60-minute technical presentation introducing Claude Code to experienced software engineers who are already familiar with GitHub Copilot. Built for a 6-person CapTech consulting team onboarding to a GraphQL-heavy client project, this talk covers the shift from inline autocomplete to autonomous agentic workflows.

<!-- [Motion: intro clip placeholder - see motion/out/intro.mp4 after rendering] -->

## Watch the Talk

[TODO: recording link will be added post-delivery]

The session was delivered April 29-30, 2026, with live demos and Q&A. Recording to be published publicly as a reference for engineers exploring Claude Code for client engagements.

## Run the Deck

The presentation is a browser-based slide deck with keyboard navigation.

```bash
cd slides
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Navigation: Use arrow keys or click to advance. The deck includes 66 slides across 11 sections, from cold open through wrap and Q&A seeds.

## Render the Motion Graphics

Four Remotion compositions power the visual explanations: intro, agentic loop, context rot, and CapTech stamp.

```bash
cd motion
npm install

# Symlink brand assets (fonts, logos) - adjust path if needed
ln -s ../brand-assets brand-assets

# Render all clips
npm run render:all

# Or render individual clips
npm run render:intro
npm run render:agentic-loop
npm run render:context-rot
npm run render:captech-stamp
```

Rendered outputs land in `motion/out/` as MP4 files. Preview compositions during development with `npm start`.

## Walk the Scenarios

Two live GraphQL demos anchor the talk, both set in a gqlgen-wrapped subgraph environment.

### Scenario B: Consumer-Driven Field Addition

**Location:** `demos/synthetic-subgraph/DEMO-SCRIPT-B.md`

A frontend team requests two new fields on the Product type (averageRating, reviewCount). Walk through schema update, dataloader implementation, resolver logic, and test-driven development. Demonstrates navigating unfamiliar code with Claude Code and avoiding N+1 query patterns.

**Fallback files:** If the live demo hits network or environment issues, pre-rendered terminal transcripts and expected outputs live in `demos/synthetic-subgraph/fallback/`.

### Scenario D: CI/PR Triage

**Location:** `demos/synthetic-subgraph/DEMO-SCRIPT-D.md`

A pull request fails CI with a codegen-drift error. Walk through identifying the root cause (schema updated without regenerating code), fixing the drift, and pushing a clean commit. Showcases commands like `/pr-fix` and `/ultra-review` in a realistic workflow.

## Adopt the CLAUDE.md Template

The `templates/` directory contains a production-ready CLAUDE.md template for use on client engagements.

**Location:** `templates/CLAUDE.md.template`

**Purpose:** CLAUDE.md is a behavior contract that tells Claude Code how to operate in your codebase. It defines non-negotiable rules (planning, version control, testing, code generation), project-specific conventions (dataloader patterns, error handling, CI checks), and verification commands.

**How to use:**
1. Copy `templates/CLAUDE.md.template` to the root of your client project as `CLAUDE.md`
2. Replace all `<<PLACEHOLDER>>` markers with project-specific information
3. Customize the Core Rules and Conventions sections to match team standards
4. Commit it to version control so all team members and Claude Code instances share the same contract

**When to update:** Treat CLAUDE.md as living documentation. Update it when you discover new patterns, add code generation tools, or refine verification steps. Review it during retrospectives.

## Directory Map

| Directory | Purpose | Start Here |
|-----------|---------|------------|
| `slides/` | Browser-based presentation deck (11 sections, 66 slides) | `slides/index.html` |
| `motion/` | Remotion compositions for motion graphics (4 clips) | `motion/package.json` |
| `demos/` | GraphQL scenario walkthroughs (B: field addition, D: CI triage) | `demos/synthetic-subgraph/DEMO-SCRIPT-B.md` |
| `notes/` | Research synthesis, minute-by-minute outline, brand spec | `notes/outline.md` |
| `skills-lab/` | Example custom skills for teaching skill authorship | `skills-lab/README.md` |
| `rehearsal/` | Speaker notes, timing cues, Q&A seeds, pre-flight checklist | (being filled by teammate) |
| `templates/` | Production-ready CLAUDE.md template for client projects | `templates/CLAUDE.md.template` |
| `vendor/` | Reference clones (gitignored): superpowers, impeccable, huashu-design, remotion | (local only) |
| `brand-assets/` | CapTech logos, Gibson font files, brand PDFs (gitignored) | (local only) |

## The Three Levers

The talk is built around one core thesis: Claude Code is not autocomplete; it is an autonomous coding agent, and the three levers that decide whether it helps or hurts are:

### 1. Context: What You Put In

Large context windows sound like a superpower, but performance degrades as context grows. The "needle in a haystack" problem is real: after 50KB of context, Claude's accuracy drops measurably. Solution: use CLAUDE.md to encode conventions, use skills to encapsulate repeatable workflows, and prune context aggressively between tasks.

### 2. Capability: What You Let It Do

Claude Code has access to Read, Edit, Write, and Bash tools. Skills extend these capabilities with custom workflows. The key question: which skills travel to the client side? CapTech sandbox vs. client-ready is a recurring motif. Every tool, skill, and command in this talk carries a stamp indicating whether it is production-safe for client engagements.

### 3. Verification: How You Check Its Work

Agentic tools require verification discipline. Run tests after every change. Review diffs before committing. Use CI checks to catch drift. The talk covers specific verification patterns: golden-task eval harnesses for skills, table-driven resolver tests for GraphQL, and pre-commit hooks for codegen drift.

These three levers are not independent. Good context hygiene reduces the need for complex verification. Clear capability boundaries make context management easier. The talk returns to this framework repeatedly.

## The Two-Environment Motif

Every tool, skill, and command introduced in the talk carries a label: **CapTech sandbox** or **client-ready**.

**CapTech sandbox:** Experimental tools, unvetted skills, bleeding-edge commands. Safe to try internally. Not safe to run on client codebases without explicit approval.

**Client-ready:** Proven workflows, official Anthropic features, audited skills. Travel to client engagements with confidence.

This distinction matters because consulting teams often have access to tools and data that clients do not (or should not). The talk trains engineers to ask "would I run this on the client side?" before adopting a new workflow.

## Research Sources

The `notes/` directory contains six research files synthesizing official documentation, community patterns, and hands-on testing.

- `research-r1-anthropic-official.md` - Official Anthropic docs, training materials, mental models
- `research-r2-commands-inventory.md` - Built-in commands as of April 2026 (`/pr-fix`, `/ultra-review`, etc.)
- `research-r3-community-patterns.md` - Discord patterns, Reddit threads, GitHub discussions
- `research-r4-skill-evaluation.md` - How to write and test custom skills
- `research-r5-graphql-workflows.md` - GraphQL-specific patterns for gqlgen, dataloaders, schema-first vs. code-first
- `research-r6-context-and-responsible-use.md` - Context hygiene, token economics, responsible use guidelines

These files are dense and technical. They are not meant to be read during the talk, but they anchor every claim made on stage.

## Skills Lab

The `skills-lab/` directory contains three teaching-focused custom skills used during the "writing and evaluating skills" segment.

- `01-minimal/` - The smallest possible SKILL.md, used to show anatomy
- `02-chunked-write/` - A real-world pattern for working around the 4096 output token cap
- `03-eval-harness/` - A tiny 3-prompt golden-task suite showing how to spot-check whether a skill works

Each skill folder includes the skill itself (`SKILL.md`), teaching notes (`NOTES.md`), and test prompts for evaluation (`test-prompts.md` or `.json`).

These are not production skills. They are pedagogical artifacts designed to illustrate skill authorship principles in a 60-minute talk.

## Rehearsal Resources

The `rehearsal/` directory is being filled by a teammate and contains:

- `speaker-notes.md` - Full speaker script with beat-by-beat talking points
- `pre-flight.md` - 30-minute pre-talk checklist (environment setup, demo dry run, slide verification)
- `timing-cues.md` - Section timings, transition signals, hard stops for Q&A
- `qa-seeds.md` - Anticipated questions with prepared answers

These files support talk delivery and are not meant for the audience.

## Credits

**Anthropic:** Claude Code platform, official documentation, Skilljar training courses  
**Jesse Vincent:** superpowers skill collection (referenced in skills segment)  
**CapTech:** Brand assets, Gibson typeface, internal consulting patterns  
**Community:** Discord patterns, Reddit workflows, GitHub skill examples

## License

[TODO: license to be determined before public release]

---

**For questions about this talk or the Claude Code ecosystem, contact the CapTech AI Delivery team.**
