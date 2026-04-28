import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {fonts} from './tokens';

// Gibson .otf files live under brand-assets/ at the repo root. The
// README instructs the user to symlink brand-assets into public/
// so staticFile() can resolve them. If the symlink is missing, the
// font face will fail to load and the browser will fall back to
// the generic sans-serif stack.
const gibsonDir = 'brand-assets/Fonts/Gibson';

type Variant = {
  family: string;
  file: string;
  weight: string;
  style?: 'normal' | 'italic';
};

const variants: Variant[] = [
  {family: fonts.book, file: 'Gibson-Book.otf', weight: '300'},
  {family: fonts.regular, file: 'Gibson-Regular.otf', weight: '400'},
  {family: fonts.medium, file: 'Gibson-Medium.otf', weight: '500'},
  {family: fonts.semibold, file: 'Gibson-SemiBold.otf', weight: '600'},
];

let loadPromise: Promise<void> | null = null;

export const loadGibson = (): Promise<void> => {
  if (loadPromise) {
    return loadPromise;
  }
  loadPromise = Promise.all(
    variants.map((v) =>
      loadFont({
        family: v.family,
        url: staticFile(`${gibsonDir}/${v.file}`),
        weight: v.weight,
        style: v.style ?? 'normal',
        format: 'opentype',
      }).catch((err) => {
        // Swallow: if brand-assets aren't linked, fall back to the
        // generic sans-serif stack rather than crashing the render.
        // The fallback stack is set on the outer <AbsoluteFill> in
        // each composition.
        // eslint-disable-next-line no-console
        console.warn(`Gibson variant ${v.family} failed to load:`, err);
      }),
    ),
  ).then(() => undefined);
  return loadPromise;
};
