// components/stacker/scripting/ScriptingPanel.jsx

"use client";

import { useState } from "react";

export default function ScriptingPanel({ selectedFrame, scriptMap, setScriptMap }) {
  const [value, setValue] = useState(scriptMap[selectedFrame] || "");

  const handleSave = () => {
    setScriptMap((prev) => ({ ...prev, [selectedFrame]: value }));
  };

  return (
    <div className="p-4 border bg-white rounded space-y-2">
      <h3 className="font-semibold text-sm">🎯 Frame Script (Frame {selectedFrame})</h3>
      <textarea
        className="w-full border rounded p-2 text-xs font-mono h-32"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Script
      </button>
    </div>
  );
}
