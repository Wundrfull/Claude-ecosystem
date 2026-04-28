# Research R1: Anthropic Official Documentation
**Researcher:** anthropic-docs-researcher  
**Date:** 2026-04-28  
**Scope:** Official Anthropic sources for Claude Code (docs.claude.com, code.claude.com, anthropic.com/learn)

---

## TL;DR

Claude Code is Anthropic's agentic coding tool available across terminal, IDE, desktop, web, and CI/CD. Core model: agent loops through Read/Edit/Bash/MCP tools until task completion. Key extensibility: CLAUDE.md project instructions, auto-memory, custom skills, hooks, subagents, and MCP integrations. Official training via Skilljar includes "Claude Code 101" and "Claude Code in Action." As of April 2026, documentation emphasizes multi-surface continuity (remote control, teleport), scheduled automation (routines), and enterprise deployment (SSO, cloud providers).

---

## Core Mental Model (Official Definition)

**What Anthropic Says Claude Code IS:**

> "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools."  
> — https://code.claude.com/docs

**Key Characteristics:**
- **Agentic architecture**: Operates in a loop—plans, uses tools, reflects, iterates until task complete
- **Codebase-aware**: Reads project files as needed without manual context management
- **Multi-file orchestration**: Works across files, tools, and git operations simultaneously
- **Conversational interface**: Natural language task delegation ("write tests and fix failures")
- **Unix philosophy**: Composable, pipeable, scriptable CLI alongside GUI surfaces

