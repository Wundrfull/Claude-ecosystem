# Test Prompts for chunked-write skill

## Test 1: 10KB Blog Post

**Prompt:**
"Write a 10KB blog post about the differences between REST and GraphQL APIs. Include an introduction, 5 major comparison sections (data fetching, versioning, caching, tooling, learning curve), code examples for each, and a conclusion. Save it to blog-post.md."

**Expected behavior:**
- Claude invokes the /chunked-write skill
- Writes the file in 2-3 chunks using the sentinel marker pattern
- First chunk: Write creates the file with title, intro, first 2 sections, and marker
- Subsequent chunks: Edit-append operations replacing markers with content
- Final step: Read to verify the complete file
- Total file size is approximately 10KB (no truncation)

**Tests:**
- Skill is invoked explicitly or Claude recognizes the large-output scenario
- File is written in multiple chunks (not a single Write call)
- Sentinel markers are used correctly between chunks
- No markers remain in the final file
- File contains all 5 comparison sections plus intro and conclusion
- Code examples are present and complete (not cut off)
- File is coherent from start to finish

## Test 2: 15KB API Reference

**Prompt:**
"Generate a comprehensive API reference for a fictional e-commerce API with 12 endpoints (products, categories, cart, checkout, orders, users, auth, reviews, search, recommendations, analytics, webhooks). Include request/response examples, authentication requirements, error codes, and rate limiting. Save as api-reference.md."

**Expected behavior:**
- Claude invokes the chunked-write skill
- Plans to write in 3-4 chunks given the size
- Each chunk covers 3-4 endpoints with full detail
- Sentinel markers are placed at natural section boundaries
- Final chunk includes authentication, error codes, rate limiting sections
- No marker remains in the final file
- Read verifies completeness

**Tests:**
- File is approximately 15KB (not truncated at 4KB)
- All 12 endpoints are documented
- Request/response examples are complete
- Authentication, error codes, rate limiting sections are present
- Formatting is consistent throughout
- No sentinel markers in final output
- No missing sections between chunks

## Test 3: 20KB Technical RFC

**Prompt:**
"Write a technical RFC for implementing a distributed caching layer using Redis. Include: problem statement, goals and non-goals, detailed design with 4 architectural options (each with pros/cons), proposed solution with implementation phases, security considerations, monitoring strategy, rollout plan, alternatives considered, and open questions. Target 20KB. Save as rfc-distributed-cache.md."

**Expected behavior:**
- Claude recognizes this requires chunked writing
- Invokes the skill
- Writes in 4-5 chunks (approximately 4KB each)
- Chunk 1: Title, problem statement, goals, first architectural option
- Chunks 2-3: Remaining architectural options, proposed solution
- Chunks 4-5: Security, monitoring, rollout, alternatives, open questions
- Final Read verification confirms all sections present

**Tests:**
- File size is approximately 20KB
- All required sections are present and complete
- Architectural options include pros/cons tables
- Implementation phases are detailed
- No content is truncated mid-section
- Sentinel markers are removed
- Formatting (headers, lists, tables) is preserved across chunks
- The RFC is coherent and reads as a single document
