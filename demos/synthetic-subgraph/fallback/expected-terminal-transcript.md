# Expected Terminal Transcript: Scenario B Complete Walkthrough

This is a realistic transcript of a successful Claude Code session for Scenario B. Use this if live demo fails completely.

---

## Session Start

```
$ cd /Users/demo/synthetic-subgraph
$ claude

Welcome to Claude Code
Connected to Anthropic API
Model: claude-sonnet-4.5 (April 2026)

Type your message or /help for commands.

>
```

---

## Step 1: Understanding the Request (0:00-2:00)

```
> I need to add two new fields to the Product type: averageRating (Float) and reviewCount (Int).
>
> Can you:
> 1. Show me the current Product type definition in our schema
> 2. Find where the Product resolver is implemented
> 3. Check if we already have any integration with a reviews service

◆ Reading files...
  - graph/schema.graphql
  - graph/schema.resolvers.go
  - Searching for "review" across codebase...

I'll help you add those fields. Let me analyze the current structure.

**Current Product Type**

From graph/schema.graphql (lines 10-15):

type Product {
  id: ID!
  name: String!
  priceCents: Int!
  description: String
}

**Product Resolver Location**

Found resolvers in graph/schema.resolvers.go:
- Product query (line 33)
- Products query (line 52)
- CreateProduct mutation (line 14)

**Existing Reviews Integration**

Great news - found a reviews service integration:

internal/clients/reviewsclient/client.go:
- GetProductReviews(ctx, productID) - fetches stats for one product
- GetBatchProductReviews(ctx, productIDs) - batches multiple products
- Returns ReviewStats with AverageRating and ReviewCount

**Dataloader Infrastructure**

Also found internal/loaders/product.go with ReviewStatsLoader already set up
for batching review requests. This will help us avoid N+1 queries.

Ready to update the schema?

>
```

---

## Step 2: Schema Change and Codegen (2:00-5:00)

```
> Add the two fields to the Product type in the schema:
> - averageRating: Float (nullable)
> - reviewCount: Int!
>
> Then regenerate the gqlgen code.

◆ Editing graph/schema.graphql...

Added fields to Product type:
  averageRating: Float
  reviewCount: Int!

◆ Running codegen...
  $ go run github.com/99designs/gqlgen generate

Code generation complete.

New resolver methods need implementation:
- Product.AverageRating in graph/schema.resolvers.go
- Product.ReviewCount in graph/schema.resolvers.go

gqlgen generated stub methods that currently panic. We need to implement them
next using the ReviewStatsLoader to batch requests.

>
```

---

## Step 3: Implement Resolvers with Dataloader (5:00-8:00)

```
> Implement the Product.AverageRating and Product.ReviewCount resolver methods.
>
> Use the ReviewsClient we found earlier, but make sure to use dataloaders
> to batch requests - we might be resolving these fields for a list of products.
>
> Follow our existing dataloader patterns in internal/loaders.

◆ Reading internal/loaders/product.go to understand patterns...
◆ Editing graph/schema.resolvers.go...

Implemented resolvers using dataloader pattern:

// AverageRating resolver
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
    if err != nil {
        return nil, fmt.Errorf("failed to load review stats: %w", err)
    }
    return stats.AverageRating, nil
}

// ReviewCount resolver
func (r *productResolver) ReviewCount(ctx context.Context, obj *model.Product) (int, error) {
    stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
    if err != nil {
        return 0, fmt.Errorf("failed to load review stats: %w", err)
    }
    return stats.ReviewCount, nil
}

Both resolvers use the ReviewStatsLoader to batch requests. When resolving
these fields for a product list, all Load() calls get batched into a single
GetBatchProductReviews API call.

>
```

---

## Step 4: Write Tests (8:00-11:00)

