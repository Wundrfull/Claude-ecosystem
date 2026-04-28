# Speaker Notes: Claude Code Team Primer

One consolidated cue sheet for the 60+15 minute talk, April 29-30 2026. Read this start to finish once the day before, then skim the opening lines and exit lines the hour before you go live.

Use the outline as the source of truth for beats; this file tells you how to land them.

## Global reminders before you start

- You have 60 minutes for content and 15 for Q&A. Watch the clock at 22, 40, and 55.
- The throughline is three levers: context, capability, verification. Say the phrase at minute 7, minute 40, and minute 59. Do not skip any of them.
- Every tool, skill, and command gets a CapTech vs client stamp. If you introduce one without a stamp, go back and add it.
- Do not read bullets off slides. The bullets are there for the audience to follow along; your job is to narrate.
- If a demo breaks, do not apologize twice. Say what went wrong, pivot to fallback, move on.

---

## Section 1 | 0:00-3:00 | Cold open

**Time window**: 0:00 to 3:00. Budget 90 seconds for the clip and 90 seconds for the three beats. If the clip runs long, cut beat 2 to one sentence.

**Opening line**: "You have all used Copilot. This is not Copilot."

**Key beats**:
- Copilot is an inline-completion tool. Claude Code is an agent. That reframe is the whole talk.
- In the next hour you will see what it is, what is genuinely new in April 2026, and what you can use on the client side starting Monday.
- Everything that appears on screen carries a sandbox-vs-client-ready stamp. Watch for it. That stamp is the single practical artifact you leave with.

**Slide cues**: Remotion intro clip plays first. Title slide comes up right after. The CapTech-to-client stamp legend sits in the corner from the title slide onward.

**Landmines**:
- Do not oversell. You are not promising Claude Code replaces anyone.
- Do not get into pricing here. Pricing shows up at minute 10.
- Do not let the clip audio bleed into your first sentence. Wait the full beat after it ends.

**Exit line**: "Let me start by resetting the mental model, because if you are bringing your Copilot reflexes into this room, you are going to misread everything I show you."

---

## Section 2 | 3:00-9:00 | What Claude Code is (vs. Copilot)

**Time window**: 3:00 to 9:00. The single most important mental-model shift in the talk. Do not rush.

**Opening line**: "Copilot writes the next line. Claude Code writes the next pull request."

**Key beats**:
- Copilot model in 30 seconds: ghost text, accept or reject, one file, no state.
- Claude Code model in 90 seconds: delegate a task, Claude plans, reads files, edits, runs commands, reflects, iterates. It works across the codebase and persists across sessions through CLAUDE.md and memory.
- Surface tour in 60 seconds: terminal is primary but it runs in VS Code, JetBrains, Desktop, claude.ai/code, iOS. `claude --teleport` pulls a web session into your terminal. One session, many surfaces.
- The three levers in 90 seconds: context, capability, verification. Name them. Then tell the room the rest of the talk is a variation on these three.

**Slide cues**:
- Slide "Copilot model" is up for the first 30 seconds.
- Slide "Claude Code model" is up for 90 seconds while you narrate the agent loop.
- Agentic-loop motion clip plays at roughly 3:30, 20 seconds.
- "Three levers" slide comes up last and stays up through your exit line. This is the first of three times that slide appears.

**Landmines**:
- Do not get pulled into a feature tour here. The feature tour is the next section.
- Do not claim Claude Code is better than Copilot. Claim it is different. Let the audience draw the conclusion.
- If someone asks about Cursor, defer to Q&A. You have a seeded answer for it.

**Exit line**: "Keep those three levers in your head. Now let me show you what the Claude Code team shipped in the last 90 days, because most of it landed after your January knowledge cutoff."

---

## Section 3 | 9:00-14:00 | Command tour: April 2026 additions

**Time window**: 9:00 to 14:00. Five minutes, four headline commands plus a grab-bag. 75 seconds each on the headliners, 30 seconds for the grab-bag.

**Opening line**: "These four commands did not exist the last time most of you looked at Claude Code. Two of them change how you ship code."

