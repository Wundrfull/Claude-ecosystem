# Claude Code Commands Inventory (April 28, 2026)

**Research Task:** Current-state inventory of Claude Code slash commands and built-in commands
**Date:** April 28, 2026
**Researcher:** command-inventory-researcher

## TL;DR: NEW IN LAST 90 DAYS

Recent additions since January 2026:

- **`/ultrareview`** - Deep multi-agent code review in cloud sandbox (v2.1.86+, April 2026)
- **`/ultraplan`** - Cloud-based planning with browser review interface (v2.1.91+, April 2026)
- **`/autofix-pr`** - Auto-watch PRs and fix CI failures/review comments (research preview)
- **`claude ultrareview` CLI** - Non-interactive ultrareview for CI/scripts (April 2026)
- **Auto mode expansion** - Extended to Max tier (April 2026, previously limited)
- **Default effort level** - Raised to `xhigh` across all plans (April 2026)
- **`xhigh` effort option** - New tier between `high` and `max` (April 2026)

## FULL COMMAND INVENTORY

### Context Management Commands

| Command | Type | What It Does | When to Use |
|---------|------|--------------|-------------|
| `/clear` | Built-in | Start fresh conversation, empty context | New topic unrelated to current work |
| `/compact [instructions]` | Built-in | Summarize conversation to free context | Running low on context mid-task |
| `/context` | Built-in | Visualize context usage as colored grid | Check capacity, find optimization opportunities |
| `/model [model]` | Built-in | Switch AI model, adjust effort level | Need different capability or speed |
| `/effort [level\|auto]` | Built-in | Set effort: low/medium/high/xhigh/max | Balance reasoning depth vs latency |
| `/resume [session]` | Built-in | Continue previous conversation | Return to earlier work |
| `/rewind` | Built-in | Checkpoint: revert conversation/code | Undo unwanted changes |
| `/branch [name]` | Built-in | Fork conversation at current point | Explore alternative approach |

**Context hygiene notes:**
- `/clear` vs `/compact`: Clear creates new session (old one stays in `/resume`), compact continues same session
- Auto-compaction triggers at ~95% capacity by default (override with `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE`)
- Skills/memory files: first 5K tokens per skill re-attached after compaction (25K total budget)

### NEW: Ultra Commands (Cloud-Powered)

| Command | Introduced | What It Does | Pricing |
|---------|-----------|--------------|---------|
| `/ultrareview [PR]` | v2.1.86 (April 2026) | Multi-agent code review in cloud sandbox with independent verification | 3 free runs (Pro/Max, expires May 5 2026), then $5-$20/review as extra usage |
| `/ultraplan <prompt>` | v2.1.91 (April 2026) | Draft plan in cloud, review in browser with inline comments, execute remotely or locally | Standard usage |
| `/autofix-pr [prompt]` | Research preview | Spawn web session that watches PR, auto-fixes CI failures and review comments | Standard usage |
| `claude ultrareview [target]` | April 2026 | Non-interactive ultrareview for CI (prints to stdout, exits 0/1) | Same as `/ultrareview` |

**Ultra command deep dive:**

**`/ultrareview`** - The stage star for "catching bugs before merge"
- Runs 5-10 minutes, fully remote (terminal stays free)
- Every finding independently reproduced/verified (high signal vs noise)
- Multiple agents explore in parallel (broader coverage than single-pass)
- Requires claude.ai auth (not available on Bedrock/Vertex/Foundry or with ZDR)
- Reviews branch diff OR GitHub PR number
- Flags: `--json` (raw payload), `--timeout <minutes>` (default 30)

**`/ultraplan`** - The planning counterpart
- Hands local task to cloud session in plan mode
- Claude drafts while you keep working
- Browser interface: inline comments, emoji reactions, outline sidebar
- Choose execution location: cloud (opens PR) or teleport back to terminal
- Indicators: `◇ ultraplan` (working), `◇ ultraplan needs your input`, `◆ ultraplan ready`

**`/autofix-pr`** - Autonomous PR maintenance
- Detects PR from current branch via `gh pr view`
- Watches for: CI failures, review comments
- Claude investigates, decides: clear fix (auto-push), ambiguous (asks you), no-action (notes it)
- Replies to GitHub comment threads using your account (labeled as Claude Code)
- WARNING: Can trigger comment-based automation (Atlantis, Terraform Cloud, etc.)

### Code Review & Quality

| Command | Type | What It Does |
|---------|------|--------------|
| `/review [PR]` | Skill | Local PR review (fast, single-pass) |
| `/security-review` | Built-in | Security scan of pending git changes |
| `/simplify [focus]` | Skill | Review changed files, fix reuse/quality/efficiency issues |
| `/diff` | Built-in | Interactive diff viewer: uncommitted + per-turn diffs |

