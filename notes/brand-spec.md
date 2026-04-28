# CapTech brand spec — distilled for Phase 3 production

Extracted from `brand-assets/Brand Guidelines/CapTech Brand Guidelines.pdf` (Version 02).

## Color palette

### Primary (use most)
| Role | Hex | Notes |
|------|-----|-------|
| **CapTech Blue** | `#005EB8` | Hero/accent color. Use on CTAs, key numbers, section headers. |
| Dark Grey | `#333F48` | Body text, headings on light backgrounds. |
| Medium Grey | `#888B8D` | Secondary text, captions, metadata. |
| Light Grey | `#D9D9D6` | Dividers, section backgrounds, disabled states. |

**Primary usage principle (from guidelines)**: "primary palette features whites and neutral grays, CapTech Blue brings color and vibrancy."

### Tertiary (sparingly, for accent only)
| Role | Hex | Notes |
|------|-----|-------|
| Yellow | `#FDDA24` | "Subtle accents of yellow serve as a natural complement." Use for highlights, warnings. |
| Dark Blue | `#003865` | Depth/authority accent. |
| Light Teal | `#68D2DF` | Soft accent, illustrations. |
| Sky Blue | `#00A5DF` | Data viz, motion graphics highlights. |

### Backgrounds
- Default: white (`#FFFFFF`) for slides
- Dark mode / hero slides: Dark Grey (`#333F48`) with white text and CapTech Blue accents

## Typography

**Gibson is the only typeface.** Humanist sans-serif. Files in `brand-assets/Fonts/Gibson/`:
- `Gibson-Book.otf` — headlines (lighter weight for elegance)
- `Gibson-Regular.otf` — body text default
- `Gibson-Medium.otf` — subheads, emphasized body
- `Gibson-SemiBold.otf` — descriptors, small caps labels, buttons
- Italic variants for captions

### Typographic hierarchy (from guidelines)
| Role | Font | Notes |
|------|------|-------|
| Headline | Gibson Book | Large, airy. "Opt for the lighter weights of Gibson for a more [elegant] feel." |
| Subhead | Gibson Medium | 4px spacing above, tighter than headline |
| Body | Gibson Regular | Default paragraph |
| Descriptor (labels, meta) | Gibson SemiBold | Small, often uppercase |
| Caption | Gibson Italic | Figure/image captions |

## How Phase 3 should apply this

**Slides**:
- Background: white default; Dark Grey for the cold-open title and section dividers
- Headlines: Gibson Book, CapTech Blue or Dark Grey
- Body text: Gibson Regular, Dark Grey on white or white on Dark Grey
- Key numbers (e.g. "77.2% vs 78.2%"): CapTech Blue, Gibson SemiBold, oversized
- The CapTech→client stamp corner element: Yellow for sandbox side, CapTech Blue for client side — gives the motif its own color language
- Code blocks: use a muted Medium Grey background with monospace (JetBrains Mono or Fira Code fallback; Gibson is not a monospace)
- CapTech logo (SVG, Blue variant) in footer of title slide and final slide only — not on every slide

**Remotion**:
- Primary animation color: CapTech Blue
- Accent for "new information" or "highlight" pulse: Yellow
- Backgrounds: dark mode (Dark Grey #333F48) reads better in motion graphics than white
- Gibson as the in-clip font. Load the .otf files via `@remotion/google-fonts` equivalent or local `staticFile()`
- Intro clip end-card: Dark Grey background, CapTech Blue logo SVG, white title text

**Logos to use**:
- `brand-assets/Logos/For Web - RGB/SVG/CapTech_Logo_RGB_CapTech Blue.svg` — on white backgrounds
- `brand-assets/Logos/For Web - RGB/SVG/CapTech_Logo_RGB_White.svg` — on Dark Grey backgrounds

## What NOT to do (from brand guidelines, implicit rules)

- Don't use any color outside this palette
- Don't use a different typeface
- Don't alter or typeset the tagline — use approved assets only
- Prefer primary logo over maker's mark; maker's mark is for favicons and social profile pics only
