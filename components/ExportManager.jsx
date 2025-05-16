// components/ExportManager.jsx
import React from 'react';

export default function ExportManager() {
  return (
    <div className="export-manager p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Export</h2>
      <button className="w-full mb-1">Export as HTML5</button>
      <button className="w-full mb-1">Export as MP4</button>
      <button className="w-full">Export as ZIP</button>
    </div>
  );
}