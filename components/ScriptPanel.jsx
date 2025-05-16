// components/ScriptPanel.jsx
import React from 'react';

export default function ScriptPanel() {
  return (
    <div className="script-panel p-2 border-t bg-white">
      <h2 className="text-sm font-semibold">Scripting</h2>
      <textarea placeholder="// onEnterFrame\n// this.play();" className="w-full h-40 text-xs font-mono p-1 border" />
    </div>
  );
}