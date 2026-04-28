// Brand tokens extracted from notes/brand-spec.md.
// Keep this file the single source of truth for colors and font family
// names across all compositions.

export const colors = {
  captechBlue: '#005EB8',
  darkBlue: '#003865',
  darkGrey: '#333F48',
  mediumGrey: '#888B8D',
  lightGrey: '#D9D9D6',
  yellow: '#FDDA24',
  skyBlue: '#00A5DF',
  lightTeal: '#68D2DF',
  white: '#FFFFFF',
} as const;

// Font family names registered by src/brand/fonts.ts. Use these as the
// `fontFamily` string in any composition.
export const fonts = {
  book: 'Gibson Book',
  regular: 'Gibson Regular',
  medium: 'Gibson Medium',
  semibold: 'Gibson SemiBold',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
