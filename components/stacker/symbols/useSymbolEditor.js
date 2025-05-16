// components/stacker/symbols/useSymbolEditor.js

"use client";

import { useState, useEffect } from "react";
import { useSymbolStore } from "./SymbolStore";
import { generateMotionPaths } from "../../utils/motionTweenUtils";

export function useSymbolEditor() {
  const {
    currentSymbol,
    setCurrentSymbol,
    breadcrumb,
    enterSymbol,
    exitSymbol,
  } = useSymbolStore();

  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [motionPaths, setMotionPaths] = useState({});

  useEffect(() => {
    if (currentSymbol) {
      setLayers(currentSymbol.layers || []);
    }
  }, [currentSymbol]);

  useEffect(() => {
    setMotionPaths(generateMotionPaths(layers));
  }, [layers]);

  const updateLayer = (id, updates) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  };

  const addKeyframe = (layerId, frame) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              keyframes: Array.isArray(layer.keyframes)
                ? [...new Set([...layer.keyframes, frame])]
                : [frame],
            }
          : layer
      )
    );
  };

  const toggleVisibility = (id) => {
    updateLayer(id, {
      visible: !layers.find((l) => l.id === id)?.visible,
    });
  };

  const toggleLock = (id) => {
    updateLayer(id, {
      locked: !layers.find((l) => l.id === id)?.locked,
    });
  };

  const renameLayer = (id, newName) => {
    updateLayer(id, { name: newName });
  };

  const deleteLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const insertBlankKeyframe = (layerId, frame) => {
    addKeyframe(layerId, frame);
    updateLayer(layerId, { content: "" });
  };

  const insertFrame = (layerId, frame) => {
    addKeyframe(layerId, frame);
  };

  const removeFrame = (layerId, frame) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              keyframes: layer.keyframes?.filter((f) => f !== frame) || [],
            }
          : layer
      )
    );
  };

  const convertToSymbol = (layerId, type = "movieClip") => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    const symbol = {
      id: `symbol-${Date.now()}`,
      name: layer.name || `Symbol-${Date.now()}`,
      type,
      layers: [layer],
    };
    enterSymbol(symbol);
  };

  const setEasing = (layerId, easing) => {
    updateLayer(layerId, { easing });
  };

  const adjustDuration = (layerId, duration) => {
    updateLayer(layerId, { duration });
  };

  const frameScrub = (frame) => setCurrentFrame(frame);

  const onDoubleClickFrame = (layerId, frame) => {
    addKeyframe(layerId, frame);
  };

  const onDoubleClickLayer = (layerId) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;
    if (layer.symbol) {
      enterSymbol(layer.symbol);
    } else if (layer.type === "shape") {
      // shape tween editing placeholder
    } else if (layer.bones) {
      // bone rig editing placeholder
    }
  };

  return {
    currentSymbol,
    layers,
    selectedId,
    setSelectedId,
    currentFrame,
    isPlaying,
    setCurrentFrame,
    setIsPlaying,
    updateLayer,
    addKeyframe,
    toggleVisibility,
    toggleLock,
    renameLayer,
    deleteLayer,
    insertBlankKeyframe,
    insertFrame,
    removeFrame,
    convertToSymbol,
    setEasing,
    adjustDuration,
    breadcrumb,
    exitSymbol,
    motionPaths,
    frameScrub,
    onDoubleClickFrame,
    onDoubleClickLayer,
  };
}
