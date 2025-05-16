// components/AdvancedMotionEditor.jsx
import React from 'react';

export default function AdvancedMotionEditor() {
  return (
    <div className="advanced-motion-editor p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Advanced Motion Editor</h2>
      <label>Ease In</label>
      <input type="range" min="0" max="100" defaultValue="0" className="w-full" />
      <label>Ease Out</label>
      <input type="range" min="0" max="100" defaultValue="0" className="w-full" />
      <label>Rotate</label>
      <input type="number" defaultValue="0" className="w-full" />
      <label>Scale</label>
      <input type="number" defaultValue="1" step="0.1" className="w-full" />
    </div>
  );
}