**Key beats**:
- `/ultrareview`: multi-agent cloud review with independent verification. Runs 5 to 10 minutes. Pricing is 5 to 20 dollars per run after three free, free tier expires May 5. Client stamp: NO. Requires claude.ai auth. Does not work on Bedrock, Vertex, or Foundry. CapTech-sandbox only today.
- `/ultraplan`: draft a plan in the cloud, review in a browser with inline comments, then either execute in cloud (opens a PR) or teleport back to your terminal.
- `/autofix-pr`: cloud session that watches a PR, auto-fixes CI failures and review comments, replies on your behalf. Warning: can trigger Atlantis and Terraform Cloud comment-based automation. Client stamp: with explicit approval only.
- `/context`: visualizes context usage as a colored grid. Read-only. Safe to run anytime. This is your pre-flight check and it sets up the context-hygiene section at minute 28.
- Grab-bag: `/effort` with the new `xhigh` default (breaking change, everyone is burning more tokens per turn than they were in March), `/rewind` for checkpoint revert, `/branch` to fork a conversation, `/init` for a starter CLAUDE.md.

**Slide cues**: One slide per headline command with the stamp in the corner. The grab-bag is a single slide with four one-liners. Do not linger on the grab-bag slide.

**Landmines**:
- Do not demo `/ultrareview` here. It takes minutes to run. The screencast at minute 52 is the demo.
- Do not promise the free tier will be extended past May 5. It probably will be. We are not the ones promising it.
- When you say Bedrock, pause. Half the room works on Bedrock at the client. Let them register what that means for them.

**Exit line**: "That is the tool surface. Now let me show you what decides whether those tools help or hurt, starting with skills."

---

## Section 4 | 14:00-22:00 | Skills: writing and evaluating them

**Time window**: 14:00 to 22:00. Eight minutes. The user called this out as a deeper section. Budget 90 seconds for anatomy, 90 for the description rule, three minutes for the eval methodology, 60 seconds for the real skill example, 60 seconds of slack.

**Opening line**: "A skill is a markdown file with frontmatter that teaches Claude when and how to do a thing. Nothing more exotic than that."

**Key beats**:
- Anatomy: frontmatter plus markdown body, lives in `~/.claude/skills/<name>.md` or `.claude/skills/` per project. Invoked explicitly by slash command or implicitly by description match. Show `skills-lab/01-minimal/SKILL.md` as the one-slide example.
- The counterintuitive rule about descriptions. This is the surprising bit the audience will talk about at lunch. The description frontmatter field is a behavior lever, not metadata. If you describe the workflow in the description, Claude follows the description and skips the body. Superpowers proved this empirically: description reading "code review between tasks" caused Claude to do one review despite a body that mandated two. Rule: descriptions describe when to use, never what the skill does. Third-person triggers and symptoms only.
- How you know a skill works. The community has no formal evaluation framework. promptfoo is adjacent, not native. It can run a skill body concatenated with a query as a regression harness, but it cannot test whether Claude will choose to load the skill. So the methodology we propose is:
  1. Write three golden tasks with plain-English expected-behavior bullets before writing the skill.
  2. Run them without the skill in a fresh session. Capture the transcript as the RED baseline.
  3. Write the skill to target the baseline failures.
  4. Re-run the golden tasks. Require GREEN on the previously failing bullets.
  5. Pressure test: run each golden task three times to catch nondeterminism.
- Show `skills-lab/03-eval-harness/` with the golden tasks and `test-prompts.json` (modeled on `huashu-design/test-prompts.json`: id, prompt, expected, tests).
- The real skill example: `~/.claude/skills/graphqlstagereport.md`. A working chunked-write skill from this user's own projects. Explain the chunked-write pattern briefly: it dodges the 4096 output token cap we hit writing this deck's research. Community-evolved pattern, not in Anthropic's docs.

**Slide cues**:
- Slide "Anatomy of a skill" for the first 90 seconds with the minimal SKILL.md on screen.
- Slide "Descriptions are behavior" for the next 90. Keep the Superpowers example quote on screen.
- Slide "Golden-task methodology" for three minutes. This is the slide people photograph. Pause on it.
- Last slide: the real skill. Stay on it through your exit line.

