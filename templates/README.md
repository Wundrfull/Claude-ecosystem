# CapTech CLAUDE.md Starter Template

This directory contains a production-ready CLAUDE.md template for CapTech consulting engineers to use on client engagements. The template encodes community-proven patterns and is designed to be filled in on day 1 of a project.

## What This Template Is

CLAUDE.md is not a readme. It is a behavior contract that defines how Claude Code operates in a codebase. Top public projects (Anthropic's own repos, Cloudflare, LangChain, others) treat CLAUDE.md as a constitution: forbidden phrases, precedence rules, escalation triggers, and verification gates.

This template reflects that philosophy. It is opinionated. It assumes the consulting context: client data, billable tokens, reputation risk, and zero tolerance for hallucinated code shipped to production.

## How to Use It

1. Copy `CLAUDE.md.template` into the root of your client project as `CLAUDE.md`
2. Search for `<<PLACEHOLDER>>` markers (there are 20-25 of them)
3. Fill in each placeholder with project-specific information
4. Remove sections that do not apply (e.g., the GraphQL section if this is not a GraphQL project)
5. Commit the file to version control
6. Treat it as a living document - update it when conventions change or mistakes happen

## Placeholders You Must Fill In

The template has placeholders for:

- **Project type and technologies**: What kind of app is this? What stack?
- **Build/test/lint commands**: The exact commands Claude should run to verify its work
- **Code generation command**: If this project uses gqlgen, graphql-codegen, protoc, sqlc, or similar - the command to run and which files it generates
- **File patterns**: Which files are generated (never edit by hand) vs handwritten
- **Code conventions**: Error handling, logging, null handling, async patterns
- **PR conventions**: Title format, description requirements, CI gates
- **Common pitfalls**: 3-5 project-specific gotchas that have caused problems before
- **Skills enabled**: Which Claude Code skills the team has agreed to use

## Customizing for Different Project Types

The template is written with a GraphQL bias (reflecting the presentation's audience). Adapt it:

### For a gqlgen GraphQL API (Go)

- Keep the GraphQL section
- Code generation command: `go run github.com/99designs/gqlgen generate`
- Generated files: `graph/generated.go`, `graph/model/models_gen.go`
- Test command: `go test ./...`
- Common pitfall: forgetting to regenerate after schema changes causes drift errors in CI

### For a TypeScript React app with graphql-codegen

- Keep the GraphQL section but reframe for frontend
- Code generation command: `npm run codegen` (or `graphql-codegen`)
- Generated files: `src/generated/graphql.ts` or similar
- Test command: `npm test`
- Common pitfall: Apollo cache not updating after mutations

### For a Python FastAPI service (no GraphQL)

- Delete the GraphQL section entirely
- Code generation command: usually none, or `datamodel-codegen` for Pydantic models
- Test command: `pytest`
- Lint command: `black --check . && ruff check .`
- Common pitfall: datetime objects must be UTC-aware

### For a non-generated codebase

- Set code generation command to "N/A"
- Set generated files to "N/A"
- Remove the "never edit generated files" warnings

## Checklist Before Committing Your First CLAUDE.md

Use this checklist before committing the filled-in CLAUDE.md to the client repo:

- [ ] All `<<PLACEHOLDER>>` markers are replaced or the section is removed
- [ ] Build, test, and lint commands are verified (you ran them yourself)
- [ ] Code generation command is correct and you have confirmed which files it produces
- [ ] PR conventions match what the client actually uses (check their existing PRs)
- [ ] Secrets guidance reflects the client's actual secret management (not a generic statement)
- [ ] Common pitfalls section has at least 2-3 real items from the project, not generic advice
- [ ] Skills list matches the skills your team has actually installed and agreed to use
- [ ] GraphQL section is removed if this is not a GraphQL project
- [ ] The file is committed to version control (not gitignored)

## What the Template Encodes

This template is based on research into community CLAUDE.md patterns (April 2026) and reflects:

- **Five recurring lines** from top public CLAUDE.md files: plan before code, no force-push without confirmation, ask before modifying passing tests, ask instead of guessing, no dependencies without approval
- **Cite-the-file-and-line rule**: the single highest-ROI habit for catching hallucinated APIs, imports, and schema fields
- **Verification-before-completion pattern**: Claude must run the verification command in the current turn before claiming done
- **Two-environment awareness**: stricter rules apply on the client-billed side (token hygiene, secret scrubbing, security review)
- **Instruction precedence ladder**: user instructions beat CLAUDE.md, CLAUDE.md beats skills, skills beat training

## Skills Worth Installing

The template references skills. These are the four recommended for consulting teams:

1. **test-driven-development** - enforces red-green-refactor, prevents production code without a test
2. **systematic-debugging** - four-phase protocol (root cause, pattern, hypothesis, fix) stops Claude thrashing
3. **verification-before-completion** - forces Claude to run verification in-turn, highest ROI for reputation risk
4. **using-git-worktrees** - isolates parallel Claude Code sessions, prevents clobbering

Install these from the Superpowers library (github.com/obra/superpowers) or write your own. Keep the list short - every skill bloats context.

## Maintenance and Iteration

CLAUDE.md is not set-and-forget. The community pattern: at the end of a session where Claude made a mistake, ask it to propose a CLAUDE.md edit that would prevent that mistake in the future. Review the proposal, commit it if it makes sense.

Every CLAUDE.md edit goes through normal code review like any other code change.

## What This Template Excludes

Intentionally not included:

- Philosophical justifications or "why CLAUDE.md matters" prose (the team already knows)
- Emojis or informal tone (this is a professional artifact going into a client repo)
- Em-dashes and flowery writing (keep it direct)
- Project-specific implementation details (those are placeholders you fill in)
- Experimental or unproven patterns (everything here has community evidence or Anthropic documentation)

## Questions and Issues

This template was built as part of the Claude Code Team Primer (April 2026). The accompanying research and presentation materials are in the parent repository.

If you find a bug or have a suggestion, update the template and share it back with the team. This is a living artifact.

## License and Usage

This template is for CapTech internal use on client engagements. Customize freely. Remove this README before committing to a client repository (clients do not need the meta-explanation).
