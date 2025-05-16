// components/stacker/scripting/CuePointPanel.jsx

"use client";

import { useState } from "react";

export default function CuePointPanel({ cuePoints, setCuePoints }) {
  const [newCue, setNewCue] = useState({ id: "", label: "", frame: 0 });

  const addCue = () => {
    setCuePoints([...cuePoints, newCue]);
    setNewCue({ id: "", label: "", frame: 0 });
  };

  return (
    <div className="p-4 bg-white border rounded space-y-3">
      <h3 className="font-semibold text-sm">📌 Cue Points</h3>
      <ul className="space-y-1 text-xs">
        {cuePoints.map((c) => (
          <li key={c.id}>
            Frame {c.frame} — <strong>{c.label}</strong> ({c.id})
          </li>
        ))}
      </ul>

      <input
        className="w-full border p-1 rounded text-xs"
        placeholder="Cue ID"
        value={newCue.id}
        onChange={(e) => setNewCue({ ...newCue, id: e.target.value })}
      />
      <input
        className="w-full border p-1 rounded text-xs"
        placeholder="Label"
        value={newCue.label}
        onChange={(e) => setNewCue({ ...newCue, label: e.target.value })}
      />
      <input
        className="w-full border p-1 rounded text-xs"
        placeholder="Frame"
        type="number"
        value={newCue.frame}
        onChange={(e) => setNewCue({ ...newCue, frame: parseInt(e.target.value) })}
      />

      <button
        onClick={addCue}
        className="w-full text-xs bg-green-500 text-white py-1 rounded hover:bg-green-600"
      >
        Add Cue Point
      </button>
    </div>
  );
}