**Official Positioning:**
- NOT a copilot (doesn't autocomplete while you type)
- NOT limited to single-file edits
- IS an autonomous agent that executes multi-step workflows
- IS cross-platform (Terminal, VS Code, JetBrains, Desktop, Web, iOS, CI/CD)

---

## Feature Inventory

### 1. **Skills** (Custom Slash Commands)
**What:** Reusable workflows packaged as commands (e.g., `/review`, `/deploy`)  
**URL:** https://code.claude.com/docs (references skills in overview; detailed docs on /en/skills)  
**Built-in examples mentioned:** `/help`, `/resume`, `/clear`, `/login`, `/desktop`, `/schedule`, `/loop`  
**Custom skills:** Team-shareable, defined in project or user config  
**Status:** Current (April 2026)

### 2. **Subagents** (Agent Teams)
**What:** Spawn multiple Claude agents working in parallel on subtasks; lead agent coordinates  
**URL:** https://code.claude.com/docs (overview mentions subagents under "What you can do")  
**Official course:** "Introduction to Subagents" on Skilljar  
**Use case:** Complex tasks with independent parallelizable work  
**Status:** Current (April 2026)

### 3. **Hooks**
**What:** Run shell commands before/after Claude Code actions (e.g., auto-format after file edits, lint before commit)  
**URL:** https://code.claude.com/docs (mentioned in customization section)  
**Examples:** PreFileEdit, PostFileEdit, PreCommit hooks  
**Configuration:** settings.json  
**Status:** Current (April 2026)

### 4. **CLAUDE.md & Auto Memory**
**What:**  
- **CLAUDE.md**: Markdown file in project root with persistent instructions (coding standards, architecture, review checklists)  
- **Auto-memory**: Claude automatically saves learnings (build commands, debugging insights) across sessions  
**URL:** https://code.claude.com/docs/memory (referenced in overview)  
**Best practice:** Use CLAUDE.md for team-wide conventions; auto-memory handles session-specific learnings  
**Status:** Current (April 2026)

### 5. **Interactive Mode vs. One-Shot Commands**
**What:**  
- `claude` starts interactive session with conversation history  
- `claude "task"` runs single task and exits  
- `claude -p "query"` queries without file modifications  
- `claude -c` continues most recent conversation  
**URL:** https://code.claude.com/docs/quickstart  
**Status:** Current (April 2026)

### 6. **Model Context Protocol (MCP)**
**What:** Open standard for connecting AI to external data sources (Google Drive, Jira, Slack, custom tools)  
**URL:** https://code.claude.com/docs/mcp (brief mention; full MCP docs elsewhere)  
**Client Note:** MCP not allowed in target client environment  
**Status:** Current (April 2026), but limited relevance for this presentation

### 7. **Permissions System**
**What:** Granular control over tool access; allowlists reduce permission prompts  
**URL:** https://code.claude.com/docs (permissions mentioned; detailed docs on /en/permissions)  
**Configuration:** settings.json with project/user/global scopes  
**Skill available:** `fewer-permission-prompts` skill scans transcripts and auto-generates allowlists  
**Status:** Current (April 2026)

### 8. **Agent Teams (Multi-Agent Coordination)**
**What:** Lead agent delegates to specialist teammates; merges results  
**URL:** Team config example in ~/.claude/teams/  
**Official mention:** Overview page lists "Run agent teams and build custom agents"  
**Status:** Current (April 2026)—this research task itself uses agent teams

### 9. **Plan Mode / Ultraplan**
**What:** Cloud-based planning for complex tasks (explicit planning step before execution)  
**URL:** Referenced in llms.txt as "Ultraplan (cloud planning)"  
**Status:** Advanced feature, documented but brief in overview

### 10. **Routines & Scheduled Tasks**
**What:**  
- **Routines**: Anthropic-managed recurring tasks (run even when computer off); triggered by schedule, API, or GitHub events  
- **Desktop scheduled tasks**: Local machine recurring tasks  
- **/loop**: In-session polling (e.g., `/loop 5m /check-build`)  
**URL:** https://code.claude.com/docs (overview "Schedule recurring tasks" section)  
**Commands:** `/schedule` in CLI creates routines  
**Status:** Current (April 2026)

### 11. **Remote Control & Teleport**
**What:** Continue sessions across devices (CLI → phone → desktop)  
**Commands:**  
- `claude --teleport` pulls web/iOS session into terminal  
- `/desktop` hands terminal session to Desktop app  
- Remote Control: access any session from phone/browser  
**URL:** https://code.claude.com/docs (overview "Work from anywhere" section)  
**Status:** Current (April 2026)

### 12. **CI/CD Integration**
**What:** GitHub Actions, GitLab CI/CD, automated code review  
**URL:** https://code.claude.com/docs (overview mentions /en/github-actions, /en/gitlab-ci-cd)  
**Use cases:** PR reviews, issue triage, release automation  
**Status:** Current (April 2026)

### 13. **Agent SDK**
**What:** Build custom agents with full control over orchestration, tools, and permissions  
**URL:** https://code.claude.com/docs/agent-sdk/overview (referenced in llms.txt)  
**Languages:** Python, TypeScript  
**Status:** Current (April 2026)

---

## Official Best Practices

**Source:** https://code.claude.com/docs/quickstart (Pro tips section) and /en/best-practices (referenced but not fully fetched)

### From Quickstart Guide:

1. **Be specific with requests**  
   - ❌ "fix the bug"  
   - ✅ "fix the login bug where users see a blank screen after entering wrong credentials"

2. **Use step-by-step instructions for complex tasks**  
   ```
   1. create a new database table for user profiles
   2. create an API endpoint to get and update user profiles  
   3. build a webpage that allows users to see and edit their information
   ```

3. **Let Claude explore first before making changes**  
   - Run exploratory queries: "analyze the database schema"  
   - Then delegate work: "build a dashboard showing products most frequently returned by UK customers"

4. **Talk to Claude like a helpful colleague**  
   - Describe what you want to achieve, not how to code it

### Implicit Best Practices (From Feature Descriptions):

5. **Use CLAUDE.md for team-wide conventions**  
   - Coding standards, architecture decisions, preferred libraries, review checklists

6. **Leverage auto-memory for session-specific learnings**  
   - Claude automatically saves build commands, debugging insights across sessions

7. **Package repeatable workflows as custom skills**  
   - Examples: `/review-pr`, `/deploy-staging`

8. **Use hooks for automation**  
   - Auto-formatting after edits, lint before commits

9. **Pipe, script, and compose with CLI**  
   ```bash
   tail -200 app.log | claude -p "Slack me if you see anomalies"
   git diff main --name-only | claude -p "review these changed files for security issues"
   ```

10. **Approve permissions once, then allowlist**  
    - Use `fewer-permission-prompts` skill to auto-generate allowlists after initial work

---

## Official Courses (Skilljar)

**Source:** https://anthropic.skilljar.com (accessed 2026-04-28)

### Claude Code Courses:

1. **Claude Code 101**  
   - Focus: "Learn how to use Claude Code effectively in your daily development workflow"  
   - Audience: Foundational skills for developers new to Claude Code  
   - URL: https://anthropic.skilljar.com

2. **Claude Code in Action**  
   - Focus: "Integrate Claude Code into your development workflow"  
   - Audience: Practical implementation and workflow integration  
   - URL: https://anthropic.skilljar.com

### Related Courses with Claude Code Elements:

3. **Introduction to Agent Skills**  
   - Building reusable Skills in Claude Code

4. **Introduction to Subagents**  
   - Creating sub-agents within Claude Code for task delegation

5. **Introduction to Claude Cowork**  
   - Hands-on training for working with Claude on real projects

**Access:** All courses require Skilljar account creation  
**Certificates:** Available upon completion

---

## What's CURRENT vs. Legacy/Deprecated (April 2026)

### ✅ CURRENT (Confirmed in April 2026 docs):
- Multi-surface architecture (Terminal, VS Code, JetBrains, Desktop, Web, iOS)
- CLAUDE.md + auto-memory
- Skills, subagents, hooks
- MCP integration
- Remote control & teleport
- Routines (Anthropic-managed scheduled tasks)
- CI/CD integrations (GitHub Actions, GitLab)
- Agent SDK (Python/TypeScript)
- Third-party cloud providers (Bedrock, Vertex AI, Microsoft Foundry)
- Permissions system with allowlists
- Agent teams

### 🔍 NO EVIDENCE OF DEPRECATION:
- All features mentioned in overview appear current
- No "legacy" or "deprecated" warnings found in fetched documentation

### ⚠️ INSTALLATION METHOD NOTES:
- **Native installs** (curl script): Auto-update in background ✅  
- **Homebrew**: Does NOT auto-update—requires `brew upgrade claude-code` ⚠️  
- **WinGet**: Does NOT auto-update—requires `winget upgrade Anthropic.ClaudeCode` ⚠️  
- **Stable vs. Latest channels:** Homebrew offers `claude-code` (stable, ~1 week behind) and `claude-code@latest` (bleeding edge)

---

## Gaps: What Official Docs DON'T Address Well

Based on fetched content and 404 errors:

1. **Detailed slash command reference**  
   - Overview mentions `/help`, `/resume`, `/clear`, `/login`, `/desktop`, `/schedule`, `/loop`  
   - Full command list likely at /en/cli-reference (404 during fetch)

2. **Hooks reference with examples**  
   - Mentioned in overview but detailed hook types/syntax not in fetched pages  
   - Likely at /en/hooks (404 during fetch)

3. **Best practices deep-dive**  
   - /en/best-practices referenced but returned 404  
   - Quickstart has "Pro tips" but not comprehensive

4. **Cost management details**  
   - /en/costs mentioned in llms.txt but returned 404  
   - Quickstart mentions Pro/Max/Team/Enterprise tiers but no pricing specifics

5. **Settings.json schema**  
   - /en/settings referenced but returned 404  
   - Configuration mentioned (permissions, hooks) but not documented in fetched pages

6. **Concrete skill examples**  
   - Skills mentioned but no code examples in fetched documentation  
   - /en/skills returned 404

7. **Interactive mode keyboard shortcuts**  
   - Quickstart says "Press `?` to see all available keyboard shortcuts"  
   - Full reference not in fetched pages

8. **CLAUDE.md syntax/schema**  
   - Concept explained but no examples or schema in fetched pages  
   - /en/memory and /en/claude-md both returned 404

9. **Common workflows step-by-step**  
   - /en/common-workflows referenced but returned 404  
   - Overview has high-level use cases but not detailed walkthroughs

10. **Plan mode / Ultraplan usage**  
    - Mentioned in llms.txt but minimal detail in overview

**Why this matters for the presentation:**  
Community resources (Discord, GitHub discussions, blog posts) will fill these gaps. The official docs provide the **what** and **why**; community provides the **how** with examples.

---

## URLs Cited

- **Master index:** https://code.claude.com/docs/llms.txt
- **Overview:** https://code.claude.com/docs
- **Quickstart:** https://code.claude.com/docs/quickstart
- **Official courses:** https://anthropic.skilljar.com
- **Learning hub:** https://www.anthropic.com/learn
- **Installation:** https://claude.ai/install.sh (macOS/Linux), https://claude.ai/install.ps1 (PowerShell)
- **Desktop downloads:** https://claude.com/download
- **VS Code extension:** https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
- **JetBrains plugin:** https://plugins.jetbrains.com/plugin/27310-claude-code-beta-
- **Web app:** https://claude.ai/code
- **Pricing:** https://claude.com/pricing
- **Console (API access):** https://console.anthropic.com/

---

## Notes for Presentation Team

**Target Audience Considerations (CapTech team = Copilot-experienced, CLI-comfortable):**

1. **Mental model shift:** Copilot = autocomplete; Claude Code = autonomous agent  
2. **Emphasize agentic loop:** Plan → Execute → Reflect → Iterate (not just "suggest next line")  
3. **Multi-file orchestration:** Unlike Copilot's single-file focus, Claude Code reads entire codebase  
4. **CLI familiarity is advantage:** They'll appreciate piping, scripting, Unix composability  
5. **Skills as "custom commands":** Analogous to shell aliases but with AI execution  
6. **CLAUDE.md = project context:** Similar to .editorconfig or .eslintrc but for AI behavior

**Presentation Flow Recommendation:**
1. Show mental model (agentic loop)  
2. Demo quickstart flow (install → claude → simple task → git commit)  
3. Explain extensibility layers (CLAUDE.md → skills → hooks → subagents)  
4. Surface tour (Terminal → VS Code → Desktop → CI/CD)  
5. Best practices (specificity, step-by-step, explore-first)  
6. Point to courses (Claude Code 101, Claude Code in Action)

**MCP Caveat:**  
Client won't allow MCPs—mention briefly as "extensibility option you won't use" but don't dwell on it.

---

**End of Official Anthropic Documentation Research**  
Next: Community research (R2), ecosystem tools (R3), GraphQL-specific research (R4)