### Pull Request & Git Workflow

| Command | Type | What It Does |
|---------|------|--------------|
| `/autofix-pr [prompt]` | Built-in | Auto-fix PR CI failures and review comments |
| `/review [PR]` | Skill | Review PR locally |
| `/ultrareview [PR]` | Built-in | Deep cloud review (multi-agent, verified findings) |

### Planning & Execution

| Command | Type | What It Does |
|---------|------|--------------|
| `/plan [description]` | Built-in | Enter plan mode (analyze before editing) |
| `/ultraplan <prompt>` | Built-in | Draft plan in cloud, review in browser |
| `/batch <instruction>` | Skill | Large-scale parallel changes (5-30 units, separate worktrees) |

### Project & Session Management

| Command | Type | What It Does |
|---------|------|--------------|
| `/init` | Built-in | Initialize CLAUDE.md guide |
| `/add-dir <path>` | Built-in | Add working directory for file access |
| `/rename [name]` | Built-in | Name session (shows on prompt bar) |
| `/export [filename]` | Built-in | Export conversation as plain text |
| `/teleport` | Built-in | Pull web session into local terminal |
| `/remote` | CLI flag | Create new cloud session (`claude --remote "task"`) |

### Configuration & Settings

| Command | Type | What It Does |
|---------|------|--------------|
| `/config` | Built-in | Open Settings interface (theme, model, output style) |
| `/permissions` | Built-in | Manage allow/ask/deny rules for tools |
| `/memory` | Built-in | Edit CLAUDE.md, manage auto-memory |
| `/skills` | Built-in | List available skills (press `t` to sort by tokens) |
| `/agents` | Built-in | Manage subagent configurations |
| `/hooks` | Built-in | View hook configurations for tool events |
| `/mcp` | Built-in | Manage MCP server connections and OAuth |
| `/plugin` | Built-in | Manage Claude Code plugins |
| `/keybindings` | Built-in | Open keybindings config file |
| `/theme` | Built-in | Change color theme |
| `/statusline` | Built-in | Configure status line |

### Debugging & Diagnostics

| Command | Type | What It Does |
|---------|------|--------------|
| `/debug [description]` | Skill | Enable debug logging, troubleshoot issues |
| `/doctor` | Built-in | Diagnose installation and settings (press `f` to auto-fix) |
| `/context` | Built-in | Visualize context usage with optimization suggestions |
| `/heapdump` | Built-in | Write JS heap snapshot for memory diagnosis |

### Collaboration & Sharing

| Command | Type | What It Does |
|---------|------|--------------|
| `/remote-control` | Built-in | Make session available from claude.ai |
| `/teleport` | Built-in | Pull web session to terminal |
| `/mobile` | Built-in | Show QR code for Claude mobile app |
| `/install-github-app` | Built-in | Set up Claude GitHub Actions app |
| `/install-slack-app` | Built-in | Install Claude Slack app |
| `/web-setup` | Built-in | Connect GitHub account to Claude Code on web |

### Background Tasks & Automation

| Command | Type | What It Does |
|---------|------|--------------|
| `/loop [interval] [prompt]` | Skill | Run prompt repeatedly (autonomous maintenance) |
| `/schedule [description]` | Built-in | Create/update/list/run routines |
| `/tasks` | Built-in | List and manage background tasks |

### Usage & Account

| Command | Type | What It Does |
|---------|------|--------------|
| `/usage` | Built-in | Show cost, plan limits, activity stats |
| `/login` | Built-in | Sign in to Anthropic account |
| `/logout` | Built-in | Sign out from Anthropic account |
| `/upgrade` | Built-in | Open upgrade page for higher tier |
| `/extra-usage` | Built-in | Configure extra usage for rate limits |
| `/passes` | Built-in | Share free week of Claude Code (if eligible) |

### Utilities

| Command | Type | What It Does |
|---------|------|--------------|
| `/btw <question>` | Built-in | Side question without adding to conversation |
| `/copy [N]` | Built-in | Copy assistant response to clipboard (N=Nth-latest) |
| `/help` | Built-in | Show help and available commands |
| `/exit` | Built-in | Exit CLI |
| `/feedback [report]` | Built-in | Submit feedback |
| `/release-notes` | Built-in | View changelog in version picker |

### Specialized/Platform-Specific

