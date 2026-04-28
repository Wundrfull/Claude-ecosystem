# Demo Script: Scenario D - CI/PR Triage with Codegen Drift

**Duration:** 15 minutes including Q&A  
**Difficulty:** Medium-High (uses `/autofix-pr`)  
**Format:** Pre-recorded screencast (not live)

## Context

You pushed a PR that adds new fields to the Product schema. CI fails with a check called "codegen-check" showing the working tree is dirty. The error message points to generated code being out of sync. You need to understand the error, fix it, and optionally run deep review.

## Learning Goals

- Interpret CI logs and understand codegen-drift errors
- Learn the "schema + generated code" commit pattern
- Explore `/autofix-pr` for autonomous PR fixes
- Use `/ultrareview` for deep pre-merge validation

---

## Pre-Recording Setup

**CRITICAL: Authentication Requirements**

- `/ultrareview` requires claude.ai authentication (NOT Bedrock/Vertex/Foundry)
- This command will NOT work on AWS Bedrock or enterprise deployments
- **This demo MUST be pre-recorded** because of the claude.ai auth requirement
- The screencast needs to be captured on a machine with claude.ai credentials configured

**If your organization uses Bedrock:**
- Record this scenario on a personal machine with claude.ai access
- Or skip `/ultrareview` entirely and show only `/autofix-pr` (which works on Bedrock)
- Or use mock output from `fallback/` directory

---

1. **Create the failing PR:**
   ```bash
   cd /path/to/demos/synthetic-subgraph
   git checkout -b feature/add-review-fields
   # Edit schema.graphql to add averageRating and reviewCount
   # DO NOT run codegen
   git add graph/schema.graphql
   git commit -m "Add review fields to Product schema"
   git push origin feature/add-review-fields
   ```

2. **Wait for CI to fail** (or simulate with ci-failure.log)

3. **Recording setup:**
   - Screen recording software ready (QuickTime, OBS, etc.)
   - Terminal with large, readable font (18pt minimum)
   - Browser with PR page open showing red X
   - This script on second monitor
   - Verify `gh` CLI is installed and authenticated: `gh auth status`
   - Verify Claude Code uses claude.ai (not Bedrock): check `~/.claude/config.json`

---

## Step 1: Understanding the CI Failure (2 minutes)

**Narrate to camera:**  
"Our PR is failing CI. Let's use Claude to understand what's wrong."

**Type in Claude:**
```
My PR is failing the "codegen-check" CI step. Can you look at the CI log 
and explain what's wrong and how to fix it?
```

**If `gh` CLI works, Claude will:**
- Run `gh pr checks`
- Read failing check logs
- Explain the codegen-drift error

**If `gh` CLI not available, paste log:**
```
The CI is failing. Here's the log:
<paste contents of ci-failure.log>

What's wrong and how do I fix it?
```

**Expected Claude output:**
```
The codegen-check is failing because your schema.graphql was updated 
but the generated code wasn't regenerated and committed.

gqlgen generates Go code from your GraphQL schema. When the schema changes, 
the generated code must be updated and committed together.

To fix:
1. Run: go run github.com/99designs/gqlgen generate
2. Commit the generated files
3. Push the fix
```

**Narrate:**  
"This is a common mistake in gqlgen projects. Let's see if Claude can fix it autonomously."

---

## Step 2: Using /autofix-pr (3 minutes)

**Narrate to camera:**  
"I'll use the `/autofix-pr` command. This is a research preview feature that watches your PR and auto-fixes CI failures."

**Type in Claude:**
```
/autofix-pr
```

**Expected Claude behavior:**
1. Detects current branch
2. Finds PR via `gh pr view`
3. Reads CI check status
4. Identifies codegen-check failure
5. Runs `go run github.com/99designs/gqlgen generate`
6. Stages generated files
7. Creates commit: "Regenerate gqlgen code for schema changes"
8. Pushes to PR branch
9. Continues watching

**Show in recording:**
- Terminal output of `/autofix-pr` working
- Switch to browser showing PR page
- Refresh to show new commit
- Show CI re-running

**Narrate:**  
"Notice it didn't just tell me what to do - it did it. This is agentic behavior. It's now watching for more failures or review comments."

**Show stopping the watch:**
Press Ctrl+C to stop watching.

---

## Step 3: Explain the Drift (2 minutes)

**Narrate:**  
"Let's understand what actually changed in the generated code."

**Type in Claude:**
```
Show me the diff in the generated files. What exactly did gqlgen regenerate?
```

**Expected Claude behavior:**
- Runs `git show HEAD` or `git diff HEAD~1`
- Explains changes:
  - New resolver interface methods
  - New resolver stub implementations
  - Updated type definitions

