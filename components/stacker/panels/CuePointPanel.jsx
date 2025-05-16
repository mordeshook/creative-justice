// components/stacker/panels/CuePointPanel.jsx
"use client";

import { useState } from "react";

export default function CuePointPanel({ layerId, currentFrame, onAddCue, onRemoveCue }) {
  const [cues, setCues] = useState([]);

  const handleAdd = () => {
    const newCue = {
      id: Date.now(),
      frame: currentFrame,
      action: `trigger("myCue")`,
    };
    setCues(prev => [...prev, newCue]);
    onAddCue?.(newCue);
  };

  const handleRemove = (id) => {
    setCues(prev => prev.filter(c => c.id !== id));
    onRemoveCue?.(id);
  };

  return (
    <div className="cue-point-panel p-3 border-t bg-white w-80 shadow">
      <h2 className="text-sm font-semibold mb-2">🎯 Cue Points</h2>
      <div className="space-y-1 text-xs">
        {cues.map(cue => (
          <div key={cue.id} className="flex justify-between items-center">
            <span>Frame {cue.frame} — {cue.action}</span>
            <button onClick={() => handleRemove(cue.id)} className="text-red-500 text-xs">✕</button>
          </div>
        ))}
        {cues.length === 0 && (
          <p className="text-gray-400">No cues yet.</p>
        )}
      </div>
      <button onClick={handleAdd} className="mt-2 text-xs px-2 py-1 border rounded">+ Add Cue at Frame {currentFrame}</button>
    </div>
  );
}
