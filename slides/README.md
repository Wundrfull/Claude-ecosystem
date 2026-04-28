# Claude Code Team Primer — slide deck

Browser-based static deck. No build step. No framework.

## Run it

Best option (Safari-safe, fonts and fetches always work):

```
cd slides
python -m http.server 8000
```

Then open http://localhost:8000/ in Chrome, Firefox, or Safari.

Alternative: open `slides/index.html` directly in Chrome or Firefox. Safari blocks `fetch()` on `file://` URLs, so sections will not load; use the local server instead.

## Keyboard

| Key | Action |
|-----|--------|
| Right arrow / Space / PageDown | Next slide |
| Left arrow / PageUp | Previous slide |
| Home / End | First / last slide |
| Esc | Toggle overview (grid view, click a slide to jump) |
| S | Toggle speaker-notes panel |
| F | Toggle fullscreen |

## Structure

- `index.html` — entry point. Loads all sections via `fetch`.
- `css/brand.css` — CapTech tokens (Blue #005EB8, Dark Grey #333F48, Gibson font-face).
- `css/deck.css` — layout, slide transitions.
- `css/components.css` — reusable elements (stamps, three-levers, code blocks, callouts).
- `css/chrome.css` — footer, progress bar, overview grid, notes panel.
- `js/deck.js` — keyboard navigation and state.
- `sections/*.html` — one file per section of the outline. Each file contains several `<section class="slide">` elements.

## Motion placeholders

The Remotion teammate will replace `<div class="motion-placeholder" data-clip="...">` elements with `<video>` tags pointing at `../motion/out/*.mp4`. Clips currently placeheld:

- `intro` (0:00)
- `agentic-loop` (3:30)
- `context-rot` (28:30)
- `captech-stamp` (40:15)
- `scenario-d` (52:30, screencast, not Remotion)

## Demo fallbacks

Any live-demo slide has an `<img class="demo-fallback" data-for="..." src="...">` fallback pointing at `../demos/synthetic-subgraph/fallback/`. Replace the `TODO.png` once the screenshots are captured.

## Fonts

Gibson .otf files live at `../brand-assets/Fonts/Gibson/`. That folder is gitignored but present locally.
