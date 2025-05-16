// components/PreloaderPanel.jsx
import React from 'react';

export default function PreloaderPanel() {
  return (
    <div className="preloader-panel p-2 border-t bg-white">
      <h2 className="text-sm font-semibold">Preloader</h2>
      <label className="text-xs">Progress Bar Style</label>
      <select className="w-full text-xs">
        <option>Linear Bar</option>
        <option>Spinner</option>
        <option>Custom Graphic</option>
      </select>
      <label className="text-xs mt-2">Loading Text</label>
      <input type="text" defaultValue="Loading..." className="w-full text-xs" />
    </div>
  );
}

