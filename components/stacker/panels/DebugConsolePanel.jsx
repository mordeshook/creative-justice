//components\stacker\panels\DebugConsolePanel.jsx
"use client";
import { useState } from "react";

export default function DebugConsolePanel({ logs = [] }) {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <div className="fixed bottom-0 left-0 w-full h-40 bg-black text-green-400 p-2 font-mono text-xs overflow-y-auto z-50">
      <button onClick={() => setVisible(false)} className="text-white float-right">✕</button>
      <pre>{logs.join("\n")}</pre>
    </div>
  ) : null;
}

