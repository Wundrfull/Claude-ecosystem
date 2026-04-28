# Context Hygiene and Responsible Use (April 28, 2026)

**Research Task:** Context-length degradation, /clear vs /compact, responsible use for client data, cost/token awareness, hallucination handling
**Audience:** 6 CapTech consultants starting a GraphQL client project (tokens budgeted on the client side)
**Researcher:** context-hygiene-researcher-v2 (Opus)

## TL;DR: The five load-bearing lines for the deck

1. **"A 900k-token request is billed at the same per-token rate as a 9k-token request, but it does not perform the same. Anthropic calls the drop context rot, and their own docs say accuracy and recall degrade as token count grows."** (Source: platform.claude.com/docs/en/build-with-claude/context-windows)
2. **"Auto-compaction kicks in around 95 percent of context. If you are about to start an unrelated task, use /clear first. /compact is for mid-task when you cannot afford to lose the thread."** (Source: code.claude.com docs, internal notes/research-r2)
3. **"By default, Anthropic does not train on API or commercial inputs or outputs. The exception is when someone clicks the thumbs-up or thumbs-down feedback button. On Team and Enterprise, admins can disable feedback entirely."** (Source: privacy.claude.com/en/articles/7996868)
4. **"Opus 4.7 is five dollars per million input tokens and twenty-five per million output. Prompt caching cuts repeat input to fifty cents per million, a 90 percent discount. Cache your project context, not your scratch work."** (Source: platform.claude.com/docs/en/about-claude/pricing)
5. **"If Claude writes an import, a GraphQL field, or a function signature you have never seen, treat it as a claim, not a fact. Ask it to cite the file and line, or open the file yourself. That is the single highest-ROI habit on this project."** (Source: practitioner pattern, synthesized from Anthropic context-engineering guidance)

---

## 1. Context-length degradation: the data

### Context windows by model (as of April 28, 2026)

| Model | Context window | Max output | Notes |
|-------|----------------|------------|-------|
| Claude Opus 4.7 | 1M tokens | 128K | New tokenizer; up to 35% more tokens for fixed text vs. prior models |
| Claude Sonnet 4.6 | 1M tokens | 64K | Has context awareness feature |
| Claude Sonnet 4.5 | 200K tokens | 64K | Has context awareness feature |
| Claude Haiku 4.5 | 200K tokens | 64K | Has context awareness feature |
| Claude Opus 4.6 | 1M tokens | 128K | Previous flagship |

Source: https://platform.claude.com/docs/en/about-claude/models/overview

### The core finding: "context rot" is documented by Anthropic itself

Directly from Anthropic's official context-windows documentation:

> "As token count grows, accuracy and recall degrade, a phenomenon known as context rot. This makes curating what's in context just as important as how much space is available."

Source: https://platform.claude.com/docs/en/build-with-claude/context-windows

Anthropic's engineering post on context engineering calls the pattern a "performance gradient" rather than a cliff: models remain functional at longer contexts but show "reduced precision for information retrieval and long-range reasoning compared to their performance on shorter contexts." The cause is architectural: transformer attention is n-squared in pairwise token relationships, and training data distributions favor shorter sequences, so long-range dependencies are under-trained.

Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

### Hard numbers we can quote

- **Sonnet 4.5 SWE-bench Verified (200K config): 77.2%. Same model, 1M config: 78.2%.** The 1M score is nearly identical to the 200K score, which Anthropic attributes in part to recent inference issues but also implicitly to the context rot problem. They report the 200K score as their primary number. Source: https://www.anthropic.com/news/claude-sonnet-4-5
- **RULER benchmark (arxiv 2404.06654) headline finding:** "Only half of evaluated models can maintain satisfactory performance at the length of 32K" despite claiming 32K-plus support. The paper does not include Claude, but the 32K threshold is the widely cited industry inflection point where retrieval and reasoning drop for most frontier models. Source: https://arxiv.org/abs/2404.06654
- **Anthropic's own cited benchmarks for long-context retrieval:** MRCR (arxiv 2501.03276) and GraphWalks (arxiv 2412.04360). Anthropic says Claude achieves state-of-the-art on both, but their docs note explicitly: "these gains depend on what's in context, not just how much fits."
- **Sustained task duration (Sonnet 4.5):** Can maintain focus for 30-plus hours on complex multi-step tasks. This is endurance, not recall. Endurance has improved faster than fine-grained recall in long windows.

