// components/ColorPanel.jsx
import React from 'react';

export function ColorPanel() {
  return (
    <div className="color-panel p-2 border-t bg-gray-50">
      <label>Fill</label>
      <input type="color" defaultValue="#0066CC" />
      <label>Stroke</label>
      <input type="color" defaultValue="#000000" />
      <label>Alpha</label>
      <input type="range" min="0" max="100" defaultValue="100" />
      <label>Hex</label>
      <input type="text" value="#0066CC" readOnly />
    </div>
  );
}
