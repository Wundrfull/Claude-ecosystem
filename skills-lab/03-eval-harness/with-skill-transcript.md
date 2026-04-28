# GREEN Test Transcript: dataloader-n-plus-1

**Test ID:** dataloader-n-plus-1  
**Date:** 2026-04-28  
**Model:** Claude Sonnet 4.5  
**Skill loaded:** graphql-dataloader (hypothetical skill teaching dataloader pattern)

## User Prompt

> I need to add a `createdBy: User!` field to the `Post` type in our GraphQL schema. Each post has a `createdById` in the database. Write the resolver. The schema and existing resolvers are in `server/graph/`.

## Claude Response (Turn 1)

I see this is a relationship resolver that will be called for each post in a list. I need to use the dataloader pattern to batch user fetches and avoid N+1 queries.

Let me check the existing schema and dataloader setup.

[Reads server/graph/schema.graphqls, server/graph/schema.resolvers.go, server/dataloader/]

## Claude Action (Turn 2)

[Reads server/dataloader/user_loader.go to check if UserLoader exists]

I can see there is already a UserLoader configured. I will use it in the resolver.

## Claude Action (Turn 3)

[Edits server/graph/schema.graphqls]

Added field to Post type:
```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  createdById: ID!
  createdBy: User!
}
```

## Claude Action (Turn 4)

[Edits server/graph/schema.resolvers.go]

Added resolver using dataloader:
```go
func (r *postResolver) CreatedBy(ctx context.Context, obj *model.Post) (*model.User, error) {
    loaders := dataloader.GetLoaders(ctx)
    if loaders == nil {
        return nil, fmt.Errorf("dataloaders not found in context")
    }
    
    user, err := loaders.UserLoader.Load(ctx, obj.CreatedByID)
    if err != nil {
        return nil, err
    }
    return user, nil
}
```

The resolver uses the UserLoader from context to batch user fetches. When GraphQL resolves a list of posts, all user IDs will be collected and fetched in a single batched query, avoiding N+1.

## Analysis

**Expected assertion 1:** "Resolver uses the dataloader pattern to batch user fetches"  
**Result:** PASS - The resolver explicitly calls `loaders.UserLoader.Load()` which batches requests.

**Expected assertion 2:** "Does not query the database in a loop (no N+1 query)"  
**Result:** PASS - The dataloader batches user IDs and executes one query for all users, not one per post.

**Expected assertion 3:** "Imports or references a UserLoader or similar batching mechanism"  
**Result:** PASS - The code references `dataloader.GetLoaders(ctx)` and `loaders.UserLoader`.

**Expected assertion 4:** "Returns the correct User type as defined in the schema"  
**Result:** PASS - The function signature returns `*model.User` and the schema expects `User!`.

## GREEN Summary

With the graphql-dataloader skill loaded, Claude immediately recognized this as a batching scenario and reached for the dataloader pattern. It checked for existing dataloader infrastructure before implementing the resolver, then used the UserLoader to batch fetches.

The resolver is both functionally correct and performant. Fetching 100 posts will execute 1 query for posts + 1 batched query for all unique users, not 100 individual user queries.

**Verdict:** 4/4 assertions passed. The skill successfully changed behavior.

## Skill Invocation

The skill was invoked implicitly when Claude detected the relationship resolver scenario. The description field likely included triggers like "adding a field that requires fetching related data" or "resolver that will be called for each item in a list."
