//components\stacker\panels\EmbedScriptRunner.jsx

"use client";
import { useEffect } from "react";

/**
 * EmbedScriptRunner.jsx
 * Automatically runs frame scripts + cue points during playback.
 */
export default function EmbedScriptRunner({ sceneId, frame, scriptEngine, cueManager, context }) {
  useEffect(() => {
    scriptEngine.execute(context.getFrameScripts(sceneId, frame), context);
    cueManager.check(sceneId, frame, context);
  }, [sceneId, frame]);

  return null;
}