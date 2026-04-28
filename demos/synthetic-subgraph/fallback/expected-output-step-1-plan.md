# Step 1 Expected Output: Understanding the Request

This is what Claude Code would typically produce when asked to analyze the codebase and find existing integrations.

---

## Claude's Response

I'll help you add those fields to the Product type. Let me first understand the current structure.

**Current Product Type**

From `graph/schema.graphql` (lines 10-15):

```graphql
type Product {
  id: ID!
  name: String!
  priceCents: Int!
  description: String
}
```

**Product Resolver Location**

The Product type resolvers are implemented in `graph/schema.resolvers.go`. This file contains:
- `Product` query resolver (line 33): fetches a single product by ID
- `Products` query resolver (line 52): fetches a list of products with optional limit
- `CreateProduct` mutation resolver (line 14): creates a new product

**Existing Reviews Integration**

Good news - we already have a reviews service integration. Found:

`internal/clients/reviewsclient/client.go`:
- `GetProductReviews(ctx, productID)` method (line 30): fetches review stats for a single product
- `GetBatchProductReviews(ctx, productIDs)` method (line 48): fetches review stats for multiple products in one request
- Returns `ReviewStats` struct with:
  - `AverageRating *float64` (nullable)
  - `ReviewCount int`
  - `LastReviewAt *string`

**Dataloader Support**

Also found that we have dataloader infrastructure in `internal/loaders/product.go`:
- `ReviewStatsLoader` (line 57): designed to batch product review stat requests
- `LoaderFromContext(ctx)` helper (line 87): extracts loaders from request context
- This will be important for avoiding N+1 queries when resolving the new fields on product lists

**Next Steps**

We should:
1. Update the schema to add `averageRating: Float` and `reviewCount: Int!` to the Product type
2. Run codegen to generate the resolver stub methods
3. Implement the resolvers using `ReviewStatsLoader` to batch requests
4. Write tests following the existing patterns in `graph/schema.resolvers_test.go`

Ready to proceed with the schema update?
