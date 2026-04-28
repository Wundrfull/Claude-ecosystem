import React from 'react';
import {Composition} from 'remotion';
import {Intro} from './compositions/Intro';
import {AgenticLoop} from './compositions/AgenticLoop';
import {ContextRot} from './compositions/ContextRot';
import {CaptechStamp} from './compositions/CaptechStamp';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

// Durations in seconds, per outline.md clip table.
const INTRO_SECONDS = 75;
const CLIP_SECONDS = 20;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="intro"
        component={Intro}
        durationInFrames={INTRO_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="agentic-loop"
        component={AgenticLoop}
        durationInFrames={CLIP_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="context-rot"
        component={ContextRot}
        durationInFrames={CLIP_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="captech-stamp"
        component={CaptechStamp}
        durationInFrames={CLIP_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
