// components/TimelineScrubber.jsx

"use client";

import React from "react";

export default function TimelineScrubber({ frame = 0, onSeek = () => {} }) {
  const handleChange = (e) => {
    const newFrame = parseInt(e.target.value, 10);
    onSeek(newFrame);
  };

  return (
    <div className="w-full px-4 py-2 border-t bg-white">
      <label className="block text-xs text-gray-500 mb-1">Timeline Scrubber</label>
      <input
        type="range"
        min="0"
        max="300"
        value={frame}
        onChange={handleChange}
        className="w-full"
      />
      <div className="text-xs text-gray-600 text-right mt-1">
        Frame: {frame}
      </div>
    </div>
  );
}
