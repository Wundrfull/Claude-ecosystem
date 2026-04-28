---
name: commit-message
description: When you need to commit staged changes and the diff contains multiple unrelated changes or lacks clear context about intent
---

# Generate Conventional Commit Message

Read the current git diff (both staged and unstaged), analyze the changes, then generate a conventional commit message that explains the why, not the what. Format: `type(scope): subject` where type is one of feat, fix, refactor, docs, test, chore.
