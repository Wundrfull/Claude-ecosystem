# Demo Script: Scenario B - Consumer-Driven Field Addition

**Duration:** 15 minutes including Q&A  
**Difficulty:** Medium  
**Setup Time:** 5 minutes

## Context

A consumer team (frontend web app) requests two new fields on the existing Product type:
- `averageRating` (Float, nullable)
- `reviewCount` (Int, non-null)

They need these fields to display product cards with star ratings. The data exists in a backing service (Reviews API) but isn't exposed in the GraphQL schema yet.

## Learning Goals

- Navigate unfamiliar resolver code with Claude Code
- Trace data flow from schema to backing service
- Understand and apply dataloader patterns
- Practice test-driven development for new fields

---

## Pre-Flight Checklist (Do This 30 Minutes Before Live Demo)

**Environment verification:**
- [ ] Terminal in `demos/synthetic-subgraph/` directory
- [ ] `git status` shows clean working tree
- [ ] Claude Code CLI installed and authenticated
- [ ] Run `claude /context` to verify clean context (should be mostly empty)
- [ ] CLAUDE.md is present and readable
- [ ] `graph/schema.graphql` exists and shows current Product type

**Fallback preparation:**
- [ ] `fallback/FALLBACK-PLAN.md` open on second monitor
- [ ] All `fallback/expected-output-*.md` files reviewed
- [ ] `fallback/expected-terminal-transcript.md` ready to display if complete failure
- [ ] Screenshots from practice run available as backup

**Browser setup:**
- [ ] Slack message or ticket from consumer team (mock if needed)
- [ ] This script in a separate window for reference
- [ ] Second terminal window open as emergency backup

**Test the session start:**
```bash
cd /Users/demo/demos/synthetic-subgraph
git status
claude
# Type: /context
# Verify CLAUDE.md loads
# Type: /exit
```

**Audience primer (say this before starting):**
"We just got a request from the web team. They need review data on our Product type. Let's walk through the full workflow: understanding the request, updating the schema, implementing resolvers, and writing tests. I'll be using Claude Code to help navigate the codebase."

---

## Pre-Demo Setup (Do This Before Live Demo)

1. **Terminal setup:**
   ```bash
   cd /path/to/demos/synthetic-subgraph
   git status  # Ensure clean working tree
   claude      # Start Claude Code session
   ```

2. **Verify context is clean:**
   ```
   /context
   ```
   Should show CLAUDE.md loaded, schema file visible, minimal token usage.

3. **Browser tabs to have open:**
   - Slack message or ticket from consumer team (mock if needed)
   - This script in a separate window for reference
   - `fallback/FALLBACK-PLAN.md` ready for quick reference

4. **Fallback content ready:**
   - If Claude hasn't proposed a plan within 45 seconds, pull up `fallback/expected-output-step-1-plan.md`
   - If resolver implementation misses dataloaders, show `fallback/expected-output-step-3-resolver.md`
   - If complete failure, use `fallback/expected-terminal-transcript.md`

---

## Step 1: Understanding the Request (2 minutes)

**Say to audience:**  
"First, let's understand what we're working with. I'll ask Claude to find the Product type and see if we already have any reviews integration."

**Type in Claude:**
```
I need to add two new fields to the Product type: averageRating (Float) and reviewCount (Int). 

Can you:
1. Show me the current Product type definition in our schema
2. Find where the Product resolver is implemented
3. Check if we already have any integration with a reviews service
```

**Expected Claude behavior:**
- Reads `graph/schema.graphql`
- Shows current Product type (id, name, priceCents, description)
- Finds `graph/schema.resolvers.go`
- Searches for "review" and finds `internal/clients/reviewsclient/client.go`
- Reports back with file paths and relevant code snippets

**What to watch for:**
- ✅ Claude finds schema location
- ✅ Claude finds resolver file
- ✅ Claude discovers ReviewsClient
- ⚠️ If Claude doesn't find ReviewsClient, prompt: "Check internal/clients for any review-related code"
- 🚨 If Claude hasn't responded within 45 seconds, show `fallback/expected-output-step-1-plan.md`

**Point out to audience:**  
"Notice Claude didn't just answer the question - it proactively explored to find existing integrations. This is the discovery phase."

---

## Step 2: Schema Change and Codegen (3 minutes)

**Say to audience:**  
"Now let's update the schema. The averageRating should be nullable since products might not have reviews yet."

