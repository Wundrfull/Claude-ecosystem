# Step 3 Expected Output: Resolver Implementation with Dataloader

This is the correct resolver implementation Claude should produce using the dataloader pattern.

---

## Resolver Implementation

**File: `graph/schema.resolvers.go`**

Replace the panic stubs with:

```go
// AverageRating is the resolver for the averageRating field.
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    // Use dataloader to batch review stats requests
    stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
    if err != nil {
        return nil, fmt.Errorf("failed to load review stats: %w", err)
    }
    
    return stats.AverageRating, nil
}

// ReviewCount is the resolver for the reviewCount field.
func (r *productResolver) ReviewCount(ctx context.Context, obj *model.Product) (int, error) {
    // Use the same dataloader - both fields come from the same data source
    stats, err := loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)
    if err != nil {
        return 0, fmt.Errorf("failed to load review stats: %w", err)
    }
    
    return stats.ReviewCount, nil
}

type productResolver struct{ *Resolver }

// Product returns ProductResolver implementation.
func (r *Resolver) Product() ProductResolver { return &productResolver{r} }
```

---

## Why This Implementation is Correct

### 1. Uses Dataloader Pattern

Both resolvers call `loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)`.

**What happens at runtime:**
- When GraphQL resolves `{ products { averageRating reviewCount } }`, it calls each field resolver for each product
- The dataloader collects all `Load(id)` calls that happen within a single tick
- After the tick, it batches all collected IDs into a single `GetBatchProductReviews` call
- Results are cached for the request lifetime

**Without dataloader (N+1 problem):**
- Query for 10 products: 1 query for products + 10 queries for review stats = 11 queries
- Query for 100 products: 1 + 100 = 101 queries

**With dataloader:**
- Query for 10 products: 1 query for products + 1 batched query for all review stats = 2 queries
- Query for 100 products: 1 + 1 = 2 queries

### 2. Proper Error Wrapping

Uses `fmt.Errorf("message: %w", err)` to wrap errors with context while preserving the original error for debugging.

### 3. Correct Return Types

- `AverageRating` returns `*float64` (nullable pointer) matching the schema definition `Float`
- `ReviewCount` returns `int` (non-null) matching the schema definition `Int!`

### 4. Extracts Data from Parent Object

Uses `obj.ID` to get the product ID from the parent Product object. The GraphQL execution engine provides this parent object to each field resolver.

---

## How Dataloader is Wired Up

The dataloader is attached to the request context in `server/server.go` middleware:

```go
// Middleware that attaches dataloaders to each request context
func dataloaderMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        loaders := loaders.NewLoaders(reviewsClient)
        ctx := context.WithValue(r.Context(), loadersKey, loaders)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

This ensures every GraphQL request has access to dataloaders via `loaders.LoaderFromContext(ctx)`.

---

## Alternative (Incorrect) Implementation to Avoid

**DO NOT DO THIS:**

```go
// WRONG: Direct client call causes N+1 queries
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    // Calls API once per product - disaster for lists!
    stats, err := r.ReviewsClient.GetProductReviews(ctx, obj.ID)
    if err != nil {
        return nil, err
    }
    return stats.AverageRating, nil
}
```

This implementation would cause N+1 queries and would NOT be caught until load testing or production.

---

## Next Steps

Now that resolvers are implemented correctly, we need to:
1. Write tests to verify the behavior
2. Test that errors are handled gracefully
3. Verify that the dataloader is being used (not direct client calls)
