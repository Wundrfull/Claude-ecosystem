# Timing Cues - Claude Code Team Primer (30-minute cut)

Single-page glance table for staying on schedule during the 30-minute presentation (~20 min content + ~10 min Q&A). Hard stop at 40:00.

---

## Master Timeline

| Target Min | Section | Slide Range | Status Line |
|----------:|---------|-------------|-------------|
| 0:00 | Cold open | 00 (2 slides) | "You've all used Copilot. This is not Copilot." |
| 1:30 | What Claude Code is | 01 (divider + 3 slides) | Copilot vs Claude loop; agentic-loop animation; name the three levers |
| 4:30 | Commands worth learning today | 02 (divider + 5 slides) | Plan Mode, /clear, /compact, /rewind, /memory — each with CSS-animated demo |
| 10:00 | Skills — structure and writing your own | 03 (divider + 6 slides) | Anatomy, progressive disclosure, frontmatter card, write-your-own, subagents+hooks aside |
| 16:30 | CLAUDE.md + auto memory | 04 (divider + 3 slides) | Behavior contract; five lines; auto-memory is new |
| 19:00 | Context hygiene | 05 (divider + 4 slides) | Anthropic quote; decision rule; 5K/25K cap; tokenizer gotcha |
| 22:30 | Responsible use + start today | 07 (divider + 3 slides) | Data policy; cite-the-line; five things to install tonight |
| 25:00 | Wrap | 10 (1 slide) | Three levers final callback, then Q&A |
| 26:00 | Q&A | — | Seeded questions ready if the room goes quiet |
| 40:00 | Hard stop | — | Recording ends |

---

## Gate Buffers (Checkpoints)

Glance at the clock at each gate. If you're outside the acceptable range, apply the recovery action.

| Gate | Ideal | Acceptable | Recovery Action |
|------|------:|-----------:|-----------------|
| End of cold open | 1:30 | 1:15–1:45 | If past 1:45, shorten the thesis pause; skip one beat of terminal narration |
| End of What Claude Code is | 4:30 | 4:15–4:45 | If past 4:45, drop the compare-shift line and move straight to the loop animation |
| End of Commands tour | 10:00 | 9:30–10:30 | If past 10:30, compress /rewind to 20 seconds; skip the checkpoint caveat |
| End of Skills | 16:30 | 16:00–17:00 | If past 17:00, drop the write-your-own walkthrough; keep frontmatter card |
| End of CLAUDE.md + memory | 19:00 | 18:30–19:15 | If past 19:15, cut the per-subdirectory slide; keep the five lines |
| End of Context hygiene | 22:30 | 22:00–22:45 | If past 22:45, drop the tokenizer gotcha; keep the decision rule |
| End of Responsible use | 25:00 | 24:30–25:30 | If past 25:30, skip hygiene checklist recap; deliver cite-the-line only |
| Start of Q&A | 26:00 | 25:30–26:30 | If past 26:30, compress wrap to "three levers — questions?" |
| End of Q&A | 40:00 sharp | — | Hard stop, recording ends |

---

## If You Are 1 Minute Ahead

You have a little breathing room. Apply in this priority order.

1. **Let the agentic-loop animation play a full 9-second cycle in silence** (section 01). It sells the concept harder than any line you can add.
2. **Add a second example to `/compact`** (section 02): show `/compact Focus on the API changes` and narrate why you'd bias the summary.
3. **Expand the skills write-your-own walkthrough** (section 03): add the "descriptions are behavior, not metadata" beat from the Superpowers finding.
4. **Read the five CLAUDE.md lines more slowly** (section 04). These are cultural; the room needs time.

Do NOT expand Q&A preemptively. If you finish early, pause at the thesis slide, repeat "three levers — questions?" and let silence work.

---

## If You Are 1 Minute Behind

Trim in this priority order. Cut #1 first, then #2, then #3 only if you are still behind at the next gate.

### Cut #1: Skills write-your-own walkthrough (section 03, ~60s)

Keep the frontmatter card. Skip the live-narrated skill scaffold. Say: "The scaffold is in the repo — `skills-lab/01-minimal/`. Copy it and rename."

### Cut #2: Tokenizer gotcha (section 05, ~30s)

Skip the 35% tokenizer slide. The decision rule is the load-bearing content, not the tokenizer line. Say: "One footnote — the new tokenizer uses more tokens per string; details in the repo."

### Cut #3: Hygiene checklist recap (section 07, ~30s)

Do not recite the six items. Point at the slide and say: "Six hygiene rules on screen. Placeholders for secrets, no `git add -A`, scrub logs, scope bash, exports are deliverables, `/security-review` on auth PRs."

---

## Section Transition Signals

Verbal cues to signal section boundaries. Helps the audience follow structure.

| Transition | Say This |
|------------|----------|
| Cold open → What Claude Code is | "Let me reset the mental model." |
| What Claude Code is → Commands | "Let's start with the lever you touch most: context. And the commands that decide what Claude sees." |
| Commands → Skills | "Commands are the knobs Anthropic shipped. Skills are the knobs you build yourself." |
| Skills → CLAUDE.md | "Skills are per-task. CLAUDE.md is the behavior contract for the whole codebase." |
| CLAUDE.md → Context hygiene | "Now the part that matters most on the client side." |
| Context hygiene → Responsible use | "One slide of policy. If you leave today with only one artifact, this is the one." |
| Responsible use → Wrap | "Three levers, one more time." |
| Wrap → Q&A | "Questions." |

---

## Hard Stops

| Event | Hard Stop | Why |
|-------|----------:|-----|
| Start Q&A | 26:30 latest | Must leave ~13 minutes for questions |
| End Q&A | 40:00 sharp | Recording ends, audience has next meeting |

If you hit 26:30 mid-section, stop mid-sentence, say "Let's open it up for questions," advance to the thesis slide, take questions.

---

## Timing Notes

- Total content: ~25 minutes. Q&A: ~13 minutes. Hard stop: 40 minutes.
- Most compressible: skills write-your-own walkthrough.
- Least compressible: context hygiene decision rule, five CLAUDE.md lines, thesis callbacks.
- Ideal gate check times: 1:30, 4:30, 10:00, 16:30, 22:30, 26:00.
- Say "three levers" out loud exactly three times: minute ~4, minute ~22, minute ~25. Do not skip.
