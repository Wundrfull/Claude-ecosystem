# Step 2 Expected Output: Schema Change and Codegen

This is the schema diff and codegen output Claude would produce.

---

## Schema Changes

**File: `graph/schema.graphql`**

```diff
type Product {
  id: ID!
  name: String!
  priceCents: Int!
  description: String
+  averageRating: Float
+  reviewCount: Int!
}
```

---

## Codegen Output

```
$ go run github.com/99designs/gqlgen generate

Generating code...
  graph/generated/generated.go
  graph/model/models_gen.go
  graph/schema.resolvers.go

New resolver methods need implementation:
  - Product.AverageRating in graph/schema.resolvers.go
  - Product.ReviewCount in graph/schema.resolvers.go

Code generation complete.
```

---

## What Was Generated

**1. Updated Type Definition** (`graph/model/models_gen.go`)

```go
type Product struct {
    ID            string   `json:"id"`
    Name          string   `json:"name"`
    PriceCents    int      `json:"priceCents"`
    Description   *string  `json:"description,omitempty"`
    AverageRating *float64 `json:"averageRating,omitempty"`
    ReviewCount   int      `json:"reviewCount"`
}
```

**2. New Resolver Interface Methods** (`graph/generated/generated.go`)

```go
type ProductResolver interface {
    AverageRating(ctx context.Context, obj *model.Product) (*float64, error)
    ReviewCount(ctx context.Context, obj *model.Product) (int, error)
}
```

**3. Stub Implementations Required** (`graph/schema.resolvers.go`)

gqlgen added these stub methods at the end of the file:

```go
func (r *productResolver) AverageRating(ctx context.Context, obj *model.Product) (*float64, error) {
    panic(fmt.Errorf("not implemented: AverageRating - averageRating"))
}

func (r *productResolver) ReviewCount(ctx context.Context, obj *model.Product) (int, error) {
    panic(fmt.Errorf("not implemented: ReviewCount - reviewCount"))
}

type productResolver struct{ *Resolver }

// Product returns ProductResolver implementation.
func (r *Resolver) Product() ProductResolver { return &productResolver{r} }
```

---

## What This Means

- The schema now declares the two new fields
- The Go type definition includes them with correct nullability (`*float64` for nullable Float, `int` for non-null Int)
- Interface methods are generated and must be implemented
- **If we tried to query these fields right now, we'd get a panic:** "not implemented"

Next step: Replace the panic implementations with real resolver logic using dataloaders.
