// components/stacker/symbols/SymbolTimelinePanel.jsx

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function SymbolTimelinePanel({
  layers,
  currentFrame = 0,
  isPlaying = false,
  onAddKeyframe,
  onPlayToggle = () => {},
  onStop = () => {},
  onSeek = () => {},
  totalFrames = 60,
  onDoubleClickLayer = () => {},
}) {
  const [scrubFrame, setScrubFrame] = useState(currentFrame);

  return (
    <div className="w-full border-t bg-white shadow px-4 py-2">
      {/* Controls */}
      <div className="flex items-center gap-2 p-2 border-b">
        <Button onClick={() => onSeek(0)}>⏮️</Button>
        <Button onClick={onPlayToggle}>{isPlaying ? "⏸️" : "▶️"}</Button>
        <Button onClick={onStop}>⏹️</Button>
        <div className="ml-auto">
          <Button>Symbol Timeline ▾</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-md font-semibold">Symbol Timeline</h2>
        <div className="text-sm">Frame: {scrubFrame}</div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col space-y-2">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className="flex items-center space-x-2"
              onDoubleClick={() => onDoubleClickLayer(layer)}
            >
              <div className="w-32 truncate text-sm font-medium">
                {layer.name || `SymbolLayer ${index + 1}`}
              </div>
              <div className="flex-1 relative">
                <div className="flex space-x-1">
                  {Array.from({ length: totalFrames }).map((_, frameIndex) => {
                    const isKeyframe = layer.keyframes?.includes(frameIndex);
                    return (
                      <div
                        key={frameIndex}
                        onClick={() => {
                          onAddKeyframe(layer.id, frameIndex);
                          setScrubFrame(frameIndex);
                        }}
                        className={`w-4 h-4 border cursor-pointer relative ${
                          isKeyframe
                            ? "bg-blue-500"
                            : frameIndex === scrubFrame
                            ? "bg-gray-300"
                            : "bg-white"
                        }`}
                        title={`Frame ${frameIndex}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
