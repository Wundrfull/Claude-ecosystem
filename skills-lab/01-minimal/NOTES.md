# Stage Notes: 01-minimal

**Teaching target:** Skill anatomy. This is the smallest useful skill that demonstrates the required structure.

**Duration on stage:** 90 seconds.

## What This Teaches

This skill exists to show the bare minimum: frontmatter with name and description, then a single-sentence instruction body. No complexity, no edge cases, just anatomy.

The key teaching moment is the description field. Notice it does NOT say "generates a conventional commit message from git diff." That would describe what the skill does. Instead it describes WHEN to use it: "when you need to commit staged changes and the diff contains multiple unrelated changes or lacks clear context about intent."

This is the counterintuitive R4 finding: the description is a behavior lever, not metadata. If we had written "generates commit messages," Claude would see that in the skill list, decide it knows how to generate commit messages without loading the skill, and skip it entirely. By framing it as symptoms and triggers (multiple unrelated changes, lacks clear context), we make Claude recognize the situation where this skill applies.

## Why It Is This Short

Real skills can be 300-500 lines. This one is deliberately minimal to prove you do not need verbosity to be useful. The instruction is one sentence because the task is simple: read diff, apply conventional commit format, explain why not what.

If this were production, we might add examples of good vs bad commit messages, a section on scope selection, guidance on multi-file changes. For teaching, we keep it small so the structure is visible.

## What To Say On Stage

"This is the smallest possible useful skill. Frontmatter with a name and a description. One-sentence body. That is all Claude needs to know when to load it and what to do. The description field is load-bearing. Notice it describes WHEN to use this skill, not WHAT it does. That is not a style choice, that is a behavior requirement. If the description summarizes the workflow, Claude follows the description and never reads the body. We learned this the hard way from community testing."

Point at the description field on screen. Read it aloud. Then contrast with a bad version: "generates conventional commit messages from git diff." Say: "That version would not trigger. Claude thinks it already knows how to generate commit messages."

Then: "The body is one sentence. Real skills can be much longer, but start here. If one sentence works, do not add fifty lines."
