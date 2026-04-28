import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../brand/tokens';

type Props = {
  text: string;
  // Characters per second for the typing effect.
  charsPerSecond?: number;
  // Delay in frames before typing begins.
  startFrame?: number;
  prompt?: string;
  fontSize?: number;
  showCursor?: boolean;
};

export const TerminalType: React.FC<Props> = ({
  text,
  charsPerSecond = 12,
  startFrame = 0,
  prompt = '$',
  fontSize = 44,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const typedCount = Math.min(
    text.length,
    Math.floor((elapsed / fps) * charsPerSecond),
  );
  const typed = text.slice(0, typedCount);

  // Blink the cursor on even half-second intervals.
  const cursorVisible =
    showCursor && Math.floor((frame / fps) * 2) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: `${fonts.mono}`,
        fontSize,
        color: colors.white,
        letterSpacing: 1,
        whiteSpace: 'pre',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <span style={{color: colors.skyBlue}}>{prompt}</span>
      <span>
        {typed}
        <span
          style={{
            display: 'inline-block',
            width: '0.55em',
            height: '1em',
            marginLeft: 2,
            background: cursorVisible ? colors.white : 'transparent',
            verticalAlign: '-0.15em',
          }}
        />
      </span>
    </div>
  );
};