**Landmines**:
- Do not read the superpowers quote verbatim twice. Once out loud is enough. Let the slide carry it.
- Do not get dragged into a live skill write. If asked, defer: "I will put the scaffold in the repo."
- Do not claim promptfoo tests skills. It does not. It tests prompts. That distinction matters to anyone who has used it.
- The chunked-write pattern is easy to oversell. It is a workaround, not a triumph. Treat it as such.

**Exit line**: "Skills tell Claude how to do a thing. CLAUDE.md tells Claude how you work. That is the next piece."

---

## Section 5 | 22:00-28:00 | CLAUDE.md and memory as behavior contracts

**Time window**: 22:00 to 28:00. Six minutes. 90 seconds on the reframe, 60 seconds reading the five lines aloud, 90 seconds on the memory iteration pattern, 60 seconds on per-subdirectory files, 30 seconds on the gqlgen rule (said twice), 30 seconds of slack.

**Opening line**: "Treat CLAUDE.md as a constitution, not a readme. The difference matters."

**Key beats**:
- The reframe: top public CLAUDE.md files (anthropics/claude-code, cloudflare/agents, humanlayer, obra/superpowers, langchain-ai/langchain) are not documentation. They are behavior contracts. Forbidden phrases, precedence rules, escalation triggers, tone rules.
- Five lines that appear in most of them, read aloud from the slide:
  - "Before writing code, state the plan."
  - "Never run git push --force without explicit confirmation."
  - "If a test was passing and now fails, stop and ask before modifying the test."
  - "When unsure, ask one question rather than guessing."
  - "Do not add dependencies without asking."
- Memory iteration pattern: CLAUDE.md is a living document. End-of-session habit: ask Claude to propose edits based on mistakes from this session. Version it in the repo. Every edit goes through code review like any other code.
- Per-subdirectory CLAUDE.md: Anthropic documents it, the community underuses it. On a gqlgen subgraph with multiple domains, a `graph/CLAUDE.md` with resolver conventions and a `loader/CLAUDE.md` with dataloader patterns scales better than one monolith.
- The single most important CLAUDE.md line for gqlgen. Say it twice, slowly: "Regenerate code: `go run github.com/99designs/gqlgen generate`. Never edit generated files by hand." This one line prevents the single most common catastrophic mistake on a gqlgen project.

**Slide cues**:
- Slide "CLAUDE.md as constitution" for the opening.
- Slide "Five lines" is up during the read-aloud. Do not skip any of the five.
- Slide "Per-subdirectory" shows a tree diagram with two CLAUDE.md files highlighted.
- Final slide has the gqlgen line in 48-point monospace. Stand to the side; do not block it.

**Landmines**:
- Do not read the five lines at high speed. These are cultural. Give the audience time to absorb them.
- Do not promise a CapTech-standard CLAUDE.md template in this talk unless it is actually in the repo by showtime. Open question #2 in the outline is unresolved; confirm before you stand up.
- Do not conflate CLAUDE.md with memory files. They are related but different. If asked, memory is the user-level file at `~/.claude/memory`; CLAUDE.md is per-project.

**Exit line**: "CLAUDE.md decides what Claude does. Context hygiene decides whether it can still think straight while doing it. That is the next piece, and it is the one you are going to want to take notes on."

---

## Section 6 | 28:00-35:00 | Context hygiene and the load-bearing numbers

**Time window**: 28:00 to 35:00. Seven minutes. The user flagged this as load-bearing. Give the team concrete numbers and one decision rule they can apply Monday morning.

**Opening line**: "A 900k-token request costs the same per token as a 9k-token request. It does not perform the same. Anthropic itself calls the drop context rot."

**Key beats**:
- The number to say aloud: Sonnet 4.5 scored 77.2% on SWE-bench Verified at 200K context and 78.2% at 1M. Essentially flat. Anthropic documents the effect as context rot and says verbatim: "as token count grows, accuracy and recall degrade." You are paying for 1M tokens and cashing in usable performance on a much smaller slice.
- Show the context-awareness snippet Claude sees internally on the slide:
  ```
  <budget:token_budget>1000000</budget:token_budget>
  <system_warning>Token usage: 35000/1000000; 965000 remaining</system_warning>
  ```
