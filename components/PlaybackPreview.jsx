// components/PlaybackPreview.jsx
"use client";
import React, { useEffect } from "react";

export function PlaybackPreview(props = {}) {
  const { frame = 0, layers = [] } = props;

  useEffect(() => {
    console.log("Preview Frame:", frame);
  }, [frame]);

  return (
    <div className="playback-preview bg-gray-100 p-2 text-xs">
      <h2 className="font-semibold">Frame {frame}</h2>
      <div className="text-xs">{Array.isArray(layers) ? layers.length : 0} active layers</div>
    </div>
  );
}
