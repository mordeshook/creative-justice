"use client";

import { useState } from "react";

export function useTimelineControls({
  layers,
  setLayers,
  selectedId,
  setSelectedId,
  setFrame,
  play,
  stop,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedLayer = layers.find((l) => l.id === selectedId) || null;

  const onAddKeyframe = (layerId, frameIndex) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId
          ? {
              ...l,
              keyframes: Array.isArray(l.keyframes)
                ? [...new Set([...l.keyframes, frameIndex])]
                : [frameIndex],
            }
          : l
      )
    );
  };

  const onToggleVisibility = (layerId) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, visible: !l.visible } : l
      )
    );
  };

  const onToggleLock = (layerId) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, locked: !l.locked } : l
      )
    );
  };

  const onRenameLayer = (layerId, newName) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, name: newName } : l
      )
    );
  };

  const onDeleteLayer = (layerId) => {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
  };

  const onSetEasing = (layerId, easing) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, easing } : l
      )
    );
  };

  const onAdjustDuration = (layerId, duration) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, duration } : l
      )
    );
  };

  const onInsertBlankKeyframe = (layerId, frameIndex) => {
    onAddKeyframe(layerId, frameIndex);
  };

  const onInsertFrame = (layerId, frameIndex) => {
    onAddKeyframe(layerId, frameIndex);
  };

  const onRemoveFrame = (layerId, frameIndex) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId
          ? {
              ...l,
              keyframes: l.keyframes?.filter((f) => f !== frameIndex) || [],
            }
          : l
      )
    );
  };

  const onConvertToSymbol = (layerId) => {
    console.log("Convert to symbol:", layerId);
  };

  const onDoubleClickFrame = (layerId, frameIndex) => {
    setSelectedId(layerId);
    setFrame(frameIndex);
  };

  const onDoubleClickLayer = (layer) => {
    setSelectedId(layer.id);
  };

  const onPlayToggle = () => {
    isPlaying ? stop() : play();
    setIsPlaying(!isPlaying);
  };

  const onStop = () => {
    stop();
    setIsPlaying(false);
  };

  const onSeek = (frameNum) => {
    setFrame(frameNum);
  };

  const onFrameScrub = (frameNum) => {
    setFrame(frameNum);
  };

  const motionPaths = {}; // Optional: future logic

  return {
    isPlaying,
    selectedLayer,
    motionPaths,
    onAddKeyframe,
    onToggleVisibility,
    onToggleLock,
    onRenameLayer,
    onDeleteLayer,
    onSetEasing,
    onAdjustDuration,
    onInsertBlankKeyframe,
    onInsertFrame,
    onRemoveFrame,
    onConvertToSymbol,
    onDoubleClickFrame,
    onDoubleClickLayer,
    onPlayToggle,
    onStop,
    onSeek,
    onFrameScrub,
  };
}
