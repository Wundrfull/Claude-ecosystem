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

// 20s CapTech -> client stamp motif.
//   0s - 3s   Split appears, labels fade in
//   3s - 10s  Yellow sandbox bullets pop in left
//  10s - 17s  Blue client-ready bullets pop in right
//  14s - 18s  Arrow draws across: "validate, then transfer"
//  18s - 20s  Hold

const SANDBOX_BULLETS = [
  'unlimited tokens',
  '/ultrareview OK',
  'Opus 4.7 default',
  'MCP allowed',
];

const CLIENT_BULLETS = [
  'budgeted tokens',
  'no MCP',
  'cite-the-line',
  '/security-review before PR',
];

export const CaptechStamp: React.FC = () => {
  const [handle] = useState(() => delayRender('CaptechStamp: load fonts'));
  useEffect(() => {
    loadGibson().finally(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darkGrey,
        color: colors.white,
        fontFamily: `${fonts.regular}, sans-serif`,
      }}
    >
      <Sequence from={0} durationInFrames={3 * 30}>
        <Headline />
      </Sequence>

      <Sequence from={0}>
        <Stamps />
      </Sequence>

      <Sequence from={14 * 30} durationInFrames={6 * 30}>
        <TransferArrow />
      </Sequence>
    </AbsoluteFill>
  );
};

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 80,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: fonts.book,
          fontSize: 52,
          letterSpacing: -0.5,
        }}
      >
        CapTech sandbox &rarr; client-ready
      </div>
    </AbsoluteFill>
  );
};

const Stamps: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '180px 140px 80px',
      }}
    >
      <StampCard
        side="left"
        label="CapTech sandbox"
        tone={colors.yellow}
        bullets={SANDBOX_BULLETS}
        // Left side bullets appear between 3s and 10s.
        bulletStart={3 * 30}
      />
      <StampCard
        side="right"
        label="Client-ready"
        tone={colors.captechBlue}
        bullets={CLIENT_BULLETS}
        bulletStart={10 * 30}
      />
    </AbsoluteFill>
  );
};

type StampProps = {
  side: 'left' | 'right';
  label: string;
  tone: string;
  bullets: string[];
  bulletStart: number;
};

const StampCard: React.FC<StampProps> = ({side, label, tone, bullets, bulletStart}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - (side === 'left' ? 15 : 30),
    fps,
    config: {damping: 18, stiffness: 90},
  });
  const tx = interpolate(enter, [0, 1], [side === 'left' ? -80 : 80, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateX(${tx}px)`,
        opacity,
        width: 620,
        minHeight: 520,
        border: `4px solid ${tone}`,
        borderRadius: 24,
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          padding: '8px 18px',
          borderRadius: 999,
          background: tone,
          color: side === 'left' ? colors.darkGrey : colors.white,
          fontFamily: fonts.semibold,
          fontSize: 22,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>

      <ul style={{margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 18}}>
        {bullets.map((b, i) => {
          const appearFrame = bulletStart + i * (fps * 0.6);
          const bEnter = spring({
            frame: frame - appearFrame,
            fps,
            config: {damping: 20, stiffness: 120},
          });
          const by = interpolate(bEnter, [0, 1], [12, 0]);
          const bOpacity = interpolate(bEnter, [0, 1], [0, 1]);
          return (
            <li
              key={b}
              style={{
                opacity: bOpacity,
                transform: `translateY(${by}px)`,
                fontFamily: fonts.medium,
                fontSize: 32,
                color: colors.white,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: tone,
                  flex: '0 0 auto',
                }}
              />
              {b}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const TransferArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const labelOpacity = interpolate(frame, [fps * 0.8, fps * 1.6], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Arrow sits horizontally across the middle gap.
  const WIDTH = 1920;
  const y = 540;
  const x1 = 780;
  const x2 = 1140;
  const cx = x1 + (x2 - x1) * draw;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={WIDTH} height={1080} style={{overflow: 'visible'}}>
        <line
          x1={x1}
          y1={y}
          x2={cx}
          y2={y}
          stroke={colors.white}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {draw >= 0.98 ? (
          <polygon
            points={`${x2},${y} ${x2 - 22},${y - 14} ${x2 - 22},${y + 14}`}
            fill={colors.white}
          />
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: y - 70,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: fonts.semibold,
          fontSize: 28,
          color: colors.white,
          letterSpacing: 2,
          textTransform: 'uppercase',
          opacity: labelOpacity,
        }}
      >
        validate, then transfer
      </div>
    </AbsoluteFill>
  );
};