**Narrate as Claude explains:**  
"This is why we commit schema and generated code together. The schema is the contract, the generated code enforces it. If they're out of sync, the API is broken."

---

## Step 4: Deep Review with /ultrareview (5 minutes)

**Narrate:**  
"The PR is green now, but before merging, let's run a deep review. This is a new April 2026 feature."

**Type in Claude:**
```
/ultrareview
```

**Expected Claude behavior:**
1. Shows "Starting ultrareview... this will take 5-10 minutes"
2. Spawns cloud session with multiple agents
3. Shows progress indicator
4. Returns structured report

**For recording:** Mock this with pre-written output since it's slow:
```
◆ ultrareview ready

Found 2 high-confidence issues:

1. SECURITY: Product resolver methods don't validate product ownership
   Location: graph/schema.resolvers.go:15
   Severity: High
   Recommendation: Add authorization check before returning data

2. PERFORMANCE: New resolvers aren't using dataloaders
   Location: graph/schema.resolvers.go:82-89
   Severity: High
   Recommendation: Use ReviewStatsLoader to batch requests

0 other findings reviewed and dismissed.
```

**Narrate:**  
"Ultrareview caught that we're not using dataloaders. Let's fix that."

**Type in Claude:**
```
Fix the dataloader issue that ultrareview found.
```

**Expected behavior:**
- Refactors resolvers to use ReviewStatsLoader
- Commits fix
- Pushes to PR

---

## Step 5: Understanding the CI Check (3 minutes)

**Narrate:**  
"Let's look at how the codegen-check actually works."

**Type in Claude:**
```
Show me the CI workflow that runs the codegen-check. 
Explain how it works and why it's useful.
```

**Expected Claude behavior:**
- Reads `.github/workflows/test.yml`
- Shows the codegen-check step
- Explains the `git diff --exit-code` pattern

**Narrate as Claude shows workflow:**  
"This pattern should be in every gqlgen project. It catches the most common mistake before it reaches production."

---

## Post-Recording Notes

**Key points to emphasize in voiceover:**

1. **CI failures are teachable moments** - don't just fix them, understand them
2. **Generated code is part of your codebase** - always commit it with schema changes
3. **`/autofix-pr` changes workflows** - autonomous PR maintenance is now possible
4. **Deep review catches subtle issues** - `/ultrareview` found the dataloader problem

**Comparison table to show:**

| Command | Speed | Depth | Cost | When to Use |
|---------|-------|-------|------|-------------|
| `/review` | <1 min | Single-pass | Free | Every PR |
| `/ultrareview` | 5-10 min | Multi-agent | $5-$20 | Critical PRs |
| `/security-review` | <2 min | Security-focused | Free | Auth/data changes |

---

## Risks and Fallbacks

**If `/autofix-pr` doesn't work:**
- Fall back to manual commands: show typing `go run github.com/99designs/gqlgen generate`
- Narrate: "In a real environment with `gh` CLI configured, `/autofix-pr` would handle this"

**If `/ultrareview` times out:**
- Use pre-written mock output (provided above)
- Narrate: "This typically takes 5-10 minutes, so here's what it found"

**If `gh` CLI not installed:**
- Show pasting the log manually
- This is actually good to show as a fallback technique

---

## Recording Checklist

Before recording:
- [ ] **CRITICAL:** Verify Claude Code is using claude.ai auth (NOT Bedrock)
  - Check `~/.claude/config.json` or run `claude --version` to see auth method
  - `/ultrareview` will fail silently on Bedrock/Vertex/Foundry
- [ ] PR created and CI failing
- [ ] `gh` CLI authenticated (`gh auth status`)
- [ ] Screen recording software tested
- [ ] Terminal font size large enough
- [ ] Browser zoom appropriate for recording
- [ ] This script on second monitor
- [ ] Mock ultrareview output ready

During recording:
- [ ] Speak clearly and not too fast
- [ ] Pause after each Claude response to let audience read
- [ ] Show browser and terminal at key moments
- [ ] Point cursor at important parts of output

After recording:
- [ ] Add title cards for each step
- [ ] Add voiceover clarifications if needed
- [ ] Export in high resolution
- [ ] Test playback before presentation

---

## Alternative: Lower-Risk Version

If `/autofix-pr` is too unpredictable for recording, do this instead:

**Step 2 Alternative:**
```
Claude, the codegen-check is failing. Can you fix it?
```

Then show Claude running the commands manually instead of using `/autofix-pr`. Narrate: "Claude is running the same commands `/autofix-pr` would run autonomously."

This is more predictable and still teaches the concept.
