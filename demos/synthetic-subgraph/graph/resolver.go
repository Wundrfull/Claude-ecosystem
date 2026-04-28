package graph

import (
	"demo-graphql-subgraph/internal/clients/reviewsclient"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	// ReviewsClient is used to fetch product review data
	ReviewsClient *reviewsclient.Client

	// Add other dependencies here as needed:
	// - Database connections
	// - Service clients
	// - Caches
	// - Feature flags
}