- Context-rot motion clip plays at roughly 28:30, 20 seconds. Accuracy stays flat for a long stretch, then erodes. It is a slope, not a cliff.
- The decision rule, on a slide, read aloud:
  - If the next thing you are going to do is unrelated to what you just did, `/clear`.
  - If it is related and you need continuity, `/compact`.
  - If you are not sure, `/context` first, then decide.
  - Quit and re-launch only when you suspect the session picked up a bad assumption. `/compact` will summarize that bad assumption into the summary and it persists.
- What survives compaction: skills and memory re-attach, but each skill is capped at the first 5K tokens post-compaction, inside a 25K total budget. Huge skill files lose their tails after a compact. Keep skills short.
- Auto-compaction trigger: roughly 95% of context. Override with `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE`. 80 is a sensible value for long-running work.
- Opus 4.7 tokenizer gotcha: the new tokenizer uses up to 35% more tokens for the same text. If you migrated from 4.6, your daily spend went up by default. Budget for it.

**Slide cues**:
- Slide "Context rot" with the SWE-bench numbers and the Anthropic quote.
- Slide "Context awareness" with the budget snippet in monospace.
- Motion clip at 28:30.
- Slide "Decision rule" stays up for 90 seconds. Do not paraphrase the rule. Read it.
- Slide "Compaction survivals" for the 5K cap detail.
- Final slide with the tokenizer gotcha in bold.

**Landmines**:
- Do not say the 1M context is "useless." It is not. It is useful for endurance, not fine-grained recall.
- Do not promise specific savings from the autocompact override. Say "sensible" and move on.
- The tokenizer point is easy to oversell into FUD. Say it once, clearly, with the 35% number, then move on. Do not editorialize.
- If someone asks "what is the right value for `CLAUDE_CODE_AUTOCOMPACT_PCT_OVERRIDE`?" answer 80 and move on. Do not extemporize.

**Exit line**: "Once you have the context under control, the next question is what helpers you let into the session. That is subagents and hooks."

---

## Section 7 | 35:00-40:00 | Subagents and hooks (aware-only)

**Time window**: 35:00 to 40:00. Five minutes. 150 seconds on subagents, 150 on hooks. This is aware-only, not deep. Resist the urge to go deeper.

**Opening line**: "Two features that scale what one Claude Code session can do. I will cover each in about two minutes so you recognize them when you see them, not so you can teach them."

**Key beats**:
- Subagents: a focused helper agent you spawn mid-session. Own context window. Reports back to you. Anthropic frames this as parallelism. The community has shown subagents are also a quality gate: a fresh subagent per task with a spec-compliance reviewer and a code-quality reviewer. Token-expensive; only worth it for larger tasks.
- Show one example on screen: "Spawn a code reviewer subagent on these three files." Result comes back summarized. Do not trust the summary; inspect the diff. Say that explicitly.
- Hooks: shell commands that run in response to tool-call events. `PreToolUse`, `PostToolUse`, `TeammateIdle`, `TaskCompleted`. Exit code 2 sends feedback to Claude and keeps it working.
- One concrete hook example on screen: a `PreToolUse` hook that blocks `git push --force` without an explicit flag. This enforces the CLAUDE.md rule mechanically. Culture belongs in CLAUDE.md; enforcement belongs in hooks.
- Stamps: subagents are generally client-ready (they inherit your permissions). Hooks are client-ready, but the commands they run need audit before you ship them to a client repo.

**Slide cues**:
- Slide "Subagents" with the quality-gate example on screen for the first 150 seconds.
- Slide "Hooks" with the `git push --force` block hook in monospace for the next 150.
- Both slides have the stamp in the corner with the "audit required" caveat on hooks.

**Landmines**:
- Do not demo a subagent live. It takes too long and eats tokens.
- Do not imply hooks are a replacement for code review. They are a safety net.
- If someone asks about agent teams, defer to the 55:00 section where you cover them. This is subagents. Different thing.

**Exit line**: "Everything I have shown you so far is capability. The next five minutes is about what we choose not to do with it."

---

## Section 8 | 40:00-45:00 | Responsible use and the CapTech-to-client stamp

**Time window**: 40:00 to 45:00. Five minutes. 60 seconds on data policy, 90 on the hygiene checklist, 20 for the clip, 60 for the cite-the-line habit, 30 on ZDR.

