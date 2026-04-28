---
name: chunked-write
description: When you need to write a file larger than 8-10KB (blog posts, API documentation, RFCs, comprehensive reports, long configuration files) and risk hitting output token limits
---

# Chunked Write Pattern for Large Files

Generate large text files (10KB+) without hitting the `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` limit by writing in chunks with sentinel markers.

## Why This Pattern Exists

Claude Code sets `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` by default. A single Write tool call can hit this limit when generating:
- Long blog posts (10-20KB)
- API documentation (15-30KB)
- Technical RFCs or design docs (20-40KB)
- Comprehensive reports (12-20KB)
- Large configuration files

Attempting to write these in one call results in truncated output. The chunked-write pattern solves this by breaking the content into pieces, writing incrementally, then cleaning up markers.

## The Pattern (5 Steps)

### Step 1: Write Chunk 1 with Sentinel Marker

Use Write to create the file with the first chunk of content (header, introduction, first major section). End the chunk with a unique sentinel marker that you will find and replace later.

Example marker: `<!-- CHUNK_2_CONTINUES_HERE -->`

The marker must be unique enough to match exactly once in the file.

### Step 2: Edit-Append Chunk 2

Use Edit to find the sentinel marker from Step 1 and replace it with:
- The content of chunk 2
- A new sentinel marker for chunk 3

Old string: `<!-- CHUNK_2_CONTINUES_HERE -->`
New string: `[Content of chunk 2]\n\n<!-- CHUNK_3_CONTINUES_HERE -->`

### Step 3: Edit-Append Remaining Chunks

Repeat Step 2 for chunks 3, 4, 5, etc. Each Edit finds the previous marker and replaces it with new content plus the next marker.

For the final chunk, do NOT add a sentinel marker. End with the actual final content.

### Step 4: Strip Sentinel Markers (If Any Remain)

If you accidentally left any markers in the file, use Edit to remove them. Read the file first to check.

### Step 5: Read and Verify

Use Read to open the final file and verify:
- All chunks are present and in order
- No sentinel markers remain
- Formatting is correct (no missing line breaks between sections)
- Total file is complete and coherent

## Chunking Strategy

Aim for chunks of approximately 1500-2000 tokens each. For a 12KB file (approximately 4000 tokens), use 2-3 chunks. For a 30KB file (approximately 10000 tokens), use 5-6 chunks.

Break chunks at natural boundaries:
- Between major sections
- After a complete subsection
- At the end of a code block or example

Never break in the middle of a sentence, code block, or table.

## Sentinel Marker Format

Use HTML comment style for markdown files: `<!-- CHUNK_N_CONTINUES_HERE -->`

For other formats:
- Python/Shell: `# CHUNK_N_CONTINUES_HERE`
- JavaScript/C/Java: `// CHUNK_N_CONTINUES_HERE`
- YAML: `# CHUNK_N_CONTINUES_HERE`

The marker should be visually obvious if you accidentally leave it in.

## Example Execution

Task: Write a 15KB API reference document.

```
Step 1 (Write):
  Create api-reference.md with:
  - Title and introduction
  - First API endpoint documentation
  - Marker: <!-- CHUNK_2_CONTINUES_HERE -->

Step 2 (Edit):
  Find: <!-- CHUNK_2_CONTINUES_HERE -->
  Replace with:
  - Next 3 API endpoints
  - Marker: <!-- CHUNK_3_CONTINUES_HERE -->

Step 3 (Edit):
  Find: <!-- CHUNK_3_CONTINUES_HERE -->
  Replace with:
  - Next 3 API endpoints
  - Marker: <!-- CHUNK_4_CONTINUES_HERE -->

Step 4 (Edit):
  Find: <!-- CHUNK_4_CONTINUES_HERE -->
  Replace with:
  - Final 2 endpoints
  - Authentication section
  - Error codes section
  - No marker (this is the last chunk)

Step 5 (Read):
  Read api-reference.md to verify completeness.
```

## When NOT to Use This Pattern

Do not use chunked writes for:
- Files under 8KB (a single Write will work)
- Code files (use targeted edits on specific functions/classes instead)
- Files where you are only adding or modifying a small section (use Edit directly)

This pattern is for generating large documents from scratch or doing complete rewrites.

## Community Origin

This pattern emerged from community practice, not official Anthropic documentation. It appears in multiple custom skills across the superpowers and extended ecosystem. The graphqlstagereport skill (which generates 12-20KB learning reports) is a real-world implementation of this pattern.
