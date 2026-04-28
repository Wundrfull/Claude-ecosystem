import React, {useEffect, useState} from 'react';
import {staticFile, continueRender, delayRender} from 'remotion';

type LogoVariant = 'white' | 'blue' | 'grey';

const fileFor: Record<LogoVariant, string> = {
  white: 'brand-assets/Logos/For Web - RGB/SVG/CapTech_Logo_RGB_White.svg',
  blue: 'brand-assets/Logos/For Web - RGB/SVG/CapTech_Logo_RGB_CapTech Blue.svg',
  grey: 'brand-assets/Logos/For Web - RGB/SVG/CapTech_Logo_RGB_Logo Grey.svg',
};

type Props = {
  variant?: LogoVariant;
  height?: number;
  style?: React.CSSProperties;
};

export const Logo: React.FC<Props> = ({
  variant = 'white',
  height = 56,
  style,
}) => {
  const [handle] = useState(() => delayRender(`Logo (${variant})`));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const url = staticFile(fileFor[variant]);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`logo fetch: ${res.status}`);
        }
        setLoaded(true);
        continueRender(handle);
      })
      .catch(() => {
        // Missing brand-assets symlink is non-fatal: skip the logo.
        continueRender(handle);
      });
  }, [variant, handle]);

  if (!loaded) {
    return null;
  }

  return (
    <img
      src={staticFile(fileFor[variant])}
      alt="CapTech"
      style={{height, width: 'auto', ...style}}
    />
  );
};
