// components/CuePointPanel.jsx
import React from 'react';

export default function CuePointPanel() {
  return (
    <div className="cue-point-panel p-2 border-t bg-white">
      <h2 className="text-sm font-semibold">Cue Points</h2>
      <ul className="text-xs">
        <li>00:01 - trigger("startIntro")</li>
        <li>00:05 - trigger("showLogo")</li>
      </ul>
      <button className="mt-2 text-xs">+ Add Cue Point</button>
    </div>
  );
}