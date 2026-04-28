# Fallback Plan for Scenario B Demo

This document provides contingency content for each step of the DEMO-SCRIPT-B.md live demonstration. If Claude Code fails to produce the expected output at any step, use the corresponding fallback content below.

## When to Use Fallback Content

Use fallback content if:
- Claude has not responded within 45 seconds of a prompt
- Claude's response is clearly incorrect or hallucinated
- Claude misses a critical pattern (like dataloaders)
- Technical issues prevent Claude from working (network, auth, etc.)

## How to Use This Document

1. Keep this document open on a second monitor during the live demo
2. If a step fails, say: "Let me show you what Claude would typically produce here"
3. Pull up the corresponding fallback file and display it on screen
4. Continue with the next step of the demo

---

## Step 1: Understanding the Request (0:00-2:00)

### If Claude Cannot Find Files

**What to say:** "It looks like Claude is having trouble locating the files. Let me show you what it would typically find."

**Show on screen:** `fallback/expected-output-step-1-plan.md`

**Recovery:** After showing the fallback, manually navigate to the files:
```bash
cat graph/schema.graphql
cat graph/schema.resolvers.go
ls internal/clients/reviewsclient/
```

### If Claude Doesn't Find ReviewsClient

**What to say:** "Claude hasn't proactively searched for the reviews integration yet. Let me prompt it more specifically."

**Follow-up prompt:**
```
Check internal/clients/ for any review-related code. We might already have a client.
```

**If still fails:** Show `internal/clients/reviewsclient/client.go` manually with `cat` command.

---

## Step 2: Schema Change and Codegen (2:00-5:00)

### If Claude Cannot Edit Schema

**What to say:** "Let me make the schema change manually to keep us moving."

**Show on screen:** `fallback/expected-output-step-2-schema-diff.md`

**Manual recovery:**
```bash
# Add these lines to graph/schema.graphql after line 14
nano graph/schema.graphql
# Add:
#   averageRating: Float
#   reviewCount: Int!
```

### If Codegen Command Fails

**What to say:** "The codegen command is encountering an issue. This is a stub repo, so some dependencies might be incomplete. In a real project, this command would regenerate the resolver interfaces."

**Show expected output:** Point to lines 93-102 of DEMO-SCRIPT-B.md (the expected behavior).

**Recovery:** Don't actually run codegen if it will fail. Say: "In a production environment, gqlgen would now generate stub methods for `Product.AverageRating` and `Product.ReviewCount` that we need to implement. Let's move to that step."

---

## Step 3: Implement Resolvers with Dataloader (5:00-10:00)

### If Claude Misses Dataloader Pattern (Most Likely Failure Point)

**What to say:** "I see Claude implemented a direct call to the ReviewsClient. That will cause N+1 queries when we resolve a products list. Let me guide it to use the dataloader pattern instead."

**Follow-up prompt:**
```
I noticed we're calling the ReviewsClient directly. Won't this cause N+1 queries 
if we resolve a list of products? Can you refactor to use the ReviewStatsLoader 
from internal/loaders instead?
```

**If follow-up doesn't work:** "Let me show you the correct implementation."

**Show on screen:** `fallback/expected-output-step-3-resolver.md`

**Manual recovery:** Copy the correct resolver code from the fallback file and paste it into the conversation, saying: "This is what the dataloader-based implementation should look like."

### If Claude Cannot Find Existing Dataloader

**What to say:** "Claude is having trouble locating the ReviewStatsLoader. Let me point it to the right file."

**Prompt:**
```
The ReviewStatsLoader is in internal/loaders/product.go. Please use that pattern.
```

**If still fails:** Show `internal/loaders/product.go` with `cat` and explain the pattern manually.

---

## Step 4: Write Tests (10:00-13:00)

### If Claude Cannot Write Tests

**What to say:** "Let me show you what test coverage would look like for these resolvers."

**Show on screen:** `fallback/expected-output-step-4-test.md`

