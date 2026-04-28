import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from 'remotion';
import {colors, fonts} from '../brand/tokens';
import {loadGibson} from '../brand/fonts';
import {AgentLoopPulse} from '../sequences/AgentLoopPulse';

// 20-second side-by-side.
// Left: Copilot model (single-line ghost-text accept).
// Right: Claude Code agent loop cycling.

export const AgenticLoop: React.FC = () => {
  const [handle] = useState(() => delayRender('AgenticLoop: load fonts'));
  useEffect(() => {
    loadGibson().finally(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darkGrey,
        fontFamily: `${fonts.regular}, sans-serif`,
        color: colors.white,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Panel side="left" title="Copilot: complete" muted>
        <CopilotGhostText />
      </Panel>
      <Divider />
      <Panel side="right" title="Claude Code: delegate" accent={colors.captechBlue}>
        <AgentLoopPulse
          cycleSeconds={4}
          scale={1.05}
          accentColor={colors.captechBlue}
        />
      </Panel>
    </AbsoluteFill>
  );
};

const Divider: React.FC = () => (
  <div
    style={{
      width: 2,
      background: colors.mediumGrey,
      opacity: 0.25,
      alignSelf: 'stretch',
    }}
  />
);

type PanelProps = {
  side: 'left' | 'right';
  title: string;
  muted?: boolean;
  accent?: string;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({title, muted, accent, children}) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        color: muted ? colors.mediumGrey : colors.white,
      }}
    >
      <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
        {children}
      </div>
      <div
        style={{
          fontFamily: fonts.semibold,
          fontSize: 30,
          letterSpacing: 1.5,
          color: accent ?? colors.mediumGrey,
          marginTop: 32,
          textAlign: 'center',
        }}
      >
        {title}
      </div>
    </div>
  );
};

// Simulates a single line of code with ghost text. The ghost text
// appears, sits for ~1s, gets "accepted" (color shifts from muted to
// regular), then the cycle restarts. Meant to feel small relative to
// the right panel's agent loop.
const CopilotGhostText: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cycleFrames = fps * 5;
  const t = frame % cycleFrames;
  const phase = t / cycleFrames;

  const ghost = 'return user.email.toLowerCase();';
  const ghostChars = Math.min(ghost.length, Math.floor(phase * 2 * ghost.length));
  const accepted = phase > 0.55;
  const ghostOpacity = accepted
    ? interpolate(phase, [0.55, 0.75], [1, 1])
    : interpolate(phase, [0, 0.25], [0, 0.55], {extrapolateRight: 'clamp'});

  const prefix = 'const normalize = (user) => ';

  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontSize: 32,
        color: colors.lightGrey,
        whiteSpace: 'pre',
        lineHeight: 1.5,
        background: '#1f262c',
        padding: '28px 36px',
        borderRadius: 8,
        border: `1px solid ${colors.mediumGrey}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        minWidth: 540,
      }}
    >
      <div style={{color: colors.mediumGrey}}>// user.ts</div>
      <div>
        <span>{prefix}</span>
        <span
          style={{
            color: accepted ? colors.lightGrey : colors.mediumGrey,
            opacity: ghostOpacity,
            fontStyle: accepted ? 'normal' : 'italic',
          }}
        >
          {ghost.slice(0, ghostChars)}
        </span>
      </div>
    </div>
  );
};