### Context awareness: new in 4.5-and-later models

Sonnet 4.6, Sonnet 4.5, and Haiku 4.5 receive an explicit token budget at session start and running updates after each tool call:

```
<budget:token_budget>1000000</budget:token_budget>
<system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
```

The model is trained to use this awareness to pace long-running work. Opus 4.7 is not listed as having context awareness in the current docs, though it supports adaptive thinking and a 1M window.

Source: https://platform.claude.com/docs/en/build-with-claude/context-windows

### The practical takeaway for CapTech

You are paying for 1M tokens on Opus 4.7, but the useful working range for high-recall tasks on a GraphQL client project is well under that. Anthropic's own guidance is to treat context as "a finite resource with diminishing marginal returns" and find "the smallest set of high-signal tokens that maximize the likelihood of your desired outcome." For a consulting team, this means: load the schema, load the 2-to-3 files you are editing, and compact or clear before the conversation drifts into unrelated work.

## 2. /clear vs /compact vs /context vs fresh session

### What each one actually does

| Command | What happens | Session continuity | When it is the right move |
|---------|--------------|---------------------|---------------------------|
| `/clear` | Starts a brand-new conversation. The old session is preserved and reachable via `/resume`. Context is empty except for skills, memory, and CLAUDE.md. | New session (old stays in history) | You are switching to an unrelated topic. Previous conversation no longer informs the next task. |
| `/compact [instructions]` | Summarizes the current conversation in place, frees context, continues the same session. You can optionally steer the summary ("keep the GraphQL schema, drop the debugging transcript"). | Same session | You are mid-task and about to hit the wall. You need the thread of reasoning, but most of the turn-by-turn detail is disposable. |
| `/context` | Visualizes current context usage as a colored grid. Does not change anything. Shows what is taking the most space and where to optimize. | Same session, read-only | Diagnose bloat before deciding between /compact and /clear. Always a safe first move. |
| Fresh session (quit and re-launch) | Nuclear option. No history, no /resume entry, starts cold. | None | You suspect the current session has drifted badly, picked up a bad assumption, or has stale file state. |

Sources: notes/research-r2-commands-inventory.md, https://code.claude.com/docs/en/commands

### The auto-compaction trigger

- **Threshold:** Approximately 95 percent of context window capacity.
- **Override:** Set environment variable `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE` to a lower number (for example, 80) to trigger earlier. Useful on long projects where you want Claude to summarize proactively rather than right at the cliff.
- **What survives compaction:** Skills and memory files re-attach, but each skill is capped at the first 5K tokens post-compaction, inside a 25K total budget for skill re-hydration. This means huge skill files lose their tails after a compact.

Source: notes/research-r2-commands-inventory.md (verified against code.claude.com docs)

### Decision rule (stage-quotable)

**"If the next thing you are going to do is unrelated to what you just did, /clear. If it is related and you need continuity, /compact. If you are not sure, /context first, then decide."**

### When each is wrong

- **/compact is wrong when:** the conversation has picked up a bad assumption or a wrong file reading. Compaction summarizes the bad assumption into the summary, so it persists. Use /clear or /rewind instead.
- **/clear is wrong when:** you are 20 turns deep into tracing a subtle GraphQL resolver bug and have built up context on which fields are nullable and why. Clearing throws that away. Use /compact with an instruction like "keep the schema analysis, drop the tool transcripts."
- **Fresh session is wrong when:** your /resume history would be useful. /clear lets you get back. Quitting does not.
- **/context is never wrong.** It just reads. Use it liberally.

### For the CapTech project specifically

Keep one session per feature branch. When you switch branches, /clear. When you are deep in a feature and want to tighten context before the final push, /compact with a steer. Check /context any time the model starts repeating itself or forgetting which file it edited two turns ago. Those are the tells of approaching context rot.

## 3. Responsible use for sensitive client data

This is the section where consulting teams get into the most trouble. Two things are happening in parallel: (a) what Anthropic does with the data you send, and (b) what your session leaks into places you did not intend.

### What Anthropic does with your data (API and commercial use)

Quoting Anthropic directly:

> "By default, we will not use your inputs or outputs from our commercial products... to train our models."

Source: https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training

Additional specifics:

