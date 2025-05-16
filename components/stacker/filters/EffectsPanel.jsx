// components/stacker/filters/EffectsPanel.jsx

"use client";

import { useState } from "react";

export default function EffectsPanel({ effects = {}, onChange }) {
  const [shadow, setShadow] = useState(effects.shadow || false);
  const [blur, setBlur] = useState(effects.blur || 0);
  const [opacity, setOpacity] = useState(effects.opacity ?? 1);

  return (
    <div className="space-y-2">
      <label className="block font-semibold text-sm">✨ Visual Effects</label>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={shadow}
          onChange={() => {
            setShadow(!shadow);
            onChange({ ...effects, shadow: !shadow });
          }}
        />
        <span className="text-sm">Drop Shadow</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm w-16">Blur:</label>
        <input
          type="range"
          min={0}
          max={20}
          value={blur}
          onChange={(e) => {
            setBlur(Number(e.target.value));
            onChange({ ...effects, blur: Number(e.target.value) });
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm w-16">Opacity:</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={opacity}
          onChange={(e) => {
            setOpacity(parseFloat(e.target.value));
            onChange({ ...effects, opacity: parseFloat(e.target.value) });
          }}
        />
      </div>
    </div>
  );
}
