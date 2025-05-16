// components/stacker/panels/LayerSettings.jsx
"use client";
import React, { useEffect, useState } from "react";

export default function LayerSettings({ selectedLayer, updateLayerProps, currentFrame, addKeyframe }) {
  const [localProps, setLocalProps] = useState({});

  useEffect(() => {
    if (selectedLayer) {
      setLocalProps(selectedLayer);
    }
  }, [selectedLayer]);

  const handleChange = (prop, value) => {
    const updated = { ...localProps, [prop]: value };
    setLocalProps(updated);
    updateLayerProps(selectedLayer.id, updated);
  };

  if (!selectedLayer) return null;

  return (
    <div className="p-2 text-xs border-t bg-white">
      <h2 className="font-semibold">Layer Settings</h2>

      <label>X</label>
      <input type="number" value={localProps.x || 0} onChange={e => handleChange("x", parseFloat(e.target.value))} />

      <label>Y</label>
      <input type="number" value={localProps.y || 0} onChange={e => handleChange("y", parseFloat(e.target.value))} />

      {selectedLayer.type === "image" && (
        <>
          <label>Width</label>
          <input type="number" value={localProps.width || 100} onChange={e => handleChange("width", parseFloat(e.target.value))} />

          <label>Height</label>
          <input type="number" value={localProps.height || 100} onChange={e => handleChange("height", parseFloat(e.target.value))} />

          <label>Opacity</label>
          <input type="range" min="0" max="1" step="0.01" value={localProps.opacity ?? 1} onChange={e => handleChange("opacity", parseFloat(e.target.value))} />
        </>
      )}

      {selectedLayer.type === "text" && (
        <>
          <label>Text</label>
          <input type="text" value={localProps.text || ""} onChange={e => handleChange("text", e.target.value)} />

          <label>Font Size</label>
          <input type="number" value={localProps.fontSize || 24} onChange={e => handleChange("fontSize", parseFloat(e.target.value))} />

          <label>Font Family</label>
          <select value={localProps.fontFamily || "Arial"} onChange={e => handleChange("fontFamily", e.target.value)}>
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier</option>
            <option>Georgia</option>
          </select>

          <label>Text Color</label>
          <input type="color" value={localProps.fill || "#000000"} onChange={e => handleChange("fill", e.target.value)} />
        </>
      )}

      <div className="mt-2">
        <label>Animation Keyframe</label>
        <div className="flex items-center gap-2">
          <span>Frame {currentFrame}</span>
          <button className="border px-2 text-xs" onClick={() => addKeyframe(selectedLayer.id, localProps, currentFrame)}>+ Add Keyframe</button>
        </div>
      </div>
    </div>
  );
}
