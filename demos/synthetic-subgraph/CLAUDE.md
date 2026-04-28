# GraphQL Subgraph Development Guide

This document provides essential information for working on this gqlgen-based GraphQL subgraph with Claude Code or as a new team member.

## GraphQL Schema

- **Location:** `graph/schema.graphql`
- **Regenerate code:** `go run github.com/99designs/gqlgen generate`
- **CRITICAL:** Never manually edit files in `graph/generated/` - they are overwritten on every codegen run
- **CI check:** We run codegen in CI and fail if git working tree is dirty afterward. Always commit schema changes and generated code together.

## Resolver Implementation Patterns

- **Location:** `graph/schema.resolvers.go`
- **Pattern:** Each resolver calls a service layer function from `internal/services/` or fetches directly from backing services
- **Error handling:** Wrap all errors with context using `fmt.Errorf("action description: %w", err)`
- **Null handling:** For nullable GraphQL fields (no `!`), return pointer types. Return `nil` for missing data, not an error.
- **Context timeout:** Always respect context deadlines. Use `ctx.Done()` checks for long operations.

## Dataloader Conventions

- **Purpose:** Batch and cache database/API queries to avoid N+1 problems when resolving lists
- **Location:** `internal/loaders/`
- **Usage pattern:** `loaders.LoaderFromContext(ctx).ProductLoader.Load(productID)`
- **When to use:** ALWAYS use dataloaders when resolving fields on types that appear in lists
- **Context setup:** Dataloaders are attached to request context via middleware in `server/server.go`

### CRITICAL: Always Use Dataloaders for List Resolution

If you are adding a field to a type that can be returned in a list (like `Product` in `products: [Product!]!`), you MUST use a dataloader to fetch that field's data. Never call a client or service directly from the field resolver.

**Example - CORRECT pattern:**

```go
// Adding averageRating field to Product type
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    // CORRECT: Use dataloader to batch requests
    stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
    if err != nil {
        return nil, fmt.Errorf("failed to load review stats: %w", err)
    }
    return stats.AverageRating, nil
}
```

**Example - WRONG pattern (causes N+1 queries):**

```go
// DO NOT DO THIS
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    // WRONG: Direct client call in a loop when resolving products list
    stats, err := r.ReviewsClient.GetProductReviews(ctx, obj.ID)
    if err != nil {
        return nil, err
    }
    return stats.AverageRating, nil
}
```

**Why dataloaders matter:**
- When GraphQL resolves `{ products { id name averageRating } }`, it calls the field resolver once per product
- Without dataloader: 1 query for products + N queries for review stats = N+1 problem
- With dataloader: 1 query for products + 1 batched query for all review stats = 2 queries total

**Available dataloaders in this subgraph:**
- `ProductLoader` - batch product lookups by ID
- `ReviewStatsLoader` - batch review statistics by product ID

**If you need a new dataloader:** Check if a batch endpoint exists in the backing service client (like `GetBatchProductReviews`), then model the new loader after existing ones in `internal/loaders/`.

## Error Handling

- **User-facing errors:** Return simple error with `fmt.Errorf("user-friendly message")`
- **Internal errors:** Log with structured logging, return generic message to client
- **Validation errors:** Return descriptive errors for input validation failures
- **Partial errors:** Resolvers can return both data and error - GraphQL will include error in `errors` array
- **Not found vs error:** Return `(nil, nil)` for missing optional data, not an error

## Testing Conventions

- **Resolver tests:** `graph/schema.resolvers_test.go` - use table-driven tests
- **Mock dependencies:** Use test stubs for service layer and dataloaders
- **Test pattern:** Each resolver test should cover: happy path, missing data (nil case), error case
- **Run tests:** `go test ./...`
- **Test coverage:** Aim for high coverage on resolver logic, but generated code doesn't need tests

## CI Pipeline

- **Workflow file:** `.github/workflows/test.yml`
- **Checks:**
  - `test` - runs `go test ./...`
  - `lint` - runs `golangci-lint run` (stubbed in demo)
  - `codegen-check` - runs `gqlgen generate` and fails if working tree is dirty
- **Failed codegen-check:** Usually means schema was updated but generated code wasn't committed
- **Fix:** Run `go run github.com/99designs/gqlgen generate` locally, commit the generated files, and push

## Data Sources

- **Reviews API:** REST client at `internal/clients/reviewsclient/` for product review data
- **Product data:** Currently stubbed with in-memory data (demo purposes)
- **Future:** Will integrate with actual product service and database

## Development Workflow

1. **Edit schema:** Update `graph/schema.graphql` with new types or fields
2. **Run codegen:** `go run github.com/99designs/gqlgen generate`
3. **Check errors:** gqlgen will error if required resolver methods are missing
4. **Implement resolvers:** Add logic in `graph/schema.resolvers.go`
5. **Use dataloaders:** If field is on a type that appears in lists, use a dataloader
6. **Write tests:** Add table-driven tests in `graph/schema.resolvers_test.go`
7. **Run tests:** `go test ./...`
8. **Commit together:** Always commit schema changes and generated code in the same commit

## Common Mistakes to Avoid

1. **Editing generated files:** Never edit `graph/generated/generated.go` or `graph/model/models_gen.go` - they get overwritten
2. **Forgetting codegen:** Schema changes without running codegen will fail CI
3. **Committing schema without generated code:** CI will fail with codegen-drift error
4. **Skipping dataloaders:** Causes N+1 queries in production when resolving list fields
5. **Not testing nil cases:** Many GraphQL fields are nullable - test the nil return path

## Architecture Notes

- **Why gqlgen?** Code-first approach with strong Go typing and interface generation
- **Why dataloaders?** Required to avoid N+1 queries when resolving fields on list items
- **Why service layer?** Keeps resolvers thin and business logic testable
- **Schema as source of truth:** The GraphQL schema defines our API contract - generated code enforces it

## Quick Reference Commands

```bash
# Regenerate GraphQL code
go run github.com/99designs/gqlgen generate

# Run all tests
go test ./...

# Run specific test
go test ./graph -v -run TestProductResolver

# Check what would be generated (dry run)
go run github.com/99designs/gqlgen generate --verbose

# Lint code (if configured)
golangci-lint run
```

## Getting Help

When adding a new field:
1. Check existing resolvers for similar patterns
2. Look for similar types that use dataloaders
3. Check if a backing service client already exists in `internal/clients/`
4. Follow the naming convention: field `productStats` uses `ProductStatsLoader`

When CI fails:
1. Read the full error message - it usually tells you exactly what to do
2. For codegen-check failures: run codegen locally and commit the changes
3. For test failures: check if you need to update test fixtures

## Demo Note

This is a teaching-focused synthetic repo for a Claude Code demo. Some files are stubs. In a real project, dataloaders would be fully wired, service layer would have complete implementations, and we'd have integration tests hitting a test database.
