# Q&A Seeds for Claude Code Team Primer

If the room goes quiet, start here.

---

## 1. What do we do on the client side if they won't install Claude Code org-wide?

**Short answer**: Run Claude Code on your CapTech-issued machine with your own credentials, write the code, review it locally, then commit and push. Claude never touched client infrastructure.

**Long answer**: Claude Code runs on the engineer's machine, not the client's servers. The code you write ends up in the client's repo, but the tool that helped you write it lives on your laptop. If the client has a blanket ban on AI coding tools, check whether their policy is about where the tool runs or where the code ends up. Most enterprises care about code quality and IP ownership, not the authorship method. If they still say no, treat Claude Code as a CapTech-side prototyping tool. You draft the resolver in your sandbox, test it, understand it, then hand-write an equivalent in the client repo. Slower, but compliant.

**Refer them to**: Slide in "Responsible use + CapTech-client stamp" section (40:00-45:00), and the CapTech-side vs client-side table in research-r6-context-and-responsible-use.md.

---

## 2. How is Claude Code different from Cursor?

**Short answer**: Cursor is an editor with inline AI completion. Claude Code is an autonomous agent that plans across files, runs commands, and iterates without you in the loop.

**Long answer**: Cursor integrates tightly with VS Code and focuses on inline completion, tab-to-accept suggestions, and chat-in-the-sidebar workflows. Claude Code lives in the terminal (or web, or Desktop) and operates like a junior engineer: you delegate a task, it reads files, writes code, runs tests, checks results, and adjusts. Cursor is faster for small edits where you know exactly what to type. Claude Code is better when you need someone to figure out what to type. Both use Claude models under the hood, so the underlying intelligence is comparable, but the interaction model is fundamentally different. Think autocomplete vs delegation.

**Refer them to**: Slide "What Claude Code is (vs. Copilot)" (3:00-9:00). The same contrast applies to Cursor.

---

## 3. Can we version the CLAUDE.md in the client's repo, or does it need to be gitignored?

**Short answer**: Version it in the repo. CLAUDE.md is a behavior contract, not a secret. It belongs in version control like any other code standard.

**Long answer**: CLAUDE.md tells Claude how your team works, what conventions to follow, and what mistakes to avoid. If one engineer writes a CLAUDE.md rule that says "never edit generated.go by hand," every other engineer benefits when Claude reads that rule in their session. Versioning it in the repo means the whole team converges on the same agent behavior. Treat it like a linter config or a style guide. The only reason to gitignore CLAUDE.md is if it contains something client-specific you do not want in the shared history, but that is rare. Most teams commit it, review it in PRs, and iterate on it like they would a README. Some teams even put CLAUDE.md snippets in subdirectories (graph/CLAUDE.md, loader/CLAUDE.md) for domain-specific rules.

**Refer them to**: Section "CLAUDE.md and memory as behavior contracts" (22:00-28:00), and the community CLAUDE.md patterns in research-r3-community-framing.md.

---

## 4. Won't Claude just hallucinate the gqlgen config if we ask it to set one up?

**Short answer**: It might. Always ask Claude to cite the file and line number for any config field or API it references. If it cannot cite, it is guessing.

**Long answer**: Claude 4.x models have a knowledge cutoff around January 2025, so they know gqlgen's structure, but they can fabricate plausible-looking YAML keys or deprecated options. The defense is the cite-the-line rule: whenever Claude suggests a config change, require it to show you the docs or the example file it is drawing from. For gqlgen specifically, the safest approach is to point Claude at the existing gqlgen.yml in the client repo (if one exists) or at the official gqlgen.yml docs, and say "use this schema, do not improvise." If you are starting from scratch, scaffold with `go run github.com/99designs/gqlgen init`, then let Claude modify the generated config. That way you start from a known-good baseline, and Claude's edits are the only variable. Run `go run github.com/99designs/gqlgen generate` after every change to catch config errors immediately.

**Refer them to**: Section "Context hygiene + the load-bearing numbers" (28:00-35:00) for the general hallucination problem, and the gqlgen-specific guidance in research-r5-graphql-scenario.md.

