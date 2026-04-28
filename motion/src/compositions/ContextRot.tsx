import React, {useEffect, useMemo, useState} from 'react';
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

// 20s context-degradation chart.
//   x-axis: tokens (0 -> 1M)
//   y-axis: accuracy (arbitrary, flat then sloping down)
//   Yellow dot at 200K "sweet spot"
//   Flat stretch 0-200K, soft degradation past 500K

const CHART_W = 1280;
const CHART_H = 520;
const PAD_L = 80;
const PAD_R = 40;
const PAD_T = 40;
const PAD_B = 70;

// y values are "accuracy", 0.0 - 1.0 scaled into the chart.
// Sampled from the shape described in outline.md minute 28:30:
// flat 0-200K, essentially flat 200K-500K, soft slope past 500K.
const samples: {x: number; y: number}[] = [
  {x: 0, y: 0.78},
  {x: 0.05, y: 0.785},
  {x: 0.1, y: 0.782},
  {x: 0.15, y: 0.78},
  {x: 0.2, y: 0.784}, // 200K sweet spot
  {x: 0.3, y: 0.781},
  {x: 0.4, y: 0.778},
  {x: 0.5, y: 0.77},
  {x: 0.6, y: 0.755},
  {x: 0.7, y: 0.735},
  {x: 0.8, y: 0.71},
  {x: 0.9, y: 0.685},
  {x: 1.0, y: 0.655},
];

const toPx = (x: number, y: number) => {
  const px = PAD_L + x * (CHART_W - PAD_L - PAD_R);
  // y=1 is top. The visible y band is 0.6 - 0.85 for visual punch.
  const minY = 0.6;
  const maxY = 0.85;
  const normY = (y - minY) / (maxY - minY);
  const py = PAD_T + (1 - normY) * (CHART_H - PAD_T - PAD_B);
  return {px, py};
};

export const ContextRot: React.FC = () => {
  const [handle] = useState(() => delayRender('ContextRot: load fonts'));
  useEffect(() => {
    loadGibson().finally(() => continueRender(handle));
  }, [handle]);

  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Draw the line in over ~10s, then hold.
  const drawEnd = fps * 10;
  const drawProgress = interpolate(frame, [fps * 1.5, drawEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const path = useMemo(() => buildPath(samples, drawProgress), [drawProgress]);

  // Yellow sweet-spot dot appears once the line has reached 200K (x=0.2).
  const dotProgress = interpolate(drawProgress, [0.2, 0.25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dot200k = toPx(0.2, 0.784);

  const titleOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(
    frame,
    [drawEnd - fps, drawEnd],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const tailFade = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.darkGrey,
        color: colors.white,
        fontFamily: `${fonts.regular}, sans-serif`,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: tailFade,
      }}
    >
      <div
        style={{
          fontFamily: fonts.book,
          fontSize: 62,
          color: colors.white,
          opacity: titleOpacity,
          marginBottom: 24,
          letterSpacing: -0.5,
        }}
      >
        Context rot is real.
      </div>

      <svg width={CHART_W} height={CHART_H} style={{overflow: 'visible'}}>
        <Axes />
        <path
          d={path}
          stroke={colors.captechBlue}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {dotProgress > 0 ? (
          <g
            transform={`translate(${dot200k.px}, ${dot200k.py})`}
            opacity={dotProgress}
          >
            <circle r={16} fill={colors.yellow} />
            <circle r={28} fill="none" stroke={colors.yellow} strokeWidth={2} opacity={0.6} />
            <text
              x={0}
              y={-44}
              textAnchor="middle"
              fill={colors.yellow}
              style={{
                fontFamily: fonts.semibold,
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              sweet spot (200K)
            </text>
          </g>
        ) : null}
      </svg>

      <div
        style={{
          fontFamily: fonts.medium,
          fontSize: 24,
          color: colors.mediumGrey,
          marginTop: 18,
          opacity: captionOpacity,
          letterSpacing: 0.5,
        }}
      >
        Anthropic's own term. Source: platform.claude.com.
      </div>
    </AbsoluteFill>
  );
};

const Axes: React.FC = () => {
  const xTicks = [
    {x: 0, label: '0'},
    {x: 0.2, label: '200K'},
    {x: 0.5, label: '500K'},
    {x: 1.0, label: '1M'},
  ];

  return (
    <g>
      {/* Axes */}
      <line
        x1={PAD_L}
        y1={CHART_H - PAD_B}
        x2={CHART_W - PAD_R}
        y2={CHART_H - PAD_B}
        stroke={colors.mediumGrey}
        strokeWidth={2}
      />
      <line
        x1={PAD_L}
        y1={PAD_T}
        x2={PAD_L}
        y2={CHART_H - PAD_B}
        stroke={colors.mediumGrey}
        strokeWidth={2}
      />

      {/* x ticks */}
      {xTicks.map((t) => {
        const px = PAD_L + t.x * (CHART_W - PAD_L - PAD_R);
        return (
          <g key={t.label}>
            <line
              x1={px}
              y1={CHART_H - PAD_B}
              x2={px}
              y2={CHART_H - PAD_B + 8}
              stroke={colors.mediumGrey}
              strokeWidth={2}
            />
            <text
              x={px}
              y={CHART_H - PAD_B + 32}
              textAnchor="middle"
              fill={colors.lightGrey}
              style={{fontFamily: 'inherit', fontSize: 20}}
            >
              {t.label}
            </text>
          </g>
        );
      })}

      {/* axis labels */}
      <text
        x={(PAD_L + CHART_W - PAD_R) / 2}
        y={CHART_H - 8}
        textAnchor="middle"
        fill={colors.mediumGrey}
        style={{fontFamily: 'inherit', fontSize: 22, letterSpacing: 1}}
      >
        tokens in context
      </text>
      <text
        x={-((PAD_T + CHART_H - PAD_B) / 2)}
        y={24}
        textAnchor="middle"
        transform="rotate(-90)"
        fill={colors.mediumGrey}
        style={{fontFamily: 'inherit', fontSize: 22, letterSpacing: 1}}
      >
        accuracy
      </text>
    </g>
  );
};

// Build a smoothed path clipped to drawProgress (0-1 across the x domain).
function buildPath(
  points: {x: number; y: number}[],
  progress: number,
): string {
  if (progress <= 0) {
    return '';
  }
  const cutoff = progress;
  const clipped: {x: number; y: number}[] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.x <= cutoff) {
      clipped.push(p);
      continue;
    }
    // Interpolate to exactly the cutoff and stop.
    const prev = points[i - 1];
    if (prev) {
      const t = (cutoff - prev.x) / (p.x - prev.x);
      clipped.push({
        x: cutoff,
        y: prev.y + (p.y - prev.y) * t,
      });
    }
    break;
  }
  if (clipped.length === 0) {
    return '';
  }
  return clipped
    .map((p, i) => {
      const {px, py} = toPx(p.x, p.y);
      return `${i === 0 ? 'M' : 'L'} ${px.toFixed(2)} ${py.toFixed(2)}`;
    })
    .join(' ');
}