**Type in Claude:**
```
Add the two fields to the Product type in the schema:
- averageRating: Float (nullable)
- reviewCount: Int!

Then regenerate the gqlgen code.
```

**Expected Claude behavior:**
- Edits `graph/schema.graphql` to add:
  ```graphql
  averageRating: Float
  reviewCount: Int!
  ```
- Runs `go run github.com/99designs/gqlgen generate`
- Reports success and lists new resolver methods that need implementation

**What to watch for:**
- ✅ Schema syntax is correct (nullable vs non-null)
- ✅ Codegen runs without errors
- ✅ Claude mentions new resolver methods need implementation
- ⚠️ If codegen fails, check Go installation: `go version`
- 🚨 If schema edit or codegen fails, show `fallback/expected-output-step-2-schema-diff.md`

**Point out to audience:**  
"gqlgen just generated interface methods for these fields. If we tried to query them now, we'd get a panic saying 'not implemented'. Let's fix that."

---

## Step 3: Implement Resolvers with Dataloader (5 minutes)

**Say to audience:**  
"This is the critical part. We need to implement these resolvers, but if we call the ReviewsClient directly for each product, we'll have N+1 query problems. Let's use dataloaders."

**Type in Claude:**
```
Implement the Product.AverageRating and Product.ReviewCount resolver methods.

Use the ReviewsClient we found earlier, but make sure to use dataloaders 
to batch requests - we might be resolving these fields for a list of products.

Follow our existing dataloader patterns in internal/loaders.
```

**Expected Claude behavior:**
- Reads `internal/loaders/product.go` to understand dataloader patterns
- Implements resolvers in `graph/schema.resolvers.go`:
  ```go
  func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
      stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
      if err != nil {
          return nil, fmt.Errorf("failed to load review stats: %w", err)
      }
      return stats.AverageRating, nil
  }
  
  func (r *productResolver) ReviewCount(ctx context.Context, obj *model.Product) (int, error) {
      stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
      if err != nil {
          return 0, fmt.Errorf("failed to load review stats: %w", err)
      }
      return stats.ReviewCount, nil
  }
  ```
- Adds `type productResolver struct{ *Resolver }` if not present

**What to watch for:**
- ✅ Uses `loaders.LoaderFromContext(ctx)` pattern (note: "loaders" not "loader")
- ✅ Calls `ReviewStatsLoader.Load(obj.ID)`
- ✅ Proper error wrapping with `fmt.Errorf` and `%w`
- ⚠️ If Claude calls ReviewsClient directly, use fallback below
- 🚨 **This is the most likely failure point** - be ready with fallback

**Fallback if needed (say this):**  
"I see you called the ReviewsClient directly. That will cause N+1 queries when we resolve a list. Can you refactor to use the ReviewStatsLoader from our loaders package instead?"

**Alternative fallback prompt:**
```
I noticed the implementation calls ReviewsClient in a loop. 
This will cause N+1 queries for the products query.
Can you use the ReviewStatsLoader from internal/loaders instead?
```

**If follow-up prompt doesn't work:**
Show `fallback/expected-output-step-3-resolver.md` and say: "Here's the correct dataloader-based implementation. This is what we'd expect to see."

**Point out to audience:**  
"See how Claude extracted the product ID from the parent object and used the dataloader? That's the key pattern. All Load() calls in one request get batched into a single API call."

---

## Step 4: Write Tests (3 minutes)

**Say to audience:**  
"Our team doesn't merge without tests. Let's add coverage for these new resolvers."

**Type in Claude:**
```
Write tests for the new Product.AverageRating and Product.ReviewCount resolvers.

Use table-driven tests and follow the existing test patterns in schema.resolvers_test.go.
Test happy path, nil rating case, and error case.
```

**Expected Claude behavior:**
- Reads existing test file to understand patterns
- Adds new test functions to `graph/schema.resolvers_test.go`:
  ```go
  func TestProductResolver_AverageRating(t *testing.T) {
      tests := []struct {
          name          string
          productID     string
          wantRating    *float64
          wantErr       bool
      }{
          // test cases
      }
      // implementation
  }
  ```

**What to watch for:**
- ✅ Table-driven test structure
- ✅ Tests cover: happy path, nil case, error case
- ✅ Uses helper like `intPtr()` or `floatPtr()` for pointers
- ⚠️ If tests don't compile, Claude should fix on next iteration
- 🚨 If tests fail to generate, show `fallback/expected-output-step-4-test.md`

**Point out to audience:**  
"Claude matched our existing test style. This consistency happens because Claude read the existing test file first."

