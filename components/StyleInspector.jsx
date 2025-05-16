// components/StyleInspector.jsx
import React from 'react';

export default function StyleInspector() {
  return (
    <div className="style-inspector p-2 border-t bg-gray-100">
      <label>Stroke Width</label>
      <input type="number" min="0" max="20" defaultValue="1" />
      <label>Line Style</label>
      <select>
        <option>Solid</option>
        <option>Dashed</option>
        <option>Dotted</option>
      </select>
      <label>Join</label>
      <select>
        <option>Miter</option>
        <option>Round</option>
        <option>Bevel</option>
      </select>
    </div>
  );
}