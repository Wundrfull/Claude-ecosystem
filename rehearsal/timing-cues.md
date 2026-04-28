# Timing Cues - Claude Code Team Primer

Single-page glance table for staying on schedule during the 60-minute presentation.

---

## Master Timeline

| Target Min | Section | Slide Range | Status Line |
|----------:|---------|-------------|-------------|
| 0:00 | Cold open | 1-3 | "You've all used Copilot. This is not Copilot." |
| 3:00 | What Claude Code is | 4-12 | Play 20s agentic loop clip, introduce three levers |
| 9:00 | Command tour | 13-20 | Headline four: ultrareview, ultraplan, autofix-pr, context |
| 14:00 | Skills (writing/eval) | 21-28 | Show minimal skill anatomy, description gotcha, eval methodology |
| 22:00 | CLAUDE.md contracts | 29-34 | Five lines that appear in most CLAUDE.md files |
| 28:00 | Context hygiene | 35-42 | The number: 77.2% at 200K vs 78.2% at 1M (essentially flat) |
| 35:00 | Subagents + hooks | 43-46 | Aware-only, 2.5 min each, show one concrete example |
| 40:00 | Responsible use | 47-51 | One-slide policy, cite-the-line habit, ZDR note |
| 45:00 | Scenario B live demo | 52-56 | Consumer field addition, 5 steps, fallback ready |
| 52:00 | Scenario D screencast | 57-59 | CI/PR triage, 2 min video + 30s caveats |
| 55:00 | Agent teams + MCP + wrap | 60-66 | 90s agent teams, 60s MCP, 2 min wrap with five takeaways |
| 60:00 | Q&A | -- | Seeded questions ready if audience is quiet |

---

## Gate Buffers (Checkpoints)

These are the moments to glance at the clock and confirm you are on pace.

| Gate | Ideal Time | Acceptable Range | Status |
|------|------------|------------------|--------|
| End of cold open | 3:00 | 2:30-3:30 | If past 3:30, skip one command in tour (drop /rewind or /branch) |
| End of command tour | 14:00 | 13:30-15:00 | Most flexible section - can compress or expand |
| End of skills section | 22:00 | 21:30-22:30 | If past 22:30, shorten hooks section to 90s instead of 2.5 min |
| End of CLAUDE.md | 28:00 | 27:30-28:30 | On track |
| End of context hygiene | 35:00 | 34:30-36:00 | If past 36:00, drop hooks entirely and jump to responsible use |
| Start of Scenario B | 45:00 | 44:00-46:00 | CRITICAL GATE - must start demo by 46:00 or cut to 4 min |
| End of Scenario B | 52:00 | 50:00-53:00 | Narrowest buffer - if past 53:00, skip Scenario D |
| Start of wrap | 55:00 | 54:00-56:00 | Must leave 4-5 min for wrap to land properly |
| Start of Q&A | 60:00 | 59:00-61:00 | Hard stop at 75:00 |

---

## If You Are 2 Minutes Ahead

You have breathing room. Expand these sections to fill time and add depth:

### Option 1: Expand Skills Section (minute 14-22)

- Show the chunked-write pattern from `skills-lab/02-chunked-write/`
- Walk through the golden-task JSON structure in `skills-lab/03-eval-harness/test-prompts.json`
- Discuss the description gotcha with a second example from superpowers

**How:** After showing minimal skill anatomy (minute 16), say "Let's look at one more real example" and pull up chunked-write skill.

### Option 2: Expand CLAUDE.md Section (minute 22-28)

- Show per-subdirectory CLAUDE.md example (graph/CLAUDE.md, loader/CLAUDE.md)
- Walk through the memory iteration pattern: ask Claude to propose edits at end of session
- Demonstrate `/init` command to generate starter CLAUDE.md

**How:** After five common lines (minute 24), say "Let me show you how to organize CLAUDE.md across a multi-domain subgraph."

### Option 3: Expand Command Tour (minute 9-14)

- Demonstrate `/effort` with xhigh default and show token burn rate
- Show `/rewind` by creating a checkpoint and reverting
- Walk through `/context` output in detail (colored grid, token breakdown)

**How:** After headline four (minute 12), say "Let's actually run /context and see what it shows."

---

## If You Are 2 Minutes Behind