**Recovery:** Explain the test structure verbally:
- "We'd use table-driven tests with three cases: happy path, nil rating case, and error case"
- "Tests would mock the dataloader to return controlled data"
- "This follows the pattern in the existing test file"

### If Tests Don't Compile

**What to say:** "There's a compilation error in the stub environment. In a real project, we'd fix the import or helper function. For this demo, let's verify the structure is correct."

**Show:** Point to the existing test file structure and say: "The new tests would follow this same pattern."

---

## Step 5: Verify and Commit (13:00-15:00)

### If Tests Fail to Run

**What to say:** "This stub repo doesn't have all dependencies wired up, so tests might not run successfully. In a production project, we'd see the tests pass here. Let me show you what the test output would look like."

**Show expected output:**
```
$ go test ./graph -v
=== RUN   TestProductResolver_AverageRating
=== RUN   TestProductResolver_AverageRating/returns_rating_when_stats_exist
=== RUN   TestProductResolver_AverageRating/returns_nil_when_no_reviews
=== RUN   TestProductResolver_AverageRating/returns_error_when_dataloader_fails
--- PASS: TestProductResolver_AverageRating (0.01s)
PASS
ok      demo-graphql-subgraph/graph     0.023s
```

### If Git Commit Fails

**What to say:** "The commit step is straightforward. Let me show you what Claude would commit."

**Show:**
```bash
git status
# Shows:
#   modified: graph/schema.graphql
#   modified: graph/schema.resolvers.go
#   modified: graph/schema.resolvers_test.go

git log --oneline -1
# Shows:
#   abc123 Add averageRating and reviewCount fields to Product type
```

**Manual recovery:** Create the commit manually if needed to demonstrate the workflow.

---

## General Fallback Strategy

### If Claude is Completely Unresponsive

**Immediate action:**
1. Say: "We're experiencing some technical difficulties with the Claude Code session."
2. Show the `fallback/expected-terminal-transcript.md` file
3. Walk through it line by line, explaining what Claude would have done

**Continue demo with:** Manual commands and pre-prepared fallback files.

### If Multiple Steps Fail

**Pivot strategy:**
1. Say: "Rather than troubleshooting live, let me show you a successful run from our practice sessions."
2. Show the fallback content for the remaining steps in sequence
3. Use the extra time for Q&A or deeper discussion of the dataloader pattern

### If Network/Auth Issues

**Say:** "This appears to be a connectivity issue. Let me show you the expected flow with our pre-recorded content."

**Show:** `fallback/expected-terminal-transcript.md` and walk through it as if it were happening live.

---

## Pre-Demo Checklist

Before going live, verify you have:

- [ ] This FALLBACK-PLAN.md open on second monitor
- [ ] All `fallback/expected-output-*.md` files reviewed and ready to display
- [ ] Screenshots of successful practice run (backup to fallback files)
- [ ] Manual commands practiced (schema edit, cat commands, git commands)
- [ ] Second terminal window open as fallback if Claude session fails

---

## Confidence Indicators

During the demo, use these indicators to decide when to pivot to fallback:

**Green (Continue with Claude):**
- Claude responds within 30 seconds
- File paths are cited correctly
- Code snippets match expected patterns
- No hallucinated functions or imports

**Yellow (Watch Closely, Be Ready to Intervene):**
- Claude takes 30-45 seconds to respond
- Finds files but misses some context
- Implements pattern but not optimally (e.g., direct client call instead of dataloader)
- Minor compilation warnings

**Red (Use Fallback Immediately):**
- No response after 45 seconds
- Cites files that don't exist
- Hallucinated functions or imports
- Completely wrong implementation approach
- Network or authentication errors

---

## Post-Demo Debrief

After the demo, note which fallbacks were used:
- Which step failed?
- What was the failure mode?
- Did the follow-up prompt fix it, or was full fallback needed?
- Should we update CLAUDE.md to prevent this in future demos?

This feedback improves future demo reliability.
