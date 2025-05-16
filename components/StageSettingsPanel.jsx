// components/StageSettingsPanel.jsx
import React from 'react';

export default function StageSettingsPanel() {
  return (
    <div className="stage-settings-panel p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Stage Settings</h2>
      <label>Width</label>
      <input type="number" defaultValue={550} className="w-full mb-1" />
      <label>Height</label>
      <input type="number" defaultValue={400} className="w-full mb-1" />
      <label>Background Color</label>
      <input type="color" defaultValue="#ffffff" className="w-full" />
    </div>
  );
}
