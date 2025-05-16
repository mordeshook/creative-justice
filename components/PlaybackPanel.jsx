// components/PlaybackPanel.jsx
import React from 'react';

export default function PlaybackPanel() {
  return (
    <div className="playback-panel p-2 border-t bg-white">
      <button>▶️ Play</button>
      <button>⏹ Stop</button>
      <button>⏭ Step</button>
      <label>Loop</label>
      <input type="checkbox" />
      <label>FPS</label>
      <input type="number" defaultValue={24} min={1} max={60} />
      <label>Stage Size</label>
      <select>
        <option>550x400</option>
        <option>800x600</option>
        <option>1024x768</option>
      </select>
      <label>Publish Format</label>
      <select>
        <option>HTML5</option>
        <option>MP4</option>
        <option>ZIP</option>
        <option>SWF (Legacy)</option>
      </select>
    </div>
  );
}

