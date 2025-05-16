// components/stacker/symbols/ButtonSymbolEditor.jsx

"use client";

import { useState } from "react";
import SymbolTimelinePanel from "./SymbolTimelinePanel";
import StackerCanvas from "../StackerCanvas";
import SymbolBreadcrumb from "./SymbolBreadcrumb";

const BUTTON_STATES = ["Up", "Over", "Down", "Hit"];

export default function ButtonSymbolEditor({ buttonSymbol, onExit }) {
  const [currentState, setCurrentState] = useState("Up");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const currentLayers = buttonSymbol.states[currentState] || [];

  const updateLayer = (id, updates) => {
    const updated = currentLayers.map((l) =>
      l.id === id ? { ...l, ...updates } : l
    );
    buttonSymbol.states[currentState] = updated;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <SymbolBreadcrumb
        path={["Main", buttonSymbol.name, currentState]}
        onExit={onExit}
      />

      <div className="flex justify-center gap-2 p-2 border-b">
        {BUTTON_STATES.map((state) => (
          <button
            key={state}
            onClick={() => setCurrentState(state)}
            className={`px-4 py-1 border rounded ${
              currentState === state ? "bg-blue-100" : "bg-white"
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <StackerCanvas
          stageRef={null}
          width={1000}
          height={800}
          layers={currentLayers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateLayer}
          backgroundColor="#fff"
          currentFrame={currentFrame}
        />
      </div>

      <SymbolTimelinePanel
        layers={currentLayers}
        currentFrame={currentFrame}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onStop={() => setIsPlaying(false)}
        onSeek={setCurrentFrame}
        onAddKeyframe={() => {}}
        onToggleVisibility={() => {}}
        onToggleLock={() => {}}
        onRenameLayer={() => {}}
        onDeleteLayer={() => {}}
        onInsertBlankKeyframe={() => {}}
        onInsertFrame={() => {}}
        onRemoveFrame={() => {}}
        onConvertToSymbol={() => {}}
        onSetEasing={() => {}}
        onAdjustDuration={() => {}}
        motionPaths={{}}
        onDoubleClickFrame={() => {}}
        onDoubleClickLayer={() => {}}
        onFrameScrub={() => {}}
      />
    </div>
  );
}