- Applies to the Claude API, Claude for Work, and commercial Claude Code use.
- The default-off behavior flips if someone clicks the thumbs-up or thumbs-down feedback button on a response. Feedback-flagged conversations may be used for training and are stored up to 5 years (de-linked from user identifiers before training use).
- **Team and Enterprise admins can disable feedback submission entirely** via Organization settings > Data and Privacy > "Rate chats." For consulting on sensitive client data, this is the single setting to turn off across the org.
- Zero Data Retention (ZDR) is available as a separate arrangement for organizations that need it. ZDR means data is not stored after the API response is returned. Note: ZDR disables some features, including the Ultra commands (/ultrareview, /ultraplan), which require claude.ai authentication and cloud sandbox execution.

Source: https://www.anthropic.com/legal/commercial-terms ("Anthropic may not train models on Customer Content from Services"; "Customer retains all rights to its Inputs and owns its Outputs.")

### API-key and secret hygiene checklist

For a GraphQL client project where tokens are billed to the client, each of these matters:

1. **Never paste real API keys, OAuth client secrets, bearer tokens, or production credentials into a prompt.** Use placeholders. If Claude needs to know the shape, tell it "assume a Bearer token in the Authorization header."
2. **Do not commit `.env`, `credentials.json`, or anything under `~/.aws/`.** The standard git-add safety pattern (add by explicit filename, never `git add -A`) applies doubly here.
3. **Scrub logs before pasting.** Error traces often contain hostnames, internal IPs, auth tokens, and session IDs. Redact before sharing with the model.
4. **Do not let Claude curl internal endpoints.** If /permissions allows arbitrary bash, Claude can hit client VPN-reachable URLs. Scope the bash allowlist.
5. **Treat the transcript as exportable.** `/export` writes the conversation to disk. Assume anything in the session may end up in a shared file. If you would not email it to the client unredacted, do not put it in the session.
6. **Run `/security-review` before every PR that touches auth, secrets, or data flow.** It scans pending git changes for common leak patterns.
7. **For the CapTech consulting context: prefer the Claude API with ZDR over Claude.ai chat for sensitive client work.** The API has stronger contractual protections and retention controls than consumer Pro/Max.

### Two-environment stamp: CapTech-side vs client-side