---

## Step 5: Verify and Commit (2 minutes)

**Say to audience:**  
"Let's verify everything works and commit the changes."

**Type in Claude:**
```
Run the tests to make sure everything passes, then create a git commit 
with a clear message explaining what was added.
```

**Expected Claude behavior:**
- Runs `go test ./...` or `go test ./graph -v`
- Shows test results (may have some failures in stub repo, that's OK for demo)
- Stages files: `git add graph/schema.graphql graph/schema.resolvers.go graph/schema.resolvers_test.go`
- Creates commit:
  ```
  Add averageRating and reviewCount fields to Product type
  
  Consumer team requested these fields for product card displays.
  Implemented using ReviewStatsLoader to batch and cache review data,
  avoiding N+1 query problems.
  
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

**What to watch for:**
- ✅ Tests run (pass or fail is OK for this demo)
- ✅ Commit includes schema, resolvers, and tests
- ✅ Commit message explains the "why"
- ⚠️ Pre-commit hooks might fail in stub repo - acknowledge and move on

**Point out to audience:**  
"That's the complete workflow: discover, update schema, codegen, implement, test, commit. Claude guided us through each step with minimal prompting."

---

## Post-Demo Discussion (Q&A)

**Key takeaways to emphasize:**

1. **Exploratory prompts work:** "Show me X and find Y" lets Claude build context before making changes

2. **CLAUDE.md is critical:** The dataloader pattern only worked because it's documented in CLAUDE.md

3. **Let Claude read existing code:** It learns your patterns by example

4. **Iterate when needed:** If Claude misses something (like using dataloaders), just ask again with more specificity

**Common audience questions:**

**Q: "What if our dataloader setup is more complex?"**  
A: Document the exact pattern in CLAUDE.md with a code example. Claude follows documented patterns very reliably.

**Q: "Will Claude know about our custom error types?"**  
A: If they're used consistently in existing code, yes. Otherwise, add an example to CLAUDE.md.

**Q: "Can Claude handle federation-specific changes like @requires?"**  
A: Yes, but be explicit in your prompt about federation semantics. Example: "Add this field with @requires(fields: \"id\")"

**Q: "What if tests fail?"**  
A: In this demo repo they might due to stub implementations. In a real project, Claude can debug test failures. Just show the error and ask "Why did this test fail?"

---

## Risk Assessment

**Low risk (should work reliably):**
- Finding schema and resolver files
- Editing schema with correct syntax
- Running codegen command
- Creating git commit

**Medium risk (might need iteration):**
- Recognizing dataloader pattern (depends on CLAUDE.md clarity)
- Writing tests that compile on first try

**High risk (have fallback ready):**
- Tests actually passing in stub environment
- Pre-commit hooks in CI environment

**Recommended fallback strategy:**
If anything goes significantly wrong, have these ready:
1. Pre-written resolver code to paste
2. Command history to show "here's what we'd run"
3. Screenshot of successful run from practice session

---

## Time Management

If running short on time, skip or abbreviate:
- ❌ Skip: Detailed test discussion - just show Claude writing them
- ❌ Skip: Running tests if they're slow
- ✅ Keep: Schema change and codegen (this is the key learning)
- ✅ Keep: Dataloader implementation (this is what makes it realistic)

If running long on time, expand:
- Show the generated code diff: `git show`
- Explore the ReviewsClient code
- Discuss how dataloaders are wired up in server middleware

---

## Props and Materials Needed

- Clean git working tree
- Claude Code CLI installed and working
- Go 1.22+ installed
- This script printed or on second monitor
- Fallback code snippets ready to paste
- Mock Slack message from "consumer team" to show audience

---

## Success Criteria

Demo is successful if audience sees:
1. ✅ Claude navigating codebase without being told exact file locations
2. ✅ Schema updated with correct GraphQL syntax
3. ✅ Codegen running and reporting new methods needed
4. ✅ Resolver implementation using dataloader pattern
5. ✅ Git commit created with good message

Demo is acceptable if:
- Requires one or two follow-up prompts to get dataloader pattern right
- Tests don't fully pass but are written correctly
- Some manual command running is needed

Demo needs recovery if:
- Claude can't find files (suggest checking CLAUDE.md)
- Codegen fails with syntax errors (manually fix and continue)
- Need to paste fallback code (do it, explain why, move on)

Remember: This is a teaching demo, not a magic show. If something goes wrong, it's an opportunity to show how to iterate with Claude.
