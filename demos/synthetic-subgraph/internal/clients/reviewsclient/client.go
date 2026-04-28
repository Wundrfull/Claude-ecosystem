package reviewsclient

import (
	"context"
	"fmt"
)

// Client is a REST client for the Reviews service
type Client struct {
	baseURL string
	// In a real implementation: HTTP client, auth, retries, etc.
}

// NewClient creates a new reviews service client
func NewClient(baseURL string) *Client {
	return &Client{
		baseURL: baseURL,
	}
}

// ReviewStats contains aggregated review data for a product
type ReviewStats struct {
	ProductID     string
	AverageRating *float64 // Nullable - products with no reviews have nil
	ReviewCount   int
	LastReviewAt  *string // ISO8601 timestamp
}

// GetProductReviews fetches review statistics for a single product
func (c *Client) GetProductReviews(ctx context.Context, productID string) (*ReviewStats, error) {
	// TODO: Real implementation would:
	// 1. Make HTTP GET request to /api/products/{productID}/reviews/stats
	// 2. Handle auth headers
	// 3. Parse JSON response
	// 4. Handle errors (404, 5xx, timeout)
	// 5. Respect context deadline

	// Stub for demo purposes
	rating := 4.5
	return &ReviewStats{
		ProductID:     productID,
		AverageRating: &rating,
		ReviewCount:   42,
	}, nil
}

// GetBatchProductReviews fetches review stats for multiple products in one request
func (c *Client) GetBatchProductReviews(ctx context.Context, productIDs []string) (map[string]*ReviewStats, error) {
	// TODO: Real implementation would POST to /api/products/reviews/batch
	// with product IDs in the request body

	// Stub implementation
	results := make(map[string]*ReviewStats)
	for _, id := range productIDs {
		rating := 4.5
		results[id] = &ReviewStats{
			ProductID:     id,
			AverageRating: &rating,
			ReviewCount:   42,
		}
	}

	return results, nil
}

// CreateReview submits a new review for a product
func (c *Client) CreateReview(ctx context.Context, productID string, userID string, rating int, comment string) error {
	// TODO: Real implementation would POST to /api/reviews
	return fmt.Errorf("not implemented")
}

// NOTE: In a real client, you would also have:
// - Proper error types (NotFoundError, ValidationError, etc.)
// - Retry logic with exponential backoff
// - Circuit breaker for fault tolerance
// - Request/response logging
// - Metrics instrumentation
// - OpenTelemetry tracing