| Practice | CapTech-side | Client-side (tokens billed here) |
|----------|--------------|----------------------------------|
| Disable feedback ("Rate chats") | Matters less (CapTech's own IP) | **Matters most.** Client IP must not end up in training via a stray thumbs-up. |
| Zero Data Retention arrangement | Nice to have | **Negotiate this if the client requires it.** Do it before writing any real code. |
| API key hygiene | Standard dev practice | **Non-negotiable.** A leaked client key is a billable incident, possibly a breach notification. |
| /security-review on PRs | Good practice | **Required before every merge.** |
| Scrub logs and traces | Habit-forming | **Enforced.** Add a pre-prompt checklist for the team. |
| Data residency (`inference_geo`) | Usually not needed | **Ask the client.** US-only inference is a 1.1x pricing multiplier but may be required by contract. |
| Model choice | Opus for hard work, Haiku for cheap grunt work | **Same, but log usage per client for chargeback.** |
| `/export` transcripts | Casual | **Treat as client deliverable. Review before sharing.** |

The compact rule: **the stricter policy applies on the client-billed side, always.**

## 4. Hallucination catch patterns

Hallucinations in coding agents cluster in predictable places. Imports that do not exist, API methods with almost-right names, GraphQL fields that look plausible but are not in the schema, function signatures off by one argument, deprecated APIs presented as current. The catch patterns below are ordered by return on effort for a consulting team.

### Pattern 1: "Cite the file and line" rule (highest ROI)

Whenever Claude references a function, type, or field, require a path and line number. If it cannot cite, it is guessing.

**Example:**

> Bad: "We can use the `useQueryWithRetry` hook from Apollo to handle this."
> Good: "We can use the `useQuery` hook. See `node_modules/@apollo/client/react/hooks/useQuery.ts:42`."

If the cited line does not exist or does not match the claim, the model is hallucinating. This catches fabricated imports and made-up APIs faster than any other habit. For a GraphQL project, extend this to schema fields: "cite the schema path where this field is defined."

### Pattern 2: Verify-before-you-run for unfamiliar packages

Before letting Claude install or import a package you have not personally used, have it run a quick verification:

```
Show me the current README and the exported API for <package> from the installed node_modules version,
not from memory. Then propose the import.
```

Claude 4.x has a knowledge cutoff of January 2026 (Opus 4.7) and August 2025 (Sonnet 4.6). Any library released or renamed after that can be hallucinated confidently. Check `node_modules` or the live docs, not the model's head.

### Pattern 3: GraphQL-specific schema grounding

On a GraphQL client project, the single most common hallucination is a field or argument that "should" exist but does not. Prevention:

- Put the GraphQL schema (SDL or introspection JSON) in the repo and load it into context at session start.
- For any generated query, run `graphql-codegen` or the client's own validate step before committing. Treat the query as untrusted until the schema validates it.
- When Claude proposes a query, ask: "which fields in this query did you confirm against the schema at `schema.graphql`? List them." If it cannot enumerate, assume fabrication.

### Pattern 4: Type-check and run the code before trusting it

The cheapest hallucination filter is the compiler. For a TypeScript GraphQL client:

- Run `tsc --noEmit` (or the project's equivalent) after every non-trivial Claude edit. Type errors catch wrong signatures, missing exports, and bad generics in seconds.
- Run the actual test that covers the changed code. Claude is good at writing tests that look right and fail to actually exercise the path. A green test run after a red one is the real signal.
- If Claude says "this should work," read that as "I have not verified." Ask it to run it.

### Pattern 5: Diff review with an adversarial prompt

Before merging, open a fresh session (so prior reasoning does not bias it) and paste the diff with this prompt:

> Review this diff as if you were a senior engineer who does not trust the author. Flag any import, API call, or type that might not exist in the codebase. For each flag, tell me what file I should open to verify.

This uses Claude against its own failure mode. The `/ultrareview` command is a heavier-weight version of this (multi-agent, cloud-verified), and is specifically designed for the "catch fabricated references before merge" job. Use `/review` for fast turnaround, `/ultrareview` for the PR that actually ships to the client.

### Why this matters more on a client-billed project

A hallucinated import shipped to the client is a bug the client paid you to write. These five patterns are cheap. A post-release hotfix is not.

## 5. Cost and token awareness: rules of thumb and a day-of-work budget

### Current per-token pricing (April 28, 2026)

| Model | Input / MTok | Output / MTok | Cache read / MTok | Context window |
|-------|--------------|---------------|-------------------|----------------|
| Opus 4.7 | $5 | $25 | $0.50 (10% of input) | 1M |
| Sonnet 4.6 | $3 | $15 | $0.30 | 1M |
| Sonnet 4.5 | $3 | $15 | $0.30 | 200K |
| Haiku 4.5 | $1 | $5 | $0.10 | 200K |

Source: https://platform.claude.com/docs/en/about-claude/pricing

Notable details:

- **1M context is standard pricing for Opus 4.7, Opus 4.6, and Sonnet 4.6.** Anthropic explicitly says: "A 900k-token request is billed at the same per-token rate as a 9k-token request." No long-context premium. But context rot still applies, so bigger is not better.
- **Opus 4.7 uses a new tokenizer that can produce up to 35% more tokens for the same text** compared to prior models. Budget accordingly if migrating from Opus 4.6.
- **Prompt caching: 5-minute cache = 1.25x input price to write, 0.1x to read. 1-hour cache = 2x to write, 0.1x to read.** Break-even is 1 read for 5m, 2 reads for 1h. On a coding session with stable project context, you will always read more than twice.
- **Batch API: 50% discount on both input and output.** Opus 4.7 becomes $2.50 in / $12.50 out. Not usable for interactive coding, but great for async review jobs and bulk analysis.
- **Fast mode (Opus 4.6 beta): 6x standard rates.** $30 input / $150 output. Only use when latency is genuinely load-bearing.
- **Data residency (`inference_geo=us`): 1.1x multiplier** on everything. Check the client contract before turning this on.
- **Web search: $10 per 1,000 searches** on top of token costs.

### Rules of thumb for a consulting team

1. **Default to Sonnet 4.6 for most coding work.** 60% cheaper than Opus, 1M context, good at coding. Step up to Opus 4.7 for hard agentic tasks (architecture decisions, large refactors, multi-file reasoning).
2. **Use Haiku 4.5 for bulk grunt work:** lint fixes, boilerplate, codegen review, commit-message suggestions. One-fifth the cost of Sonnet for tasks that do not need depth.
3. **Always enable prompt caching for project context.** The GraphQL schema, the main README, the type definitions, CLAUDE.md: all of it should cache. The 90% read discount pays for itself in 2 turns.
4. **Tokens are ~0.75 words or ~4 characters in English.** A 10K-line TypeScript file is roughly 50-80K tokens. The full Apollo Client source tree is over 1M.
5. **Output tokens cost 5x input tokens on Opus and Sonnet.** Ask for concise answers. Setting the effort level lower (`/effort medium` instead of the default `xhigh`) reduces thinking tokens and output length.
6. **Check `/usage` once a day.** Shows cost, plan limits, activity stats. If a session is burning tokens faster than expected, something is wrong (runaway tool loop, accidentally-loaded huge file).
7. **Export and archive long sessions before /clear.** Cheap insurance. `/export session.md` writes the transcript. If the client asks how a decision was made, you have the record.

### A "day of work" budget framework (illustrative)

Assumptions: one consultant, 8-hour coding day, Opus 4.7, moderate use with prompt caching on stable project context (schema + 3-5 files, ~30K tokens cached).

| Activity | Frequency | Input tokens | Cached? | Output tokens | Approx. cost |
|----------|-----------|--------------|---------|---------------|--------------|
| Small edits (20-50 lines) | ~30/day | 30K cached + 2K new | Yes | 2K | ~$0.08 each = **$2.40** |
| Medium features (100-300 lines) | ~8/day | 30K cached + 10K new | Yes | 8K | ~$0.27 each = **$2.16** |
| Large refactors or investigations | ~2/day | 30K cached + 50K new | Partial | 20K | ~$0.82 each = **$1.64** |
| `/ultrareview` runs (pre-merge) | ~2/day | (standard usage, included in plan or ~$5-$20) | — | — | **$0-$40** |
| `/usage` checks, `/context`, tidy-up | ~10/day | negligible | — | — | **< $0.10** |

**Rough daily total per consultant (excluding ultrareview): around $6-$10 of API spend.** With ultrareview on free-tier allotment, add $0. After free runs expire (May 5 2026), add up to $40 for two reviews.

**For 6 consultants over a 3-month engagement:** roughly $3,000-$6,000 in API spend, plus ultrareview overage if used heavily. Prompt caching is what keeps this from being 5-10x higher.

Caveats: these are illustrative numbers derived from the pricing page (https://platform.claude.com/docs/en/about-claude/pricing) and Anthropic's own worked examples. Real usage varies widely with tool-call loops, long debugging sessions, and how aggressively the team uses ultrareview and Opus-level models. Instrument early (`/usage` daily, the Claude Console usage dashboard weekly) and tune.

### The single cost-hygiene habit

**Cache once, clear often, Haiku where you can.** Project context in cache (read at 10% cost), unrelated tasks get a /clear (not a /compact that hauls the whole history along), and anything a junior developer could do gets Haiku, not Opus.

---

## Sources

1. https://platform.claude.com/docs/en/build-with-claude/context-windows (context rot, 1M support, context awareness)
2. https://platform.claude.com/docs/en/about-claude/models/overview (model comparison, context windows, knowledge cutoffs)
3. https://platform.claude.com/docs/en/about-claude/pricing (full pricing, prompt caching, batch, long context)
4. https://platform.claude.com/docs/en/build-with-claude/prompt-caching (caching economics)
5. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (context rot mechanism, practices)
6. https://www.anthropic.com/news/claude-sonnet-4-5 (SWE-bench 200K vs 1M numbers, 30-hour endurance)
7. https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training (training data policy, feedback exception, ZDR)
8. https://www.anthropic.com/legal/commercial-terms (commercial terms, customer ownership)
9. https://arxiv.org/abs/2404.06654 (RULER benchmark, 32K degradation threshold)
10. https://arxiv.org/abs/2501.03276 (MRCR long-context retrieval, cited by Anthropic)
11. https://arxiv.org/abs/2412.04360 (GraphWalks long-context reasoning, cited by Anthropic)
12. https://code.claude.com/docs/en/commands (slash command reference)
13. notes/research-r2-commands-inventory.md (local: /clear, /compact, /context, auto-compaction details)
