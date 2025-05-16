// components/stacker/TimelinePanel.jsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function TimelinePanel({
  layers,
  currentFrame,
  totalFrames = 120,
  onSeek,
  onAddKeyframe,
  onFrameScrub,
  onPlayToggle,
  onStop,
  isPlaying,
  onToggleVisibility,
  onToggleLock,
  onRenameLayer,
  onDeleteLayer,
  onSetEasing = () => {},
  onAdjustDuration = () => {},
  onInsertBlankKeyframe = () => {},
  onInsertFrame = () => {},
  onRemoveFrame = () => {},
  onConvertToSymbol = () => {},
  onDoubleClickFrame = () => {},
  onDoubleClickLayer = () => {},
  motionPaths = {},
}) {
  const [scrubFrame, setScrubFrame] = useState(currentFrame);

  const handleScrub = (frame) => {
    setScrubFrame(frame);
    onSeek(frame);
    onFrameScrub(frame);
  };

  return (
    <div className="w-full bg-white border-t p-2">
      {/* Transport Controls */}
      <div className="flex items-center justify-between mb-2 border-b pb-2">
        <div className="flex gap-2">
          <Button onClick={() => handleScrub(0)}>⏮</Button>
          <Button onClick={onPlayToggle}>{isPlaying ? "⏸" : "▶"}</Button>
          <Button onClick={onStop}>⏹</Button>
        </div>
        <div className="text-sm text-gray-600">Frame: {scrubFrame}</div>
      </div>

      {/* Timeline Tracks */}
      <div className="overflow-x-auto">
        {layers.map((layer, rowIndex) => (
          <div
            key={layer.id}
            className="flex items-center gap-1 border-b py-1"
            onDoubleClick={() => onDoubleClickLayer(layer)}
          >
            {/* Layer name */}
            <input
              defaultValue={layer.name || `Layer ${rowIndex + 1}`}
              onBlur={(e) => onRenameLayer(layer.id, e.target.value)}
              className="w-32 text-sm px-1 border-b"
            />

            {/* Frames */}
            <div className="flex gap-0.5">
              {Array.from({ length: totalFrames }).map((_, frameIndex) => {
                const isKey = layer.keyframes?.includes(frameIndex);
                const isCurrent = frameIndex === scrubFrame;
                const hasMotion = motionPaths?.[layer.id]?.includes(frameIndex);

                return (
                  <div
                    key={frameIndex}
                    onClick={() => handleScrub(frameIndex)}
                    onDoubleClick={() => onDoubleClickFrame(layer.id, frameIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      onInsertFrame(layer.id, frameIndex);
                    }}
                    className={`w-4 h-4 cursor-pointer border relative ${
                      isKey ? "bg-blue-500" : isCurrent ? "bg-gray-300" : "bg-white"
                    } ${hasMotion ? "border-green-500" : ""}`}
                    title={`Frame ${frameIndex}`}
                  />
                );
              })}
            </div>

            {/* Actions */}
            <div className="ml-auto flex gap-1">
              <select
                onChange={(e) => onSetEasing(layer.id, e.target.value)}
                className="text-xs border rounded px-1 py-0.5"
                defaultValue={layer.easing || "linear"}
                title="Set easing"
              >
                <option value="linear">Linear</option>
                <option value="ease-in">Ease-In</option>
                <option value="ease-out">Ease-Out</option>
                <option value="ease-in-out">Ease-In-Out</option>
              </select>
              <input
                type="number"
                className="w-16 text-xs border rounded px-1 py-0.5"
                min="1"
                max="240"
                defaultValue={layer.duration || 60}
                title="Duration"
                onBlur={(e) =>
                  onAdjustDuration(layer.id, parseInt(e.target.value))
                }
              />
              <button title="Toggle visibility" onClick={() => onToggleVisibility(layer.id)}>
                {layer.visible === false ? "🙈" : "👁️"}
              </button>
              <button title="Toggle lock" onClick={() => onToggleLock(layer.id)}>
                {layer.locked ? "🔒" : "🔓"}
              </button>
              <button
                title="Convert to symbol"
                onClick={() => onConvertToSymbol(layer.id)}
              >
                🔁
              </button>
              <button
                title="Delete layer"
                className="text-red-500"
                onClick={() => onDeleteLayer(layer.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
