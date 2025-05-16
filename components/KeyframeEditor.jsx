// components/KeyframeEditor.jsx
import React from 'react';

export default function KeyframeEditor() {
  return (
    <div className="keyframe-editor border-t bg-white p-2 text-xs">
      <h2 className="font-semibold">Keyframe Properties</h2>
      <label>Frame</label>
      <input type="number" min="1" className="w-full mb-1" />
      <label>Tween</label>
      <select className="w-full">
        <option>None</option>
        <option>Motion</option>
        <option>Shape</option>
        <option>Classic</option>
      </select>
    </div>
  );
}

