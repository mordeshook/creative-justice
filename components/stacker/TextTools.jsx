// Components: TextTools.jsx
"use client";

import { useEffect, useState } from "react";

export default function TextTools({ selectedText, onUpdate }) {
  const [fontSize, setFontSize] = useState(selectedText?.fontSize || 24);
  const [fontFamily, setFontFamily] = useState(selectedText?.fontFamily || "Arial");
  const [color, setColor] = useState(selectedText?.fill || "#000000");

  // 🔁 Sync local state when selectedText changes
  useEffect(() => {
    setFontSize(selectedText?.fontSize || 24);
    setFontFamily(selectedText?.fontFamily || "Arial");
    setColor(selectedText?.fill || "#000000");
  }, [selectedText]);

  return (
    <div className="p-4 border rounded bg-white shadow space-y-4">
      <h4 className="font-semibold">Text Settings</h4>
      <label className="block">
        Font Size
        <input
          type="number"
          value={fontSize}
          onChange={(e) => {
            const size = parseInt(e.target.value);
            setFontSize(size);
            onUpdate({ fontSize: size });
          }}
          className="border p-1 w-full"
        />
      </label>
      <label className="block">
        Font Family
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value);
            onUpdate({ fontFamily: e.target.value });
          }}
          className="border p-1 w-full"
        >
          <option>Arial</option>
          <option>Georgia</option>
          <option>Courier New</option>
          <option>Times New Roman</option>
        </select>
      </label>
      <label className="block">
        Text Color
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            onUpdate({ fill: e.target.value });
          }}
          className="w-full"
        />
      </label>
    </div>
  );
}
