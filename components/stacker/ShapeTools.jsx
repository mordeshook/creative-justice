// Components: ShapeTools.jsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ShapeTools({ onAddShape }) {
  const [shapeType, setShapeType] = useState("rectangle");
  const [fillColor, setFillColor] = useState("#FF0000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleAdd = () => {
    onAddShape({
      type: "shape",
      shape: shapeType,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      position: { x: 100, y: 100 },
      width: 100,
      height: 100,
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Shape Tools</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Shape Type</label>
        <select
          className="border p-2 rounded"
          value={shapeType}
          onChange={(e) => setShapeType(e.target.value)}
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="ellipse">Ellipse</option>
          <option value="star">Star</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Fill Color</label>
        <input
          type="color"
          value={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Stroke Color</label>
        <input
          type="color"
          value={strokeColor}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm">Stroke Width</label>
        <input
          type="number"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          className="border p-2 rounded"
          min={0}
          max={20}
        />
      </div>

      <Button className="bg-blue-600 text-white mt-2" onClick={handleAdd}>
        Add Shape
      </Button>
    </div>
  );
}
