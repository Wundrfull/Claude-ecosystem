package graph

import (
	"context"
	"demo-graphql-subgraph/graph/model"
	"demo-graphql-subgraph/internal/clients/reviewsclient"
	"testing"
)

// TestProductResolver_Product tests the product query resolver
func TestProductResolver_Product(t *testing.T) {
	tests := []struct {
		name        string
		productID   string
		wantProduct bool
		wantErr     bool
	}{
		{
			name:        "returns product when found",
			productID:   "prod-123",
			wantProduct: true,
			wantErr:     false,
		},
		{
			name:        "returns nil when not found",
			productID:   "prod-404",
			wantProduct: false,
			wantErr:     false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				&Resolver{
					ReviewsClient: reviewsclient.NewClient("http://test"),
				},
			}

			got, err := r.Product(context.Background(), tt.productID)

			if (err != nil) != tt.wantErr {
				t.Errorf("Product() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if (got != nil) != tt.wantProduct {
				t.Errorf("Product() got = %v, want product = %v", got, tt.wantProduct)
			}

			if got != nil && got.ID != tt.productID {
				t.Errorf("Product() ID = %v, want %v", got.ID, tt.productID)
			}
		})
	}
}

// TestProductResolver_Products tests the products list query resolver
func TestProductResolver_Products(t *testing.T) {
	tests := []struct {
		name      string
		limit     *int
		wantCount int
		wantErr   bool
	}{
		{
			name:      "returns all products when no limit",
			limit:     nil,
			wantCount: 3,
			wantErr:   false,
		},
		{
			name:      "respects limit parameter",
			limit:     intPtr(2),
			wantCount: 2,
			wantErr:   false,
		},
		{
			name:      "handles zero limit",
			limit:     intPtr(0),
			wantCount: 0,
			wantErr:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &queryResolver{
				&Resolver{
					ReviewsClient: reviewsclient.NewClient("http://test"),
				},
			}

			got, err := r.Products(context.Background(), tt.limit)

			if (err != nil) != tt.wantErr {
				t.Errorf("Products() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if len(got) != tt.wantCount {
				t.Errorf("Products() returned %d products, want %d", len(got), tt.wantCount)
			}
		})
	}
}

// TestMutationResolver_CreateProduct tests the createProduct mutation
func TestMutationResolver_CreateProduct(t *testing.T) {
	tests := []struct {
		name    string
		input   model.CreateProductInput
		wantErr bool
	}{
		{
			name: "creates product with all fields",
			input: model.CreateProductInput{
				Name:        "Test Product",
				PriceCents:  1999,
				Description: stringPtr("Test description"),
			},
			wantErr: false,
		},
		{
			name: "creates product without description",
			input: model.CreateProductInput{
				Name:       "Test Product 2",
				PriceCents: 2999,
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &mutationResolver{
				&Resolver{
					ReviewsClient: reviewsclient.NewClient("http://test"),
				},
			}

			got, err := r.CreateProduct(context.Background(), tt.input)

			if (err != nil) != tt.wantErr {
				t.Errorf("CreateProduct() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if got == nil {
				t.Error("CreateProduct() returned nil product")
				return
			}

			if got.Name != tt.input.Name {
				t.Errorf("CreateProduct() Name = %v, want %v", got.Name, tt.input.Name)
			}

			if got.PriceCents != tt.input.PriceCents {
				t.Errorf("CreateProduct() PriceCents = %v, want %v", got.PriceCents, tt.input.PriceCents)
			}
		})
	}
}

// Helper function for pointer to int
func intPtr(i int) *int {
	return &i
}

// TODO: When new fields are added to Product type, add tests here
// Example pattern:
//
// func TestProductResolver_NewField(t *testing.T) {
//     tests := []struct {
//         name       string
//         product    *model.Product
//         wantValue  expectedType
//         wantErr    bool
//     }{
//         {
//             name: "happy path",
//             product: &model.Product{ID: "prod-1"},
//             wantValue: expectedValue,
//             wantErr: false,
//         },
//         {
//             name: "error case",
//             product: &model.Product{ID: "prod-error"},
//             wantErr: true,
//         },
//     }
//     // ... test implementation
// }