You need to trim content. Cut these sections in priority order (cut #1 first, then #2 if still behind):

### Cut #1: Hooks Example (minute 37-38)

**Original:** Show PreToolUse hook that blocks git push --force.

**Trimmed:** Mention hooks exist, show filename (`~/.claude/hooks/pre-tool-use.sh`), describe in one sentence, move on.

**Recovery:** "Hooks let you run shell commands before tool calls. Example: block force-push without a flag. Details in the repo README."

**Time saved:** 90 seconds

### Cut #2: Subagents Deep Dive (minute 35-37)

**Original:** Show one example of spawning a code reviewer subagent, inspect result.

**Trimmed:** Describe subagents in 60 seconds, mention token cost, skip live example.

**Recovery:** "Subagents are focused helper agents with their own context. Useful for quality gates. Token-expensive. Details in R1 research file."

**Time saved:** 90 seconds

### Cut #3: Command Tour Extras (minute 12-14)

**Original:** "Also worth a sentence each" - /effort, /rewind, /branch, /init

**Trimmed:** Skip these entirely. Jump from headline four directly to skills section.

**Recovery:** No mention needed - these are bonus content.

**Time saved:** 2 minutes

### Cut #4: Scenario D Screencast (minute 52-55)

**Original:** 2-minute pre-recorded screencast + 30s caveats.

**Trimmed:** Skip screencast, show one screenshot of /ultrareview output, narrate in 60 seconds.

**Recovery:** "Here's the output from /ultrareview - multi-agent review with cited line numbers. This is cite-the-line, automated."

**Time saved:** 90 seconds

---

## If Scenario B Demo Runs Long

The live demo (minute 45-52) is the highest-risk section for time overrun. If you hit 50:00 and are still on step 3 of 5, abort.

### Abort Phrase

"OK, let's skip ahead. The key takeaway here is that Claude navigated the codebase, respected the CLAUDE.md rules, and used dataloaders to avoid N+1 queries."

### Jump Target

- Close Claude Code session
- Advance slides to Scenario D (slide 57)
- Say: "Let's move to the CI triage scenario."

### What to Show from Fallback

Pull up `fallback/expected-output-step-3-resolver.md` on second monitor, show audience for 10 seconds, narrate:

"This is the resolver implementation we'd expect. Notice `loaders.LoaderFromContext(ctx)` - that's the dataloader pattern. Instead of calling ReviewsClient in a loop, we batch all Load() calls into one API request."

**Time cost of abort:** 45 seconds (vs 7 minutes for full demo)

---

## Section Transition Signals

Use these verbal cues to signal section boundaries. Helps audience follow structure.

| Transition | Say This |
|------------|----------|
| Cold open to What Claude Code Is | "Let me reset the mental model." |
| What Claude Code Is to Command Tour | "Now let's get current - here's what shipped in the last 90 days." |
| Command Tour to Skills | "Let's go deeper on skills - this is one of the more powerful extension points." |
| Skills to CLAUDE.md | "Skills are per-task workflows. CLAUDE.md is a behavior contract for the entire codebase." |
| CLAUDE.md to Context Hygiene | "Now the part that matters most on the client side: context hygiene." |
| Context Hygiene to Subagents/Hooks | "Two more capabilities worth knowing about, briefly." |
| Subagents/Hooks to Responsible Use | "Let's talk about the policy side." |
| Responsible Use to Scenario B | "OK, enough theory. Let's see this in action." |
| Scenario B to Scenario D | "Same subgraph, different workflow." |
| Scenario D to Wrap | "Two more topics, then we wrap." |
| Wrap to Q&A | "Questions?" |

---

## Hard Stops

These are non-negotiable time limits.

| Event | Hard Stop | Why |
|-------|-----------|-----|
| Start Q&A | 61:00 latest | Must leave 14 min for Q&A (contracted 15 min) |
| End Q&A | 75:00 sharp | Recording ends, audience has next meeting |
| End Scenario B demo | 53:00 latest | Allows 2 min for Scenario D, 3 min for wrap, 2 min buffer |

If you hit a hard stop and are not at the target section, skip all intermediate content and jump directly.

**Example:** It is 61:00 and you are still in the wrap. Stop mid-sentence, say "Let's open it up for questions," advance to Q&A slide.

---

## Narrowest Time Buffer

**Minute 45-52: Scenario B live demo.**

This 7-minute block has the least flexibility. The demo has 5 required steps, and if any step stalls (Claude takes 90 seconds instead of 30 seconds, codegen fails, need to troubleshoot), the buffer evaporates instantly.

**Mitigation:**
- Have fallback resolver code ready to paste (step 3)
- If step 1 or 2 takes longer than 2 minutes total, compress step 4 (tests) - just show test file without running tests
- If you reach minute 50 and are not on step 5 (commit), abort and jump to Scenario D

**Presenter warning:** The most likely skip is "running the tests live." You can show the test file and say "these would pass in production" without running `go test`. Saves 60-90 seconds.

---

## Timing Notes

- Total content: 60 minutes
- Q&A: 15 minutes
- Hard stop: 75 minutes
- Narrowest buffer: Scenario B demo (minute 45-52)
- Most compressible section: Command tour (minute 9-14) or hooks (minute 37-38)
- Least compressible section: Context hygiene (minute 28-35) - this is load-bearing content
- Ideal gate check times: 3:00, 14:00, 28:00, 45:00, 52:00, 60:00
