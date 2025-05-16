// components/TimelinePanel.jsx
import React from 'react';

export function TimelinePanel() {
  return (
    <div className="timeline-panel border-t bg-white p-2 text-xs">
      <div className="flex items-center mb-1">
        <span className="font-semibold mr-2">Layer 1</span>
        <button className="ml-auto text-xs">+ Add Layer</button>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-6 h-6 border text-center leading-6">{i + 1}</div>
        ))}
      </div>
    </div>
  );
}
