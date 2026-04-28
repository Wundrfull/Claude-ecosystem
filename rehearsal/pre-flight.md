# Pre-Flight Checklist - Claude Code Team Primer

Day-of checklist for the 60-minute presentation. Four phases: 1 hour before, 15 minutes before, 5 minutes before, and at the minute.

---

## 1 Hour Before - Environment & Content Checks

### Verify Claude Code Installation

- [ ] Run `claude --version` and confirm version >= 2.1.32
- [ ] Run `aws sso login --profile ailab` to ensure AWS auth is current
- [ ] Test Claude Code with a simple command in a scratch directory: `claude` then `/exit`

### Verify Demo Repository State

- [ ] Navigate to `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/`
- [ ] Run `git status` and confirm clean working tree (no uncommitted changes)
- [ ] Verify `CLAUDE.md` exists and is readable: `cat CLAUDE.md | head -20`
- [ ] Verify schema file exists: `ls graph/schema.graphql`
- [ ] Run `claude` in the demo directory, then `/context` to verify clean context
- [ ] Verify CLAUDE.md loads in context output
- [ ] Exit Claude: `/exit`

### Render Motion Graphics

- [ ] Navigate to `/Users/npeloquin/Documents/AI/Claude-ecosystem/motion/`
- [ ] Verify all 4 MP4 files exist in `motion/out/`:
  - [ ] `intro.mp4`
  - [ ] `agentic-loop.mp4`
  - [ ] `context-rot.mp4`
  - [ ] `captech-stamp.mp4`
- [ ] Spot-check one video file plays: open `motion/out/intro.mp4` in QuickTime or VLC
- [ ] If any MP4 is missing, run `npm run render:all` (takes 5-10 min)

### Start Slide Server

- [ ] Navigate to `/Users/npeloquin/Documents/AI/Claude-ecosystem/slides/`
- [ ] Run `python -m http.server 8000` in a dedicated terminal tab
- [ ] Keep this terminal tab open for the entire session
- [ ] Open browser to `http://localhost:8000`
- [ ] Verify first slide loads with title "Claude Code Team Primer"

### Browser Tab Setup

Open these tabs in the following order (left to right):

- [ ] `http://localhost:8000` (slides)
- [ ] `/Users/npeloquin/Documents/AI/Claude-ecosystem/rehearsal/speaker-notes.md` (in browser or text editor)
- [ ] `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/fallback/expected-output-step-3-resolver.md`
- [ ] `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/DEMO-SCRIPT-B.md`
- [ ] `/Users/npeloquin/Documents/AI/Claude-ecosystem/rehearsal/qa-seeds.md`

### Monitor Setup

- [ ] Connect second monitor or external display
- [ ] Set primary display to "mirror" or ensure audience sees only primary screen
- [ ] Test screenshare output by sharing screen in Zoom/Teams and checking preview
- [ ] Move speaker notes and fallback files to second monitor (not visible to audience)
- [ ] Keep slides on primary display (visible to audience)

### Record Scenario D Screencast (if not already done)

- [ ] Open `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/DEMO-SCRIPT-D.md`
- [ ] Follow the script to record a 2-minute screencast of `/autofix-pr` and `/ultrareview`
- [ ] Save screencast as `scenario-d-recording.mp4` in `demos/synthetic-subgraph/`
- [ ] Test playback to ensure audio and video quality

### Confirm Go Installation (for live demo)

- [ ] Run `go version` and confirm Go 1.22 or higher
- [ ] If Go is not installed or outdated, note this in fallback plan

---

## 15 Minutes Before - Final Verification

### Slide Deck Walk-Through

- [ ] Navigate to `http://localhost:8000` in browser
- [ ] Press right arrow key to advance to slide 2
- [ ] Press right arrow key to advance to slide 3
- [ ] Press `S` key to open speaker view (if supported)
- [ ] Verify speaker notes display (if using reveal.js or similar)
- [ ] Press Escape or close speaker view
- [ ] Return to slide 1

### Queue Intro Remotion Clip

- [ ] Locate `motion/out/intro.mp4` in Finder
- [ ] Test playback one more time
- [ ] If embedding in slide 1, verify it plays inline
- [ ] If playing externally, have file ready to open

### Test Screenshare Output

- [ ] Start screenshare in Zoom/Teams/Google Meet
- [ ] Verify audience sees primary display only (not speaker notes)
- [ ] Check resolution and font size - audience should be able to read terminal text
- [ ] Stop screenshare

### Notify Remote Teammate

- [ ] Send Slack or email to recording teammate: "Starting in 15 minutes"
- [ ] Confirm they are ready to start recording
- [ ] Share meeting link if not already shared

### Verify Audio

- [ ] Unmute microphone
- [ ] Speak into mic and check audio meter in Zoom/Teams
- [ ] Ask teammate to confirm audio levels are clear
- [ ] Mute again until talk starts

---

## 5 Minutes Before - Final Prep

### Mic Check

- [ ] Unmute microphone
- [ ] Test with recording teammate: "Can you hear me clearly?"
- [ ] Confirm no background noise, echo, or distortion
- [ ] Mute again

### Audio Output Levels

- [ ] Play a few seconds of `motion/out/intro.mp4`
- [ ] Confirm audio plays through speakers (not just headphones)
- [ ] Adjust volume so audience can hear clearly
- [ ] Close video player

