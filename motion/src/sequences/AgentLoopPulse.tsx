import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts} from '../brand/tokens';

type Stage = {
  label: string;
  sub?: string;
};

type Props = {
  // Seconds per full Plan -> Tool -> Observe -> (back to Plan) cycle.
  cycleSeconds?: number;
  // Starting frame relative to the Sequence this is mounted into.
  startFrame?: number;
  scale?: number;
  accentColor?: string;
};

const STAGES: Stage[] = [
  {label: 'Plan', sub: 'decide next step'},
  {label: 'Tool Use', sub: 'Read / Edit / Bash'},
  {label: 'Observe', sub: 'read result'},
];

export const AgentLoopPulse: React.FC<Props> = ({
  cycleSeconds = 3,
  startFrame = 0,
  scale = 1,
  accentColor = colors.captechBlue,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const cycleFrames = cycleSeconds * fps;
  const perStage = cycleFrames / STAGES.length;
  const activeIndex = Math.floor((elapsed % cycleFrames) / perStage);

  const radius = 140 * scale;
  const nodeSize = 160 * scale;

  return (
    <div
      style={{
        position: 'relative',
        width: radius * 2 + nodeSize,
        height: radius * 2 + nodeSize,
      }}
    >
      {STAGES.map((stage, i) => {
        // Distribute the three stages around a triangle.
        const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
        const cx = radius + Math.cos(angle) * radius + nodeSize / 2;
        const cy = radius + Math.sin(angle) * radius + nodeSize / 2;

        const isActive = i === activeIndex;
        const stageElapsed = elapsed % perStage;
        const pulse = isActive
          ? interpolate(stageElapsed, [0, perStage * 0.5, perStage], [1, 1.14, 1], {
              extrapolateRight: 'clamp',
            })
          : 1;
        const opacity = isActive ? 1 : 0.45;

        return (
          <div
            key={stage.label}
            style={{
              position: 'absolute',
              left: cx - nodeSize / 2,
              top: cy - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              borderRadius: nodeSize / 2,
              background: isActive ? accentColor : 'transparent',
              border: `3px solid ${accentColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? colors.white : accentColor,
              opacity,
              transform: `scale(${pulse})`,
              transition: 'none',
              fontFamily: fonts.medium,
              textAlign: 'center',
              padding: 12,
            }}
          >
            <div style={{fontSize: 30 * scale, lineHeight: 1}}>
              {stage.label}
            </div>
            {stage.sub ? (
              <div
                style={{
                  fontSize: 15 * scale,
                  fontFamily: fonts.regular,
                  marginTop: 8,
                  opacity: 0.85,
                }}
              >
                {stage.sub}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Connector arcs. Drawn as a faint ring behind the nodes. */}
      <div
        style={{
          position: 'absolute',
          left: nodeSize / 2,
          top: nodeSize / 2,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: `2px dashed ${accentColor}`,
          opacity: 0.35,
        }}
      />
    </div>
  );
};
