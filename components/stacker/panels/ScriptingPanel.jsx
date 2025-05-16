//components\stacker\panels\ScriptingPanel.jsx

"use client";
import { useState } from "react";

export default function ScriptingPanel({ currentScripts = [], onSave }) {
  const [scripts, setScripts] = useState(currentScripts.join("\n"));

  return (
    <div className="p-4 border rounded bg-white shadow space-y-2">
      <h2 className="font-semibold text-md">🧠 Scripting Panel</h2>
      <textarea
        className="w-full h-40 border p-2 text-sm font-mono"
        value={scripts}
        onChange={(e) => setScripts(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => onSave(scripts.split("\n"))}
      >
        Save Scripts
      </button>
    </div>
  );
}