package server

import (
	"demo-graphql-subgraph/graph"
	"demo-graphql-subgraph/internal/clients/reviewsclient"
	"log"
	"net/http"
)

// This is a minimal server setup for demo purposes.
// In a real implementation, you would have:
// - Proper middleware stack (auth, logging, tracing, metrics)
// - Dataloader middleware to inject loaders into context
// - CORS configuration
// - Graceful shutdown
// - Health check endpoints

func Run() {
	// Initialize dependencies
	reviewsClient := reviewsclient.NewClient("https://reviews-api.example.com")

	// Create resolver with dependencies
	resolver := &graph.Resolver{
		ReviewsClient: reviewsClient,
	}

	// TODO: Set up GraphQL handler
	// srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	// TODO: Add middleware
	// http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	// http.Handle("/query", srv)

	log.Println("Server would start on http://localhost:8080")
	log.Println("GraphQL playground: http://localhost:8080/playground")

	// TODO: http.ListenAndServe(":8080", nil)
}

// In a real implementation, dataloader middleware would look like:
//
// func DataloaderMiddleware(next http.Handler) http.Handler {
//     return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
//         loaders := loaders.NewLoaders(reviewsClient, db)
//         ctx := context.WithValue(r.Context(), loadersKey, loaders)
//         next.ServeHTTP(w, r.WithContext(ctx))
//     })
// }
