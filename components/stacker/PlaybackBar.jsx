// components/stacker/PlaybackBar.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function PlaybackBar({ player, totalFrames }) {
  return (
    <div className="w-full px-4 py-2 border-t bg-white flex items-center gap-3">
      <Button onClick={player.prevFrame}>⏮</Button>
      <Button onClick={player.toggle}>
        {player.playing ? "⏸ Pause" : "▶️ Play"}
      </Button>
      <Button onClick={player.nextFrame}>⏭</Button>
      <Button onClick={() => player.setLoop(!player.loop)}>
        {player.loop ? "🔁 Loop On" : "⛔ Loop Off"}
      </Button>

      <Slider
        min={0}
        max={totalFrames - 1}
        value={[player.frame]}
        onValueChange={(val) => player.setFrame(val[0])}
        className="flex-grow mx-4"
      />

      <span className="text-sm font-mono">Frame {player.frame + 1} / {totalFrames}</span>
    </div>
  );
}
