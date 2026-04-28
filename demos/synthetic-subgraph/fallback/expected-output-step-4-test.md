# Step 4 Expected Output: Test Implementation

This is the test code Claude should produce following the existing table-driven test patterns.

---

## Test Implementation

**File: `graph/schema.resolvers_test.go`**

Add these tests to the file:

```go
// TestProductResolver_AverageRating tests the averageRating field resolver
func TestProductResolver_AverageRating(t *testing.T) {
    tests := []struct {
        name          string
        productID     string
        mockStats     *loaders.ReviewStats
        mockErr       error
        wantRating    *float64
        wantErr       bool
    }{
        {
            name:      "returns rating when stats exist",
            productID: "prod-123",
            mockStats: &loaders.ReviewStats{
                ProductID:     "prod-123",
                AverageRating: floatPtr(4.5),
                ReviewCount:   42,
            },
            wantRating: floatPtr(4.5),
            wantErr:    false,
        },
        {
            name:      "returns nil when no reviews exist",
            productID: "prod-456",
            mockStats: &loaders.ReviewStats{
                ProductID:     "prod-456",
                AverageRating: nil, // No reviews yet
                ReviewCount:   0,
            },
            wantRating: nil,
            wantErr:    false,
        },
        {
            name:      "returns error when dataloader fails",
            productID: "prod-error",
            mockErr:   errors.New("service unavailable"),
            wantErr:   true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Create mock dataloader
            mockLoader := &mockReviewStatsLoader{
                stats: tt.mockStats,
                err:   tt.mockErr,
            }

            // Create context with mock loader
            ctx := context.WithValue(context.Background(), loadersKey, &loaders.Loaders{
                ReviewStatsLoader: mockLoader,
            })

            // Create resolver
            r := &productResolver{&Resolver{}}

            // Create product object
            product := &model.Product{
                ID:   tt.productID,
                Name: "Test Product",
            }

            // Call resolver
            got, err := r.AverageRating(ctx, product)

            // Check error
            if (err != nil) != tt.wantErr {
                t.Errorf("AverageRating() error = %v, wantErr %v", err, tt.wantErr)
                return
            }

            // Check result
            if !floatPtrEqual(got, tt.wantRating) {
                t.Errorf("AverageRating() = %v, want %v", got, tt.wantRating)
            }
        })
    }
}

// TestProductResolver_ReviewCount tests the reviewCount field resolver
func TestProductResolver_ReviewCount(t *testing.T) {
    tests := []struct {
        name       string
        productID  string
        mockStats  *loaders.ReviewStats
        mockErr    error
        wantCount  int
        wantErr    bool
    }{
        {
            name:      "returns count when stats exist",
            productID: "prod-123",
            mockStats: &loaders.ReviewStats{
                ProductID:     "prod-123",
                AverageRating: floatPtr(4.5),
                ReviewCount:   42,
            },
            wantCount: 42,
            wantErr:   false,
        },
        {
            name:      "returns zero when no reviews exist",
            productID: "prod-456",
            mockStats: &loaders.ReviewStats{
                ProductID:     "prod-456",
                AverageRating: nil,
                ReviewCount:   0,
            },
            wantCount: 0,
            wantErr:   false,
        },
        {
            name:      "returns error when dataloader fails",
            productID: "prod-error",
            mockErr:   errors.New("service unavailable"),
            wantErr:   true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Create mock dataloader
            mockLoader := &mockReviewStatsLoader{
                stats: tt.mockStats,
                err:   tt.mockErr,
            }

            // Create context with mock loader
            ctx := context.WithValue(context.Background(), loadersKey, &loaders.Loaders{
                ReviewStatsLoader: mockLoader,
            })

            // Create resolver
            r := &productResolver{&Resolver{}}

            // Create product object
            product := &model.Product{
                ID:   tt.productID,
                Name: "Test Product",
            }

            // Call resolver
            got, err := r.ReviewCount(ctx, product)

            // Check error
            if (err != nil) != tt.wantErr {
                t.Errorf("ReviewCount() error = %v, wantErr %v", err, tt.wantErr)
                return
            }

            // Check result
            if !tt.wantErr && got != tt.wantCount {
                t.Errorf("ReviewCount() = %v, want %v", got, tt.wantCount)
            }
        })
    }
}

// Mock implementation of ReviewStatsLoader for testing
type mockReviewStatsLoader struct {
    stats *loaders.ReviewStats
    err   error
}

func (m *mockReviewStatsLoader) Load(productID string) (*loaders.ReviewStats, error) {
    if m.err != nil {
        return nil, m.err
    }
    return m.stats, nil
}

// Helper function for pointer to float64
func floatPtr(f float64) *float64 {
    return &f
}

// Helper function to compare float pointers
func floatPtrEqual(a, b *float64) bool {
    if a == nil && b == nil {
        return true
    }
    if a == nil || b == nil {
        return false
    }
    return *a == *b
}
```

---

## Test Structure Explanation

### Table-Driven Tests

Each test function uses the table-driven pattern:
1. Define test cases as a slice of structs
2. Each test case has: name, inputs, mocks, expected outputs, error flag
3. Loop through cases with `t.Run(tt.name, ...)`
4. Assert results

This matches the existing test style in `schema.resolvers_test.go`.

### Test Coverage

**Happy path:**
- Product with reviews (rating 4.5, count 42)

**Edge cases:**
- Product with no reviews (nil rating, zero count)
- Dataloader failure (service unavailable error)

### Mocking Strategy

Tests mock the dataloader, not the HTTP client. This:
- Tests the resolver logic in isolation
- Avoids network calls in tests
- Makes tests fast and deterministic

The `mockReviewStatsLoader` implements just the `Load` method needed by the resolvers.

---

## Running the Tests

```bash
$ go test ./graph -v

=== RUN   TestProductResolver_AverageRating
=== RUN   TestProductResolver_AverageRating/returns_rating_when_stats_exist
=== RUN   TestProductResolver_AverageRating/returns_nil_when_no_reviews_exist
=== RUN   TestProductResolver_AverageRating/returns_error_when_dataloader_fails
--- PASS: TestProductResolver_AverageRating (0.00s)
    --- PASS: TestProductResolver_AverageRating/returns_rating_when_stats_exist (0.00s)
    --- PASS: TestProductResolver_AverageRating/returns_nil_when_no_reviews_exist (0.00s)
    --- PASS: TestProductResolver_AverageRating/returns_error_when_dataloader_fails (0.00s)

=== RUN   TestProductResolver_ReviewCount
=== RUN   TestProductResolver_ReviewCount/returns_count_when_stats_exist
=== RUN   TestProductResolver_ReviewCount/returns_zero_when_no_reviews_exist
=== RUN   TestProductResolver_ReviewCount/returns_error_when_dataloader_fails
--- PASS: TestProductResolver_ReviewCount (0.00s)
    --- PASS: TestProductResolver_ReviewCount/returns_count_when_stats_exist (0.00s)
    --- PASS: TestProductResolver_ReviewCount/returns_zero_when_no_reviews_exist (0.00s)
    --- PASS: TestProductResolver_ReviewCount/returns_error_when_dataloader_fails (0.00s)

PASS
ok      demo-graphql-subgraph/graph     0.012s
```

---

## Why These Tests Matter

1. **Verify dataloader usage:** Tests confirm we're calling the loader, not direct client
2. **Document behavior:** Tests serve as examples of how the resolvers work
3. **Catch regressions:** Future changes that break this logic will fail these tests
4. **Enable refactoring:** With test coverage, we can refactor confidently

Tests are not optional in production GraphQL APIs.