---

## 5. What's the cheapest way to try /ultrareview given we're on Bedrock?

**Short answer**: You cannot run /ultrareview on Bedrock. It requires claude.ai authentication. Use it on the CapTech side with your personal or team claude.ai account.

**Long answer**: /ultrareview is a cloud-powered feature that runs in Anthropic's managed sandbox, so it needs claude.ai auth, not just an API key. Bedrock and Vertex customers cannot use it today. If your CapTech engagement is Bedrock-only for billing reasons, the workaround is to run /ultrareview on your local machine (not Bedrock) before pushing to the client repo. You get 3 free ultrareview runs as a Pro or Max subscriber (expires May 5, 2026), then it costs $5-$20 per review as extra usage. Alternatively, use the standard /review command (single-agent, local, free) for quick checks, and reserve /ultrareview for the PRs you are actually shipping to the client. If the client requires Zero Data Retention, /ultrareview is off the table entirely. In that case, manual code review and the local /security-review command are your best options.

**Refer them to**: Section "Command tour: April 2026 additions" (9:00-14:00), the /ultrareview slide, and the ZDR note in "Responsible use" (40:00-45:00).

---

## 6. Does /compact lose the conversation history, or can I still go back and see what Claude did earlier?

**Short answer**: /compact summarizes the history in place and keeps the session running. You lose the turn-by-turn detail, but the thread persists. Use /clear if you want the full history preserved.

**Long answer**: /compact condenses the conversation into a summary and frees up context tokens, but it does so destructively in the same session. You cannot scroll back and see the original tool call transcripts after a compaction. If you need a record of what Claude did (for a client deliverable, an audit, or debugging), run /export before /compact to save the full transcript to disk. /clear, by contrast, starts a new session but keeps the old one in your /resume history, so you can return to it later. The decision rule: compact when you are mid-task and need continuity but are running low on context; clear when the next task is unrelated and you want a clean slate. If you are unsure, check /context first to see how full you are.

**Refer them to**: Section "Context hygiene + the load-bearing numbers" (28:00-35:00), and the /clear vs /compact decision table in research-r6-context-and-responsible-use.md.

---

## 7. Can Claude Code connect to our internal GraphQL endpoint to introspect the schema, or do we need to copy the SDL manually?

**Short answer**: Claude can curl the endpoint if you give it permission, but you probably should not. Export the schema as SDL and commit it to the repo instead.

**Long answer**: If you allow Claude to run arbitrary bash commands and your machine has VPN access to the client's internal GraphQL endpoint, Claude can run a curl or use graphql-cli to introspect the schema. But this is risky for two reasons: (1) the introspection query and response go into Claude's context, which means the full schema (including potentially sensitive field names, internal IDs, and API surface) is sent to Anthropic's servers, and (2) if the client has strict network access controls, you may trigger alerts by scripting requests to internal endpoints. The safer pattern is to run the introspection yourself, save the result as schema.graphql in the repo, and point Claude at that file. Treat the schema as a checked-in artifact, version it, and refresh it when the upstream API changes. This keeps the schema in the codebase (where it is auditable and diffable) and avoids sending live client API traffic through Claude's tool calls.

**Refer them to**: Section "Responsible use + CapTech-client stamp" (40:00-45:00), specifically the "scope the bash allowlist so Claude cannot curl internal endpoints" bullet in research-r6-context-and-responsible-use.md, and the schema-grounding section in the same doc.

---

## Graceful exit for off-topic or unanswerable questions

If someone asks a question outside the scope of this talk (pricing negotiations with Anthropic, roadmap speculation, model internals, or features not yet released), use this template:

"That is a great question, but it is outside what I can answer with confidence today. For [pricing/contracts], your best path is [contact CapTech's Anthropic account rep]. For [roadmap/unreleased features], the public-facing info is at code.claude.com/docs and anthropic.com/news. For [model internals], Anthropic publishes research posts at anthropic.com/research. I want to make sure you get an authoritative answer, not my best guess."

Then offer to take it offline or point them to the repo README, which has links into the official docs.
