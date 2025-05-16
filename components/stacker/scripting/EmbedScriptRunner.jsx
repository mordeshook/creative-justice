// components/stacker/scripting/EmbedScriptRunner.jsx

"use client";

import { useEffect } from "react";
import { ScriptEngine } from "@/utils/ScriptEngine";
import { CuePointManager } from "@/utils/CuePointManager";

export default function EmbedScriptRunner({
  scene,
  currentFrame,
  frameScripts,
  cuePoints,
  setFrame,
  stopPlayback,
}) {
  useEffect(() => {
    const engine = new ScriptEngine({
      scene,
      setFrame,
      stopPlayback,
    });

    const cues = new CuePointManager({
      onCue: (cue) => console.log("🎯 Cue triggered:", cue),
    });

    // Cue check
    cues.check(currentFrame, cuePoints);

    // Script check
    if (frameScripts[currentFrame]) {
      engine.execute([frameScripts[currentFrame]]);
    }
  }, [currentFrame]);

  return null;
}
