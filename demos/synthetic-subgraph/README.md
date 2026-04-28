# Synthetic GraphQL Subgraph Demo

## Purpose

This is a minimal, teaching-focused gqlgen-based GraphQL subgraph created for a Claude Code demo presentation to a CapTech consulting team (April 29-30, 2026).

**This is NOT production code.** It's designed to feel realistic enough for live demos while remaining simple enough to teach core patterns in a 1-hour session.

## What This Repo Demonstrates

- Standard gqlgen project structure
- Schema-first GraphQL development workflow
- Resolver implementation patterns
- Dataloader pattern for N+1 query prevention (stubbed)
- CI codegen-drift detection
- CLAUDE.md conventions for AI-assisted development

## Demo Scenarios

This repo supports two live demo scenarios:

**Scenario B: Consumer-Driven Field Addition**
- A consumer team requests new fields on the Product type
- Live demo shows Claude Code navigating the codebase, updating schema, implementing resolvers with dataloaders, and writing tests
- See `DEMO-SCRIPT-B.md` for the full script

**Scenario D: CI/PR Triage with Codegen Drift**
- A PR fails CI due to codegen-drift error
- Pre-recorded screencast shows Claude Code interpreting the error, fixing it, and using `/ultrareview`
- See `DEMO-SCRIPT-D.md` for the full script

## Local Setup

This repo is designed to look realistic but doesn't need to fully compile or run. For the demo:

```bash
# Install dependencies (for realism, not strictly required)
go mod tidy

# Regenerate gqlgen code (demonstrates the workflow)
go run github.com/99designs/gqlgen generate

# Run tests (may not pass, demo purposes only)
go test ./...
```

## Key Files for Demo

- `CLAUDE.md` - The subgraph's AI assistant documentation
- `schema.graphql` - GraphQL schema (one Product type with 3-4 fields)
- `graph/schema.resolvers.go` - Resolver implementations
- `loader/product.go` - Dataloader pattern example
- `ci-failure.log` - Simulated CI failure for Scenario D
- `DEMO-SCRIPT-B.md` - Stage directions for Scenario B
- `DEMO-SCRIPT-D.md` - Stage directions for Scenario D

## Real Client Context

The actual CapTech client project is a production gqlgen subgraph with:
- 20+ types, 50+ resolvers
- Complex federation with 4 other subgraphs
- Heavy dataloader usage
- Strict CI checks including codegen-drift detection

This synthetic repo captures the essential patterns without the complexity.

## For Presenters

Before the demo:
1. Read `DEMO-SCRIPT-B.md` and `DEMO-SCRIPT-D.md` completely
2. Practice the prompts - exact wording matters for Claude's behavior
3. Have fallback code snippets ready (see scripts)
4. Test that `claude` CLI is working and authenticated
5. Ensure `gh` CLI is installed and authenticated for Scenario D

Common demo risks:
- Claude might not find the dataloader pattern on first try (iterate with follow-up prompt)
- Codegen might fail if Go environment is misconfigured (have pre-generated files ready)
- `/autofix-pr` requires GitHub authentication (test beforehand)

## Questions During Demo

Expected audience questions and answers:

**Q: Does this work with Apollo Federation?**
A: The real client project does. This demo focuses on gqlgen fundamentals, but the patterns apply to federated subgraphs.

**Q: How do you handle schema coordination between subgraphs?**
A: The real project uses schema registry and federation composition checks in CI. Out of scope for this demo.

**Q: What about authentication/authorization?**
A: Real project uses JWT tokens and directive-based auth. Skipped here for simplicity.

## Post-Demo

After the session, this repo can be extended for practice:
- Add real resolver implementations with in-memory data
- Wire up the dataloader completely
- Add federation directives
- Implement the authentication pattern mentioned in CLAUDE.md

But for the 1-hour demo, this minimal version is intentionally teaching-focused, not comprehensive.
