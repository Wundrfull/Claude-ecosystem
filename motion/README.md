# motion

Remotion project that renders the four motion graphics clips for the
Claude Code Team Primer (April 29-30 2026).

## Compositions

| id | duration | size | fps | used at |
|---|---:|---|---:|---|
| `intro` | 75s | 1920x1080 | 30 | 0:00 cold open |
| `agentic-loop` | 20s | 1920x1080 | 30 | 3:30 |
| `context-rot` | 20s | 1920x1080 | 30 | 28:30 |
| `captech-stamp` | 20s | 1920x1080 | 30 | 40:15 |

## Prerequisites

- Node 18+
- The repo's `brand-assets/` directory must be on disk one level up
  from this folder. It is gitignored at repo root because the
  licensed material does not belong in version control. Fonts
  (`Gibson/*.otf`) and logo SVGs are pulled from there at build time.

## Install

```
npm install
```

Then link the brand assets into the Remotion static-file directory
(one-time, per checkout). `public/` is Remotion's served-static root;
the fonts loader and logo component resolve paths under it.

```
ln -s ../../brand-assets public/brand-assets
```

On Windows use `mklink /D public\brand-assets ..\..\brand-assets`.

## Preview (Remotion Studio)

```
npm run start
```

Opens the studio at http://localhost:3000. Pick a composition from
the left sidebar.

## Render

Single clip:

```
npm run render:intro
npm run render:agentic-loop
npm run render:context-rot
npm run render:captech-stamp
```

Output lands in `out/` (gitignored).

All four:

```
npm run render:all
```

## File layout

```
src/
  index.ts                   registerRoot
  Root.tsx                   <Composition> registrations for all 4 clips
  brand/
    tokens.ts                color + font constants
    fonts.ts                 Gibson font loader
    Logo.tsx                 CapTech logo (inline SVG, white variant)
  compositions/
    Intro.tsx                60-90s intro
    AgenticLoop.tsx          20s Copilot vs Claude Code
    ContextRot.tsx           20s degradation chart
    CaptechStamp.tsx         20s sandbox -> client-ready motif
  sequences/
    TerminalType.tsx         typing animation
    AgentLoopPulse.tsx       Plan -> Tool -> Observe pulse
```

## Notes

- Fonts load from `../brand-assets/Fonts/Gibson/*.otf` via the
  Remotion dev server's `public/` proxy (the loader resolves paths
  relative to the project).
- If `brand-assets/` is missing, the clips still render but fall
  back to system sans-serif and omit the logo.
