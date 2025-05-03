// Component: LayerOptionsPanel.jsx

"use client";

import { useEffect, useState } from "react";

export default function LayerOptionsPanel({ layer, onUpdate }) {
  if (!layer) return null;

  const [local, setLocal] = useState({});

  useEffect(() => {
    setLocal(layer);
  }, [layer]);

  const handleChange = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    onUpdate({ [key]: value });
  };

  return (
    <div className="p-4 border-l w-80 bg-white shadow space-y-4">
      <h2 className="text-lg font-bold">Layer Settings</h2>

      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">X</label>
          <input
            type="number"
            value={local.x || 0}
            onChange={(e) => handleChange("x", parseInt(e.target.value))}
            className="w-full border rounded p-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Y</label>
          <input
            type="number"
            value={local.y || 0}
            onChange={(e) => handleChange("y", parseInt(e.target.value))}
            className="w-full border rounded p-1"
          />
        </div>
      </div>

      {layer.type === "text" && (
        <>
          <div>
            <label className="block text-sm font-medium">Text</label>
            <input
              type="text"
              value={local.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Font Size</label>
            <input
              type="number"
              value={local.fontSize || 24}
              onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Text Color</label>
            <input
              type="color"
              value={local.fill || "#000000"}
              onChange={(e) => handleChange("fill", e.target.value)}
              className="w-full"
            />
          </div>
        </>
      )}

      {layer.type === "shape" && (
        <>
          <div>
            <label className="block text-sm font-medium">Fill Color</label>
            <input
              type="color"
              value={local.fill || "#FF0000"}
              onChange={(e) => handleChange("fill", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stroke Color</label>
            <input
              type="color"
              value={local.stroke || "#000000"}
              onChange={(e) => handleChange("stroke", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stroke Width</label>
            <input
              type="number"
              value={local.strokeWidth || 1}
              onChange={(e) => handleChange("strokeWidth", parseInt(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div>
        </>
      )}

      {layer.type === "image" && (
        <>
          <div>
            <label className="block text-sm font-medium">Width</label>
            <input
              type="number"
              value={local.width || 200}
              onChange={(e) => handleChange("width", parseInt(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Height</label>
            <input
              type="number"
              value={local.height || 200}
              onChange={(e) => handleChange("height", parseInt(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={local.opacity || 1}
              onChange={(e) => handleChange("opacity", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}