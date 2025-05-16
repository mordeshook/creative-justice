// components/stacker/SymbolEditor.jsx

"use client";

import { useState } from "react";
import StackerCanvas from "@/components/stacker/StackerCanvas";
import TimelinePanel from "@/components/stacker/TimelinePanel";
import ToolBar from "@/components/stacker/Toolbar";
import useHistory from "@/components/stacker/HistoryManager";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const FPS = 24;

export default function SymbolEditor({ symbolName = "Symbol 1", onClose }) {
  const {
    state: symbolLayers,
    set: setSymbolLayers,
    undo,
    redo,
  } = useHistory([]);

  const [selectedId, setSelectedId] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Breadcrumbs + Exit Symbol View */}
      <div className="flex justify-between items-center p-2 bg-white border-b">
        <div className="text-sm font-semibold">Main &gt; {symbolName}</div>
        <button
          onClick={onClose}
          className="text-xs px-3 py-1 border rounded hover:bg-gray-100"
        >
          Exit Symbol
        </button>
      </div>

      <ToolBar onUndo={undo} onRedo={redo} onAddLayer={() => {}} />

      <div className="flex flex-grow">
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="w-[600px] h-[400px] bg-white shadow">
            <StackerCanvas
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              layers={symbolLayers}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={(id, updates) =>
                setSymbolLayers((prev) =>
                  prev.map((layer) =>
                    layer.id === id ? { ...layer, ...updates } : layer
                  )
                )
              }
              currentFrame={currentFrame}
            />
          </div>
        </div>
      </div>

      <TimelinePanel
        layers={symbolLayers}
        currentFrame={currentFrame}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying((p) => !p)}
        onStop={() => setIsPlaying(false)}
        onSeek={setCurrentFrame}
        onAddKeyframe={(id, frame) => {
          setSymbolLayers((prev) =>
            prev.map((layer) =>
              layer.id === id
                ? {
                    ...layer,
                    keyframes: Array.isArray(layer.keyframes)
                      ? [...new Set([...layer.keyframes, frame])]
                      : [frame],
                  }
                : layer
            )
          );
        }}
        onToggleVisibility={(id) => {
          setSymbolLayers((prev) =>
            prev.map((layer) =>
              layer.id === id ? { ...layer, visible: !layer.visible } : layer
            )
          );
        }}
        onToggleLock={(id) => {
          setSymbolLayers((prev) =>
            prev.map((layer) =>
              layer.id === id ? { ...layer, locked: !layer.locked } : layer
            )
          );
        }}
      />
    </div>
  );
}
