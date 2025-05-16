// components/stacker/audio/AudioLayerControls.jsx

"use client";

import { useState } from "react";

export default function AudioLayerControls({ audio, onChange }) {
  const [volume, setVolume] = useState(audio.volume || 1);
  const [loop, setLoop] = useState(audio.loop || false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ ...audio, url });
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">🎵 Audio File</label>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <div className="flex items-center gap-2">
        <label className="text-sm">Volume:</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
            onChange({ ...audio, volume: parseFloat(e.target.value) });
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">Loop:</label>
        <input
          type="checkbox"
          checked={loop}
          onChange={() => {
            setLoop(!loop);
            onChange({ ...audio, loop: !loop });
          }}
        />
      </div>
    </div>
  );
}
