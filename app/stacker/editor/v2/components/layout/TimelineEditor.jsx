"use client";

import TimelineScrubber from "@/components/ui/TimelineScrubber";

export default function TimelineEditor({ layers, timeline, onAddKeyframe, onRemoveKeyframe, onScrub, isPlaying }) {
  return (
    <div className="w-full bg-gray-900 text-white h-24 flex items-center justify-between px-4 border-t">
      <div className="flex items-center gap-4">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onAddKeyframe(layer.id)}
            className="text-xs bg-gray-700 rounded px-2 py-1 hover:bg-gray-600"
          >
            + Keyframe {layer.type}
          </button>
        ))}
      </div>
      <TimelineScrubber onScrub={onScrub} playing={isPlaying} />
    </div>
  );
}
