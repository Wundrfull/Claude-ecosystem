# Pre-Talk Walkthrough

Step-by-step checks to run before you present. Work top to bottom. Each step has an **expected result** so you know whether it passed.

Estimated total time: ~90 minutes if everything works, +30-45 if the Scenario B dry run needs fixes.

---

## Step 0: Git and repo sanity (2 min)

```bash
cd /Users/npeloquin/Documents/AI/Claude-ecosystem
git status
git log --oneline -1
```

**Expected**:
- `nothing to commit, working tree clean`
- Initial commit hash visible
- Tracking `origin/main`

**If not**: commit any loose work before continuing. Don't rehearse on a dirty tree.

---

## Step 1: Serve and eye-pass the deck (15 min)

```bash
cd slides
python -m http.server 8000
```

Open `http://localhost:8000` in **Chrome or Firefox** (not Safari — it blocks the `fetch()` for section files).

**Navigation to test**:
- `→` / `←` arrows: advance and retreat slides
- `F`: fullscreen toggle
- `S`: speaker view (only you see the notes)
- `Esc`: grid overview of all slides

**What to check as you click through all 66 slides**:
- [ ] Gibson font renders (not a generic system sans-serif)
- [ ] CapTech Blue (#005EB8) appears on headers and key numbers
- [ ] CapTech→client stamp shows top-right where it should (sections 02, 03, 07, 08, 09)
- [ ] "Three levers" callback slide appears at sections 01, 07, 10
- [ ] Motion-clip placeholders are visible with the right `data-clip` names: intro, agentic-loop, context-rot, captech-stamp, scenario-d
- [ ] No typos in the quotable numbers: `77.2%`, `78.2%`, `95%`, `35%`, `#005EB8`
- [ ] Speaker notes appear on `S` toggle and read naturally

**Known issues to look for**:
- If Gibson doesn't load, check that `brand-assets/` exists at the repo root and the font paths in `slides/css/brand.css` resolve
- If sections don't load, you're on Safari or opened via `file://` directly (serve over HTTP)

Keep the server running while you work through the rest.

---

## Step 2: Motion graphics render (10 min)

```bash
cd /Users/npeloquin/Documents/AI/Claude-ecosystem/motion
npm install
```

**Expected**: clean install, no peer-dep errors blocking progress.

Then set up the brand-assets symlink:

```bash
ln -s ../brand-assets brand-assets
# or if the README's path is different, follow motion/README.md
ls brand-assets/Fonts/Gibson/Gibson-Regular.otf
```

**Expected**: the `ls` command finds the font file. If not, fix the symlink target before rendering.

Render all four clips:

```bash
npm run render:all
```

**Expected**: four `.mp4` files in `motion/out/` — `intro.mp4`, `agentic-loop.mp4`, `context-rot.mp4`, `captech-stamp.mp4`. Total runtime should be ~2 min 15s of video.

**Verify brand fidelity** (open each mp4):
- [ ] `intro.mp4`: Dark Grey background, CapTech logo visible on the end card, Gibson font on title
- [ ] `agentic-loop.mp4`: Copilot side in muted grey, Claude Code side in CapTech Blue
- [ ] `context-rot.mp4`: accuracy line stays flat then slopes down; Yellow dot at 200K mark
- [ ] `captech-stamp.mp4`: Yellow (sandbox) → Blue (client-ready) transition works

**If the logo is missing or fonts look wrong**: symlink isn't resolving. Re-check the path and re-render.

---

## Step 3: Scenario D screencast recording (15 min)

This step requires a machine authenticated to claude.ai directly (not Bedrock), because `/autofix-pr` and `/ultrareview` require cloud auth. **This is the only step you cannot do from your current Bedrock session.**

**Pre-reqs on the recording machine**:
- Claude Code installed and logged into claude.ai (not Bedrock)
- `gh` CLI authenticated: `gh auth status`
- A clone of this repo on that machine, cd'd into `demos/synthetic-subgraph/`
- Screen recorder ready (QuickTime, OBS, or Loom)

**Follow**: `demos/synthetic-subgraph/DEMO-SCRIPT-D.md` verbatim.

**What to capture**:
- Start: terminal showing the CI failure log
- `/autofix-pr` running and posting a fix
- `/ultrareview` running and producing cited findings
- End: clean PR with the review finding highlighted

**Save to**: `motion/out/scenario-d.mp4` on the presentation machine.

**Wire it into the deck**: open `slides/sections/09-scenario-d.html` and find the `<div class="motion-placeholder" data-clip="scenario-d">`. Replace with:

```html
<video controls src="../../motion/out/scenario-d.mp4"></video>
```

Test that it plays when you reach slide 09 during your arrow-key run-through.

---

## Step 4: Scenario B dry-run (30-45 min — the most important step)

This is the live demo. The demo polish teammate estimated 70% first-try success with 60% confidence on Step 3 specifically. Worth the time.

```bash
cd /Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph
claude
```

Open these on your second monitor while you run the demo:

- `demos/synthetic-subgraph/DEMO-SCRIPT-B.md` — the prompts to type
- `demos/synthetic-subgraph/fallback/FALLBACK-PLAN.md` — what to do if any step stalls
- `demos/synthetic-subgraph/fallback/expected-output-step-3-resolver.md` — the critical fallback

**Work through the script step by step**:

### Step 1: discovery prompt

Type the discovery prompt from the script. **Expected**: Claude reads CLAUDE.md, reads schema.graphql, identifies the resolver and dataloader locations.

- **Pass**: Claude finds `graph/schema.resolvers.go`, `internal/loaders/product.go`, and mentions `ReviewsClient`
- **Fail (45s+ with no response)**: pull up `fallback/expected-output-step-1-plan.md`, describe what the output would look like

### Step 2: schema edit + codegen

**Note**: field names in the script may be `skuCode`/`inventoryCount` OR `averageRating`/`reviewCount` depending on whether you asked me to propagate the README rename. **Run with whatever the script says.**

Ask Claude to propose the schema edit. **Expected**: one clean diff to `schema.graphql` adding the two fields. If Claude tries to run `go generate` and it fails (missing deps), that's fine — say "the codegen step would produce these resolver signatures" and show `fallback/expected-output-step-2-schema-diff.md`.

- **Pass**: schema edit is clean, Claude explains what codegen will produce
- **Fail**: show fallback and narrate

### Step 3: resolver implementation (THE CRITICAL STEP)

Ask Claude to implement the two resolvers. **Watch the output carefully.**

- **Pass**: Claude uses `loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)` — the dataloader pattern
- **Partial pass**: Claude calls `ReviewsClient` directly (N+1 pattern). **Try a follow-up prompt first**: *"Won't this cause N+1 queries if we resolve a list of products?"* If Claude corrects itself, you've shown the team a realistic interaction pattern.
- **Fail**: Claude sticks with the N+1 pattern after the follow-up. Swap to `fallback/expected-output-step-3-resolver.md` and narrate: *"Let me show what the dataloader pattern looks like — this is why the CLAUDE.md guidance matters."*

### Step 4: tests

Ask Claude to write tests. **Expected**: table-driven test with mock dataloader, happy path + nil + error cases.

- **Pass**: test is well-structured even if names/assertions need tweaks
- **Fail**: show `fallback/expected-output-step-4-test.md`

### Decision point after the dry-run

Rate each step honestly:
- Step 1: pass / partial / fail
- Step 2: pass / partial / fail
- Step 3: pass / partial / fail (CRITICAL)
- Step 4: pass / partial / fail

**If Step 3 was pass or partial-pass-after-followup**: go live with Scenario B as-is. You have confidence.

**If Step 3 was fail**: pre-record Step 3 specifically as insurance. Open `claude`, replay the exact follow-up prompt that produced good output (or use the fallback verbatim), screen-capture the 60-90 seconds. Save to `motion/out/scenario-b-step-3.mp4`. Have it queued as a cut-in if needed live.

**If Steps 1 or 2 failed**: strengthen `demos/synthetic-subgraph/CLAUDE.md` with more explicit anchors (file paths, exact grep patterns). Re-run the dry-run.

---

## Step 5: Rehearse the two high-risk moments (20 min)

### Minute 28:00-35:00 — Context hygiene

This segment has the most verbatim-quoted content and numbers in the whole talk. Practice it out loud.

Read from `rehearsal/speaker-notes.md` section 28:00-35:00. Specifically drill:

- The SWE-bench quote: *"77.2% at 200K, 78.2% at 1M — essentially flat"*
- The Anthropic verbatim quote: *"as token count grows, accuracy and recall degrade"*
- The four-line `/clear` vs `/compact` decision rule — **read it, don't paraphrase**
- The 35% tokenizer gotcha (Opus 4.7)
- The 95% auto-compaction threshold
- The 5K-per-skill cap post-compaction

**Why it matters**: this is the segment the audience will scrutinize most. Miss a number and credibility softens.

### Minute 52:00 — Scenario B to D handoff

This is the highest-risk transition. Rehearse two versions:

**Version 1 — "B landed clean"**: use the planned exit line: *"Live was the easy demo. Now watch the one that actually makes your on-call shift shorter."* Then cue the screencast.

**Version 2 — "B broke mid-demo"**: practice a crisp pivot. Example: *"Let's leave Scenario B there — the takeaway is [X]. Now here's what cloud-side commands look like when you can't run them live."* Then cue the screencast. Target: sub-five seconds from decision to video playing.

Decide in advance: at what point in Scenario B do you cut losses? Timing-cues says minute 50 is the abort threshold.

---

## Step 6: Print or phone-load your cue sheets (5 min)

You want these readable on a phone or second monitor, not fumbling for them mid-talk:

- `rehearsal/speaker-notes.md` — primary cue sheet
- `rehearsal/timing-cues.md` — am-I-on-time glance card
- `rehearsal/qa-seeds.md` — for Q&A silence insurance
- `demos/synthetic-subgraph/fallback/expected-output-step-3-resolver.md` — the Scenario B insurance

Quick check before you print:
- Fonts render readably at phone size?
- Timing-cues table fits on one page?
- QA seeds answers short enough to glance and recall?

---

## Step 7: Day-of setup checklist (from pre-flight.md)

The day-of routine is documented at `rehearsal/pre-flight.md`. Work through it top to bottom. Abbreviated version here:

**1 hour before**:
- [ ] `claude --version` ≥ 2.1.32
- [ ] `git status` in `demos/synthetic-subgraph/` shows clean
- [ ] `/context` shows clean in the demo session
- [ ] All four motion clips exist in `motion/out/`
- [ ] `slides/` HTTP server starts cleanly
- [ ] Browser tabs open: deck at localhost:8000, speaker notes, fallbacks, QA seeds
- [ ] Second monitor wired up, audience sees primary only

**15 minutes before**:
- [ ] Click through first 3 slides with arrow keys
- [ ] Press `S` — speaker view toggles
- [ ] Intro Remotion clip auto-plays on slide 1
- [ ] Screenshare test (loopback if possible)
- [ ] Remote teammate notified (they're recording)

**5 minutes before**:
- [ ] Mic check
- [ ] Audio levels
- [ ] Close Slack, email, notifications on the primary display
- [ ] Water within reach

**At the minute mark**:
- [ ] Terminal open in `demos/synthetic-subgraph/` (for minute 45)
- [ ] Fallback files queued on second monitor
- [ ] Breathe. Start.

---

## Troubleshooting triage card

**Deck won't load**: are you on Chrome/Firefox? Is `python -m http.server 8000` running?

**Motion clip won't play**: is the .mp4 in `motion/out/`? Open it directly in a video player to confirm it rendered.

**`claude` command hangs**: AWS SSO likely expired. Run `aws sso login --profile ailab`.

**Scenario B Step 3 produces N+1 code**: try the follow-up prompt once. If it doesn't self-correct, swap to the fallback file on your second monitor, narrate it as if it were live output.

**Running late**: drop the hooks example in minute 37. Drop the MCP mention in minute 58. Both are flagged as cut-safe in `timing-cues.md`.

**Audience asks something off-topic**: use the graceful exit from `qa-seeds.md`.

---

## Ship-readiness gate

Before you call it ready, confirm:

- [ ] Step 1: all 66 slides look right on Chrome/Firefox
- [ ] Step 2: four motion clips render with CapTech branding visible
- [ ] Step 3: Scenario D screencast recorded and wired into slide 09
- [ ] Step 4: Scenario B dry-run done; Step 3 outcome known and insurance in place if needed
- [ ] Step 5: high-risk moments rehearsed out loud
- [ ] Step 6: cue sheets loaded on your phone or second monitor
- [ ] README mismatches resolved (field names, 50KB vs SWE-bench numbers) — ask me to propagate if you haven't yet

When all seven boxes are checked, you're ready.