**Opening line**: "One slide of policy. If you leave today with only one artifact, this is the one I want it to be."

**Key beats**:
- Anthropic's data policy, quoted: "By default, we will not use your inputs or outputs from our commercial products to train our models." The exception is the thumbs-up and thumbs-down feedback buttons. Action item: Team and Enterprise admins should disable feedback submission via Organization settings, Data and Privacy, "Rate chats." Do this once, org-wide, before touching client data.
- API-key and secret hygiene checklist (read off the slide briefly, do not recite):
  1. Never paste real API keys, OAuth secrets, or bearer tokens. Use placeholders.
  2. Never commit `.env`, `credentials.json`, anything under `~/.aws/`. Explicit filenames only, never `git add -A`.
  3. Scrub logs before pasting. Error traces leak hostnames, IPs, session IDs.
  4. Scope the bash allowlist so Claude cannot curl internal endpoints.
  5. Treat `/export` transcripts as client deliverables.
  6. Run `/security-review` before every PR that touches auth or data flow.
- CapTech-stamp motion clip plays at roughly 40:15, 20 seconds. Sandbox-side loose, client-side strict. Say the line: "The stricter policy applies on the client-billed side, always."
- The single highest-ROI habit: cite the file and line. Whenever Claude references a function, type, or GraphQL field, require a path and line number. If it cannot cite, it is guessing. Put it in CLAUDE.md. Cheapest insurance against shipping a hallucinated Apollo hook or phantom schema field.
- ZDR note: Zero Data Retention is available as a separate arrangement. Negotiate before code if the client requires it. Caveat: ZDR disables `/ultrareview` and `/ultraplan` because they run in a cloud sandbox under claude.ai auth.

**Slide cues**:
- Slide "Data policy" with the Anthropic quote in block quote.
- Slide "Hygiene checklist" with the six numbered items.
- Motion clip at 40:15.
- Slide "Cite the line" in large type. This is the one you want them to photograph.
- Slide "ZDR tradeoff" as the closer.

**Landmines**:
- Do not recite the checklist word for word. Summarize: "Placeholders for secrets, never `git add -A`, scrub logs, scope bash, treat exports as deliverables, `/security-review` on PRs touching auth." Move on.
- Do not promise that ZDR is turnkey. It is a contracted arrangement. If asked, defer to account manager.
- The "stricter policy always" line is a soundbite. Say it once, do not repeat it twice in a row.
- The second instance of the "three levers" callback is supposed to land here. Call the slide up when you say "context, capability, verification" in the cite-the-line beat. Verification is the third lever and you are showing its highest-ROI instance.

**Exit line**: "Enough policy. Let's see it actually do the job."

---

## Section 9 | 45:00-52:00 | Scenario B live demo (consumer field addition)

**Time window**: 45:00 to 52:00. Seven minutes. 30 seconds setup, five minutes demo, 90 seconds of narration and fallback contingency.

**Opening line**: "We have a synthetic gqlgen subgraph that mirrors the real client's structure. Consumer team just requested two new fields on the Product type. Let's watch Claude work."

