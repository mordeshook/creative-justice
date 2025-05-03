"use client";

import { useState, useRef } from "react";
import CanvasWrapper from "@/components/layout/CanvasWrapper";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightInspector from "@/components/layout/RightInspector";
import TopToolbar from "@/components/layout/TopToolbar";
import TimelineEditor from "@/components/layout/TimelineEditor";
import FloatingMenus from "@/components/layout/FloatingMenus";
import useLayers from "@/hooks/useLayers";
import useTimeline from "@/hooks/useTimeline";

export default function EditorClient_ProStacker() {
  const stageRef = useRef(null);
  const {
    layers,
    selectedId,
    setSelectedId,
    addLayer,
    updateLayer,
    removeLayer,
    reorderLayers,
    toggleVisibility,
    toggleLock,
  } = useLayers();

  const {
    timeline,
    addKeyframe,
    removeKeyframe,
    play,
    pause,
    scrubToFrame,
    isPlaying,
  } = useTimeline(layers, updateLayer);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-100">
      <TopToolbar onAddLayer={addLayer} onPlay={play} onPause={pause} />
      <div className="flex flex-grow overflow-hidden">
        <LeftSidebar
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={removeLayer}
          onReorder={reorderLayers}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
        />
        <CanvasWrapper
          stageRef={stageRef}
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateLayer}
        />
        <RightInspector
          layer={layers.find((l) => l.id === selectedId)}
          onUpdate={(updates) => updateLayer(selectedId, updates)}
        />
      </div>
      <TimelineEditor
        layers={layers}
        timeline={timeline}
        onAddKeyframe={addKeyframe}
        onRemoveKeyframe={removeKeyframe}
        onScrub={scrubToFrame}
        isPlaying={isPlaying}
      />
      <FloatingMenus stageRef={stageRef} />
    </div>
  );
}
