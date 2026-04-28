# Test Prompts for commit-message skill

## Test 1: Multiple unrelated changes

**Prompt:**
"I need to commit these changes. The diff includes a new API endpoint, a typo fix in the README, and updated eslint config. Generate a commit message."

**Expected behavior:**
- Claude invokes the /commit-message skill
- Reads git diff (staged and unstaged)
- Generates a conventional commit message with type(scope): subject format
- The message explains WHY these changes were made, not just WHAT changed
- If the changes are truly unrelated, Claude may suggest splitting into multiple commits

**Tests:**
- Skill is invoked (not skipped)
- Output follows conventional commit format
- Message focuses on intent, not just file changes
- No emojis or em-dashes in the message

## Test 2: Single-purpose change

**Prompt:**
"I added error handling to the authentication middleware. Write a commit message."

**Expected behavior:**
- Claude invokes the skill
- Reads the diff
- Generates a message like: `fix(auth): add error handling to prevent unhandled exceptions during token validation`
- Type is correct (fix, not feat, since error handling is correcting a gap)

**Tests:**
- Type selection is accurate (fix vs feat vs refactor)
- Scope is identified correctly
- Subject line is under 72 characters
- Message explains the why (prevent unhandled exceptions)

## Test 3: Refactoring with no behavior change

**Prompt:**
"I refactored the user service to extract three helper functions. Commit this."

**Expected behavior:**
- Claude invokes the skill
- Recognizes this as a refactor type
- Message explains the reason for extraction (readability, testability, reuse)
- Does not claim functional changes if none exist

**Tests:**
- Type is `refactor`
- Message does not falsely claim new features
- Explanation includes the motivation (why extract helpers)
- Conventional format is followed