**Key beats**:
- Setup: open Claude Code in `demos/synthetic-subgraph/`. Run `/context` first. Show that it is mostly empty. This sells the point about context hygiene from 15 minutes ago.
- The prompt, from `DEMO-SCRIPT-B.md`: "A consumer team needs two new fields on the Product type: `averageRating: Float` (nullable) and `reviewCount: Int!`. Read the CLAUDE.md and schema, then propose a plan before making any changes."
- Claude reads CLAUDE.md, reads schema, proposes a plan: schema edit, regen, resolver update using the ReviewStatsLoader dataloader, test.
- Approve the plan. Claude edits the schema, runs `go run github.com/99designs/gqlgen generate`, implements the resolver using `loaders.LoaderFromContext(ctx).ReviewStatsLoader.Load(obj.ID)`, writes a table-driven test.
- Run the test. Show it passing (or acknowledge if it doesn't; stub repo may have issues).
- Show the diff. Point out: Claude respected the "never edit generated files" CLAUDE.md line. It only touched handwritten files. It used the dataloader pattern because CLAUDE.md documented it.

**Slide cues**:
- This is live terminal. No slides.
- Have the DEMO-SCRIPT-B open on second monitor.
- Have `fallback/FALLBACK-PLAN.md` open on second monitor as well.

**Narration during the demo** (do not skip these, they are the teaching moments):
- "Watch how it reads the CLAUDE.md first. That is the three levers in action."
- "Notice it is citing file paths when it describes the plan. That is the cite-the-line rule we talked about five minutes ago."
- "If it tried to edit generated.go, CLAUDE.md would have caught it."
- "It used a dataloader without me asking. That is because CLAUDE.md documents the pattern with a code example."

**Landmines**:
- Do not start typing before the room is ready. Wait for the transition to land.
- If Claude takes more than 45 seconds on any step, fill silence with narration. Do not apologize.
- If Claude calls ReviewsClient directly instead of the dataloader, use the scripted follow-up: "I noticed the implementation calls ReviewsClient in a loop. Can you use the ReviewStatsLoader from `internal/loaders` instead?" Do not scold.
- If something catastrophic fails, pivot to fallback screenshots in `demos/synthetic-subgraph/fallback/` and say: "Here is what this looks like when it works. Let's walk through it frame by frame." Do not try to debug live.
- If the CI flow starts in a way that might trigger hooks we do not want, say "let me pause that" and pivot. Better to break narrative than to ship a weird commit.

**Exit line**: "Live was the easy demo. Now watch the one that actually makes your on-call shift shorter."

---

## Section 10 | 52:00-55:00 | Scenario D screencast (CI/PR triage)

**Time window**: 52:00 to 55:00. Three minutes. 20 second setup, two minute screencast, 30 second caveats, 10 second of slack.

**Opening line**: "Same subgraph. A PR was opened, CI is failing with a codegen-drift error. Watch Claude take it from red to green without us in the loop."

**Key beats**:
- The screencast, pre-recorded from `DEMO-SCRIPT-D.md`:
  1. CI log on screen showing the drift error.
  2. `/autofix-pr` runs. Claude detects the PR from the current branch and investigates.
  3. Claude posts a comment, pushes the regen, CI goes green.
  4. Then `/ultrareview` on the cleaned PR: multi-agent review, findings with cited file and line references.
  5. End on a finding with a cited line. Tie back out loud: "That is cite-the-line, automated."
- Caveats slide after the clip:
  - `/autofix-pr` is a research preview. Behavior will change.
  - `/ultrareview` requires claude.ai auth. Does not work on Bedrock. CapTech-sandbox only today.
  - Both commands can trigger comment-based automation (Atlantis, Terraform Cloud). Approve per-client before using.

**Slide cues**:
- The screencast is the slide. Full-bleed video.
- Caveats slide comes up the moment the clip ends.

**Landmines**:
- Do not play it live from the cloud. Pre-recorded only. We decided this for a reason.
- Do not talk over the important frames in the clip. Pause. Let the audience read the CI log.
- When you name Bedrock, pause again. Same half of the room. Let it land.

**Exit line**: "Two demos done. Before I let you go, there are two things you will hear about in the next six months that I want you to recognize when you see them."

---

## Section 11 | 55:00-60:00 | Agent teams, MCP, and wrap

**Time window**: 55:00 to 60:00. Five minutes. 90 seconds on agent teams, 60 on MCP, two minutes on the wrap and the five install items, 30 seconds of slack.

**Opening line**: "Two names you will hear a lot in the next six months. I am covering them in one slide each so you recognize them, not so you can use them Monday."

**Key beats**:
- Agent teams (aware): like subagents but teammates can message each other directly and share a task list. This presentation was built using one: six Sonnet 4.6 researchers and an Opus 4.7 lead. Show a one-line `TeamCreate` example and the architecture diagram. Stamp: experimental, token-heavy, not expected on-client any time soon.
- MCP (aware, then move on): open standard for connecting AI to external data sources. Useful at CapTech. Client will not allow it. Mention the name so the audience recognizes it later. Move on. The repo README has a link to Anthropic's MCP docs for anyone curious.
- Wrap, back to the thesis: three levers. Context, capability, verification. This is the third and final instance of the slide. Point at it. Say the words.
- Five things to install tonight (slide):
  1. Claude Code, if you do not have it.
  2. A CapTech-standard starter CLAUDE.md. Link in the repo.
  3. Four superpowers skills: `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `using-git-worktrees`.
  4. The org feedback-disable setting if you are an admin.
  5. A habit of running `/context` at the start of anything you are about to do for real.
- Point at the repo link. Reference motion clips are in `motion/`. Scenario scripts are in `demos/`.
- "Questions?"

**Slide cues**:
- Slide "Agent teams" with the architecture diagram.
- Slide "MCP" for a single beat. Do not linger.
- Slide "Three levers" for the third and final time. Match icon, match placement.
- Slide "Five things tonight" is the final content slide.
- Closing slide with the repo link in large type.

**Landmines**:
- Do not get drawn into an MCP deep dive. The client will not allow it. Further discussion is a waste.
- Do not promise what you have not built. The CapTech-standard CLAUDE.md template must exist in the repo by showtime or you cannot reference it in item 2. Confirm with the lead.
- Do not end by saying "any questions?" with rising intonation. Say "questions" and stop talking. Silence is fine. The moderator will take over.

**Exit line**: "Questions."

---

## Q&A | 60:00-75:00 | Prep notes

**Opening posture**: You are not done teaching. The same three levers still apply. If an answer starts to ramble, cut yourself off and invoke the three levers.

**Seeded questions** (ready in `rehearsal/qa-seeds.md` if the room goes quiet):
1. "What do we do on the client side if they will not install Claude Code org-wide?" Answer: per-seat installs with CapTech laptops, no git credentials on client machines, scope the bash allowlist narrowly.
2. "How is Claude Code different from Cursor?" Answer: Cursor is an IDE with inline completion and chat. Claude Code is an agent that lives outside the IDE and runs across surfaces. Cursor agent mode is narrowing the gap but the two have different opinionations about review and verification.
3. "Can we version the CLAUDE.md in the client's repo or does it need to be gitignored?" Answer: version it. It is non-sensitive. Review it like any other file.
4. "Will Claude just hallucinate the gqlgen config if we ask it to set one up?" Answer: yes, if you let it. Cite the file and line. Show the generated config from the last working version. Then validate with `gqlgen generate` and compile.
5. "What's the cheapest way to try `/ultrareview` given we're on Bedrock?" Answer: you cannot use it on Bedrock. Spin up a claude.ai auth on a CapTech-only test repo, use the three free runs, and document what it found so the team does not need to re-run.

**Landmines**:
- Do not speculate on unreleased features. If asked, say "I do not know, and I do not want to guess on the record."
- Do not commit CapTech to a policy you have not cleared with the lead. For anything org-wide, say "we will take that back and confirm."
- If pricing comes up, cite the research numbers directly. Do not round up or down. Check `notes/research-r6-context-and-responsible-use.md` before the talk so the numbers are fresh.
- If someone asks about the 35% tokenizer increase, confirm the number is "up to 35%" and varies by text. Do not claim it is 35% flat.

**Highest-likelihood questions you have not seeded**:
- "How do we track spend per client engagement?" Answer: `/usage` daily, Claude Console usage dashboard weekly, tag sessions by client in `/export` filenames. We will instrument this before the first client invoice.
- "Is our data used for training if we use the API via Bedrock?" Answer: no. Anthropic's commercial terms apply, feedback buttons do not exist on Bedrock, and Bedrock has its own data-governance layer on top.
- "What is the latency on `/ultrareview`?" Answer: 5 to 10 minutes typical. Not interactive. Use it as a pre-merge gate, not a dev-loop tool.

**Closing**: Thank the room. Point at the repo link one more time. Hand back to the moderator.

---

## Rehearsal priorities

Run the full deck twice before showtime. On the second pass, time each section against the budget above and flag anything more than 30 seconds over. The command tour (9:00-14:00) and context hygiene (28:00-35:00) are the two sections most likely to run long; compress the grab-bag and the 5K cap detail first if you need to make up time.

Run the Scenario B demo three times in a dry run. Practice the dataloader fallback prompt cold so you can deliver it without pausing.

Read the five CLAUDE.md lines and the context-hygiene decision rule aloud at least once before you walk in. These are the two moments where verbatim delivery matters.

