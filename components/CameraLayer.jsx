// components/CameraLayer.jsx
import React from 'react';

export default function CameraLayer() {
  return (
    <div className="camera-layer p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Camera Layer</h2>
      <label>Zoom</label>
      <input type="range" min="0.1" max="3" step="0.1" defaultValue="1" className="w-full" />
      <label>Pan X</label>
      <input type="number" defaultValue="0" className="w-full" />
      <label>Pan Y</label>
      <input type="number" defaultValue="0" className="w-full" />
    </div>
  );
}
