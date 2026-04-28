import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from 'remotion';
import {colors, fonts} from '../brand/tokens';
import {loadGibson} from '../brand/fonts';
import {Logo} from '../brand/Logo';
import {TerminalType} from '../sequences/TerminalType';
import {AgentLoopPulse} from '../sequences/AgentLoopPulse';

// Intro timeline at 30fps (75s total = 2250 frames):
//   0s - 4s    Terminal prompt types "claude"
//   4s - 7s    Claude Code "spawns" (banner fades in below prompt)
//   7s - 55s   Agent loop pulse cycles
//  55s - 72s   Title card (Claude Code / Team Primer) with logo
//  72s - 75s   End-card hold

const SEC = 30;

export const Intro: React.FC = () => {
  const [handle] = useState(() => delayRender('Intro: load fonts'));
  useEffect(() => {
    loadGibson().finally(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darkGrey,
        fontFamily: `${fonts.regular}, sans-serif`,
        color: colors.white,
      }}
    >
      <Sequence from={0} durationInFrames={7 * SEC}>
        <TerminalScene />
      </Sequence>

      <Sequence from={4 * SEC} durationInFrames={4 * SEC}>
        <SpawnBanner />
      </Sequence>

      <Sequence from={7 * SEC} durationInFrames={48 * SEC}>
        <AgentLoopScene />
      </Sequence>

      <Sequence from={55 * SEC} durationInFrames={20 * SEC}>
        <TitleCard />
      </Sequence>
    </AbsoluteFill>
  );
};

const TerminalScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 180,
      }}
    >
      <TerminalType
        text="claude"
        charsPerSecond={3}
        startFrame={20}
        fontSize={72}
      />
    </AbsoluteFill>
  );
};

const SpawnBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({frame, fps, config: {damping: 20, stiffness: 90}});
  const opacity = interpolate(appear, [0, 1], [0, 1]);
  const y = interpolate(appear, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 180,
        paddingTop: 140,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          color: colors.skyBlue,
          fontFamily: fonts.medium,
          fontSize: 34,
          letterSpacing: 1.2,
        }}
      >
        Claude Code 1.7.x ready. Type your task and press enter.
      </div>
    </AbsoluteFill>
  );
};

const AgentLoopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, fps * 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 1, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp'},
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{alignItems: 'center', justifyContent: 'center', opacity}}
    >
      <div
        style={{
          fontFamily: fonts.semibold,
          textTransform: 'uppercase',
          letterSpacing: 3,
          color: colors.mediumGrey,
          fontSize: 22,
          marginBottom: 40,
        }}
      >
        The Claude Code loop
      </div>
      <AgentLoopPulse
        cycleSeconds={4}
        scale={1.25}
        accentColor={colors.captechBlue}
      />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 80}});
  const titleY = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 120,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: fonts.book,
            fontSize: 180,
            color: colors.white,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          Claude Code
        </div>
        <div
          style={{
            fontFamily: fonts.medium,
            fontSize: 54,
            color: colors.captechBlue,
            marginTop: 36,
            letterSpacing: 2,
          }}
        >
          Team Primer
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 96,
          bottom: 72,
          opacity,
        }}
      >
        <Logo variant="white" height={72} />
      </div>
    </AbsoluteFill>
  );
};
