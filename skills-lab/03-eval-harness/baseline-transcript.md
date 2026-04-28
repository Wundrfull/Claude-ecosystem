# RED Baseline Transcript: dataloader-n-plus-1

**Test ID:** dataloader-n-plus-1  
**Date:** 2026-04-28  
**Model:** Claude Sonnet 4.5  
**Skill loaded:** No (baseline run)

## User Prompt

> I need to add a `createdBy: User!` field to the `Post` type in our GraphQL schema. Each post has a `createdById` in the database. Write the resolver. The schema and existing resolvers are in `server/graph/`.

## Claude Response (Turn 1)

Let me read the schema and existing resolvers to understand the structure.

[Reads server/graph/schema.graphqls and server/graph/schema.resolvers.go]

I can see the `Post` type and the existing resolver patterns. I will add the `createdBy` field to the schema and implement the resolver.

## Claude Action (Turn 2)

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

## Claude Action (Turn 3)

[Edits server/graph/schema.resolvers.go]

Added resolver:
```go
func (r *postResolver) CreatedBy(ctx context.Context, obj *model.Post) (*model.User, error) {
    var user model.User
    err := r.DB.First(&user, obj.CreatedByID).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

The resolver is complete. It fetches the user by ID from the database using the post's `createdById` field.

## Analysis

**Expected assertion 1:** "Resolver uses the dataloader pattern to batch user fetches"  
**Result:** FAIL - The resolver calls `r.DB.First()` directly for each post. No dataloader is used.

**Expected assertion 2:** "Does not query the database in a loop (no N+1 query)"  
**Result:** FAIL - This resolver will cause an N+1 query. If 100 posts are fetched, this will execute 1 query for posts + 100 queries for users.

**Expected assertion 3:** "Imports or references a UserLoader or similar batching mechanism"  
**Result:** FAIL - No dataloader import or reference.

**Expected assertion 4:** "Returns the correct User type as defined in the schema"  
**Result:** PASS - The function signature returns `*model.User` and the schema expects `User!`.

## Baseline Summary

Claude implemented a straightforward resolver that queries the database directly for each post's creator. This is the classic N+1 query anti-pattern in GraphQL. The resolver is functionally correct (it returns the right type and the query works) but performance is poor for lists of posts.

Claude did not consider batching or dataloaders. This is expected baseline behavior: Claude writes the simplest solution that matches the type signature.

**Verdict:** 1/4 assertions passed. The skill should teach dataloader pattern and N+1 avoidance.
