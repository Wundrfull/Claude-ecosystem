# Stage Notes: 02-chunked-write

**Teaching target:** A real-world pattern that solves a hard constraint in Claude Code. This is not in Anthropic's official docs; it comes from community practice.

**Duration on stage:** 3 minutes.

## Why This Pattern Exists

Claude Code sets `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` by default. That is approximately 12KB of text. When you ask Claude to generate a long document (a blog post, API reference, RFC), a single Write tool call will truncate at the token limit, leaving you with an incomplete file.

The chunked-write pattern emerged as a community solution. It treats the Edit tool as an append operation by using sentinel markers to identify where the next chunk should be inserted. This lets you build large files incrementally without hitting the token cap.

The graphqlstagereport.md skill is the direct source for this example. That skill generates 12-20KB learning reports by writing in 5 chunks with explicit sentinel markers between phases. It works reliably because the pattern is encoded as an instruction, not left implicit.

## When To Reach For It

If you are asking Claude to:
- Write a blog post longer than 2000 words
- Generate comprehensive API documentation covering 10+ endpoints
- Draft a technical RFC or design doc with multiple sections
- Create a detailed report with research findings

And you notice the output is cutting off mid-sentence or missing the conclusion, you are hitting the output token cap. That is when this pattern matters.

## Community Signal

This pattern appears across multiple projects in the superpowers extended ecosystem and in custom skills from heavy Claude Code users. It is not branded or standardized, just convergent evolution. Every team that generates long documents hits this constraint and independently discovers some version of chunked writing.

The swyx posts (if you have seen them on X) reference this problem but do not prescribe a specific solution. The pattern here codifies what works: Write chunk 1, Edit-append chunks 2-N with sentinel markers, Read to verify.

## What To Say On Stage

"This skill teaches a pattern that does not appear in Anthropic's documentation but shows up everywhere in the community. The problem: Claude Code caps output tokens at 4096. If you ask Claude to write a 10KB blog post, it will truncate halfway through. The solution: write in chunks.

Look at the pattern. Step 1: Write the first chunk with a sentinel marker at the end. Step 2: Edit finds that marker and replaces it with the next chunk plus a new marker. Repeat until done. Step 5: Read the file to verify nothing was lost.

This comes directly from a real skill I use to generate training reports. Those reports are 12-20KB. Without this pattern, they cut off after 4KB. With it, they work reliably.

The lesson here is not just the pattern. The lesson is that encoding operational constraints as instructions is a valid skill-writing technique. If your environment has a known failure mode, write it into the skill. Do not assume Claude will infer the workaround."

Then show the graphqlstagereport.md file (already on the user's machine at ~/.claude/skills/graphqlstagereport.md) and point to lines 17-19 where it says "IMPORTANT: CLAUDE_CODE_MAX_OUTPUT_TOKENS is set to 4096. You MUST NOT attempt to write the entire report in a single Write call." That is the pattern in production.

## Caveats

This pattern adds complexity. Each Edit call is another tool invocation, another opportunity for failure. If a chunk fails to append, the file is incomplete and the next chunk may fail to find its marker.

For files under 8KB, skip this pattern. A single Write will work. For files over 20KB, consider whether the document should be split into multiple files instead of forcing a single large artifact.

The pattern works because Edit is reliable at finding and replacing unique strings. If your sentinel markers are not unique, Edit will fail or match the wrong occurrence. Make markers visually obvious: `<!-- CHUNK_2_CONTINUES_HERE -->` not `[...]`.