```
> Write tests for the new Product.AverageRating and Product.ReviewCount resolvers.
>
> Use table-driven tests and follow the existing test patterns in schema.resolvers_test.go.
> Test happy path, nil rating case, and error case.

◆ Reading graph/schema.resolvers_test.go to understand test patterns...
◆ Editing graph/schema.resolvers_test.go...

Added tests:

TestProductResolver_AverageRating:
- returns rating when stats exist (4.5)
- returns nil when no reviews exist
- returns error when dataloader fails

TestProductResolver_ReviewCount:
- returns count when stats exist (42)
- returns zero when no reviews exist
- returns error when dataloader fails

Also added:
- mockReviewStatsLoader for test isolation
- floatPtr helper function
- floatPtrEqual comparison helper

Tests follow the existing table-driven pattern and mock the dataloader
to avoid network calls.

>
```

---

## Step 5: Verify and Commit (11:00-13:00)

```
> Run the tests to make sure everything works, then create a git commit
> with a message explaining what was added.

◆ Running tests...
  $ go test ./graph -v

=== RUN   TestProductResolver_AverageRating
=== RUN   TestProductResolver_AverageRating/returns_rating_when_stats_exist
=== RUN   TestProductResolver_AverageRating/returns_nil_when_no_reviews_exist
=== RUN   TestProductResolver_AverageRating/returns_error_when_dataloader_fails
--- PASS: TestProductResolver_AverageRating (0.00s)

=== RUN   TestProductResolver_ReviewCount
=== RUN   TestProductResolver_ReviewCount/returns_count_when_stats_exist
=== RUN   TestProductResolver_ReviewCount/returns_zero_when_no_reviews_exist
=== RUN   TestProductResolver_ReviewCount/returns_error_when_dataloader_fails
--- PASS: TestProductResolver_ReviewCount (0.00s)

PASS
ok      demo-graphql-subgraph/graph     0.015s

All tests passed.

◆ Creating commit...
  $ git add graph/schema.graphql graph/schema.resolvers.go graph/schema.resolvers_test.go graph/generated/
  $ git commit -m "..."

[feature/add-review-fields abc1234] Add averageRating and reviewCount fields to Product type

Consumer team requested these fields for product card displays.
Implemented using ReviewStatsLoader to batch and cache review data,
avoiding N+1 query problems when resolving product lists.

Tests cover happy path, nil ratings, and error cases.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

 4 files changed, 127 insertions(+), 2 deletions(-)

Commit created successfully.

>
```

---

## Timing Summary

| Step | Time | Status |
|------|------|--------|
| Understanding request | 0:00-2:00 | ✓ Found schema, resolvers, client, dataloaders |
| Schema change + codegen | 2:00-5:00 | ✓ Added fields, ran codegen successfully |
| Implement resolvers | 5:00-8:00 | ✓ Used dataloader pattern correctly |
| Write tests | 8:00-11:00 | ✓ Table-driven tests with 3 cases each |
| Verify and commit | 11:00-13:00 | ✓ Tests passed, commit created |

**Total time:** 13 minutes
**Prompts used:** 5
**Files modified:** 4 (schema, resolvers, tests, generated)
**Tests added:** 6 test cases
**Dataloader pattern:** Used correctly on first try

---

## Key Observations

**What went well:**
- Claude found all relevant files proactively
- Recognized the need for dataloaders without being told explicitly
- Followed existing code patterns (error wrapping, test structure)
- Generated realistic test data

**Why it worked:**
- CLAUDE.md documented the dataloader pattern with examples
- Existing code showed consistent patterns
- Explicit prompt about "batching requests" and "list of products"
- Clear workflow: read before writing

**Critical success factors:**
1. CLAUDE.md contained explicit dataloader guidance
2. Prompt mentioned "list of products" triggering N+1 awareness
3. Existing loaders file was discoverable via grep
4. Test patterns were consistent in existing test file

---

## Use This Transcript When

- Live demo has complete technical failure
- Network issues prevent Claude from responding
- Time pressure requires skipping live interaction
- Backup plan for recorded presentation segments

Walk through this transcript line-by-line as if watching Claude work in real-time.
