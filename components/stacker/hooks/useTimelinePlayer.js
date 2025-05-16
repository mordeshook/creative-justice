// hooks/useTimelinePlayer.js
import { useEffect, useRef, useState } from "react";

export function useTimelinePlayer({ fps = 24, totalFrames = 120 }) {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [loop, setLoop] = useState(true);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  const updateFrame = (f) => {
    frameRef.current = f;
    setFrame(f);
  };

  const play = () => setPlaying(true);
  const stop = () => {
    setPlaying(false);
    updateFrame(0);
  };
  const step = () => updateFrame(Math.min(frameRef.current + 1, totalFrames - 1));
  const prev = () => updateFrame(Math.max(frameRef.current - 1, 0));

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        frameRef.current++;
        if (frameRef.current >= totalFrames) {
          if (loop) {
            frameRef.current = 0;
          } else {
            setPlaying(false);
            return;
          }
        }
        setFrame(frameRef.current);
      }, 1000 / fps);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [playing, fps, loop, totalFrames]);

  return {
    frame,
    playing,
    loop,
    setFrame: updateFrame,
    setLoop,
    play,
    stop,
    toggle: () => setPlaying((p) => !p),
    step,
    prev,
    next: step,
  };
}