| Command | Type | What It Does | Platform |
|---------|------|--------------|----------|
| `/desktop` | Built-in | Continue in Desktop app | macOS/Windows |
| `/chrome` | Built-in | Configure Claude in Chrome | All |
| `/voice [hold\|tap\|off]` | Built-in | Toggle voice dictation | All |
| `/sandbox` | Built-in | Toggle sandbox mode | Supported platforms |
| `/terminal-setup` | Built-in | Configure terminal keybindings | VS Code, Cursor, Windsurf, Alacritty, Zed |
| `/setup-bedrock` | Built-in | Configure Amazon Bedrock | When `CLAUDE_CODE_USE_BEDROCK=1` |
| `/setup-vertex` | Built-in | Configure Google Vertex AI | When `CLAUDE_CODE_USE_VERTEX=1` |

### Bundled Skills (Prompt-Based)

These execute via Skill tool with detailed playbooks:

- `/simplify` - Code quality review (3 parallel agents)
- `/batch` - Large-scale parallel changes
- `/debug` - Debug log analysis
- `/loop` - Recurring tasks
- `/claude-api` - Claude API reference + migration tool
- `/fewer-permission-prompts` - Scan transcripts, add allowlist
- `/review` - Local PR review
- `/security-review` - Security vulnerability scan

## CLI Flags for Session Start

Key non-interactive flags (full list at https://code.claude.com/docs/en/cli-reference):

- `--remote "task"` - Create cloud session
- `--teleport [session]` - Pull web session to terminal
- `--ultrareview [target]` - Non-interactive review (CI mode)
- `--model <name>` - Set model for session
- `--effort <level>` - Set effort level (low/medium/high/xhigh/max)
- `--permission-mode <mode>` - Start in mode (default/acceptEdits/plan/auto/dontAsk/bypassPermissions)
- `--bare` - Minimal mode (no hooks/skills/plugins, fast start)
- `--dangerously-skip-permissions` - Bypass prompts
- `--worktree/-w <name>` - Isolated git worktree session

## Command Categories: When to Reach For What

**Starting work:**
- New topic: `/clear`
- Continue earlier work: `/resume`
- Complex task: `/plan` or `/ultraplan`

**Mid-task:**
- Running low on context: `/compact`
- Need more depth: `/effort high` or `/model opus`
- Undo mistake: `/rewind`
- Try alternative approach: `/branch`

**Before merge:**
- Quick review: `/review`
- Deep confidence: `/ultrareview`
- Security check: `/security-review`
- Code quality: `/simplify`

**After pushing:**
- Watch for CI issues: `/autofix-pr`
- Long-running web task: `claude --remote "task"`
- Pull cloud work back: `/teleport`

**Troubleshooting:**
- Installation issues: `/doctor`
- Context bloat: `/context`
- Permission spam: `/fewer-permission-prompts`
- Debug: `/debug`

## Important Gotchas

**Ultra commands:**
- Require claude.ai authentication (not API key only)
- Not available on Bedrock/Vertex/Foundry
- Not available with Zero Data Retention enabled
- Ultrareview uses extra usage after free runs expire

**Context management:**
- Auto-compaction at ~95% capacity (configurable)
- Skills limited to 5K tokens each post-compaction (25K total budget)
- `/clear` creates new session, `/compact` continues same session

**Cloud sessions:**
- `--remote` creates NEW session (doesn't push existing local session)
- Only repo's `.claude/` config carries over (not `~/.claude/`)
- Sessions expire after inactivity period
- User-level MCP servers and plugins need repo declaration

**Permissions:**
- `/autofix-pr` can trigger comment-based automation (Atlantis, etc.)
- `--dangerously-skip-permissions` doesn't skip hooks or compaction
- Auto mode only applies to tool calls (not skill invocations)

**Model/effort:**
- Default effort now `xhigh` (April 2026 change)
- `max` effort is session-only (doesn't persist to settings)
- Model change re-reads full history without cached context

## Sources

All information verified from official documentation as of April 28, 2026:

1. https://code.claude.com/docs/en/commands - Complete command reference
2. https://code.claude.com/docs/en/cli-reference - CLI flags and options
3. https://code.claude.com/docs/en/ultrareview - Ultrareview deep dive
4. https://code.claude.com/docs/en/ultraplan - Ultraplan documentation
5. https://code.claude.com/docs/en/claude-code-on-the-web - Cloud sessions, /autofix-pr
6. https://code.claude.com/docs/en/github-actions - GitHub Actions integration
7. https://www.anthropic.com/news/claude-opus-4-7 - April 16, 2026 announcement (effort levels, ultrareview, auto mode)

**Note on /pr-fix:** User mentioned "/pr-fix" from Twitter - this maps to `/autofix-pr` in the actual product (research preview feature for auto-fixing PRs based on CI failures and review comments).

---

**Word count:** ~2,100 words
**Key takeaway for presentation:** The ultra commands (/ultrareview, /ultraplan, /autofix-pr) are the headline features from Q1 2026, representing Claude Code's shift toward cloud-powered autonomous workflows.