### Close Distractions

- [ ] Close or quit Slack on primary display
- [ ] Close or quit email client on primary display
- [ ] Enable Do Not Disturb mode on macOS (Control Center > Focus > Do Not Disturb)
- [ ] Close any non-essential applications on primary display

### Confirm Water Nearby

- [ ] Place water bottle or glass within reach
- [ ] Preferably off-camera if video is on

### One More Claude Code Test

- [ ] Open terminal in `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/`
- [ ] Run `claude`
- [ ] Type `/context` and verify output looks clean
- [ ] Type `/exit`
- [ ] Leave terminal window open and ready

---

## At the Minute - Go Time

### Open Terminal for Demo

- [ ] Terminal is already open in `/Users/npeloquin/Documents/AI/Claude-ecosystem/demos/synthetic-subgraph/`
- [ ] Verify path with `pwd`
- [ ] Increase terminal font size for screenshare: `Cmd +` (3-4 times)
- [ ] Move terminal to center of primary display

### Have Fallback Files Ready on Second Monitor

- [ ] `demos/synthetic-subgraph/fallback/expected-output-step-1-plan.md`
- [ ] `demos/synthetic-subgraph/fallback/expected-output-step-2-schema-diff.md`
- [ ] `demos/synthetic-subgraph/fallback/expected-output-step-3-resolver.md`
- [ ] `demos/synthetic-subgraph/fallback/expected-output-step-4-test.md`
- [ ] These should be open in text editor or browser on second monitor

### Breathe

- [ ] Take three deep breaths
- [ ] Roll shoulders back
- [ ] Smile (even if nervous - it relaxes the voice)

### Start

- [ ] Unmute microphone
- [ ] Start screenshare (primary display only)
- [ ] Begin with cold open (first 3 beats from outline)
- [ ] "You've all used Copilot. This is not Copilot."

---

## If Things Go Wrong - Triage Card

### Deck won't load

**Symptom:** `http://localhost:8000` returns connection refused or 404

**Fix:**
1. Check if `python -m http.server 8000` is running in a terminal tab
2. If not running, navigate to `/Users/npeloquin/Documents/AI/Claude-ecosystem/slides/` and run `python -m http.server 8000`
3. Refresh browser
4. If still broken, use Chrome or Firefox (not Safari - some HTML/CSS features may not work)

### Motion clip won't play

**Symptom:** Video file missing or won't open

**Fix:**
1. Check if `motion/out/intro.mp4` (or other clip) exists: `ls motion/out/`
2. If missing, skip the clip and narrate the concept verbally
3. If file exists but won't play, check codec: QuickTime and Chrome should both support H.264
4. Fallback: describe the animation content as you would have shown it

### claude command hangs

**Symptom:** `claude` command does not respond or shows auth error

**Fix:**
1. Press `Ctrl+C` to cancel
2. Check AWS SSO login: `aws sso login --profile ailab`
3. Retry `claude` command
4. If still hanging, verify internet connection
5. If broken, switch to fallback screenshots and narrate the demo flow

### Scenario B goes sideways

**Symptom:** Claude proposes incorrect implementation, misses dataloader pattern, or gets stuck

**Fix:**
1. Do not panic - this is a teaching demo, not a magic show
2. Acknowledge to audience: "Claude missed the dataloader pattern here. This is where iteration comes in."
3. Pull up `fallback/expected-output-step-3-resolver.md` on second monitor
4. Read from the fallback: "Here's the correct implementation we'd expect. Notice the use of `loaders.LoaderFromContext(ctx)` to batch requests."
5. Continue with next step of demo
6. Mention in wrap: "When things go sideways, you iterate. That's part of the workflow."

### Tests fail in live demo

**Symptom:** `go test` shows failures

**Fix:**
1. This is expected in a stub repo - acknowledge it
2. Say: "These tests are failing because we're in a synthetic repo with stubbed services. In production, the test suite would be green."
3. Show the test file: `cat graph/schema.resolvers_test.go | head -30`
4. Point out test structure: "See the table-driven pattern? That's what matters."
5. Move on to commit step

### CI checks fail

**Symptom:** GitHub Actions or CI pipeline shows red X

**Fix:**
1. Expected in demo environment - note it
2. Say: "In a real environment, we'd see this pass. The stub repo doesn't have full CI wired up."
3. Show what the CI check does: `cat .github/workflows/test.yml`
4. Move to next section

### Totally stuck - escape hatch

**Symptom:** Demo is completely broken and unrecoverable

**Fix:**
1. Stop the live demo
2. Say: "Let's skip ahead to the key takeaway here."
3. Show fallback screenshot or transcript
4. Narrate the workflow as if it had worked
5. Jump to next slide or section
6. In Q&A, acknowledge: "The demo environment had an issue. Here's what we'd see in a working setup."

---

## Pre-Flight Complete

Once all items above are checked, you are ready to present. The most common failure point is the Scenario B dataloader implementation - be ready with the fallback resolver code. The narrowest time buffer is the 7-minute block from minute 45 to minute 52 (Scenario B live demo). If it runs long, you can compress the Scenario D screencast (minute 52-55) or cut the hooks example in minute 37.

Good luck.
