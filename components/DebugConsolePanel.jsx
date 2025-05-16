// components/DebugConsolePanel.jsx
import React, { useState } from 'react';

export default function DebugConsolePanel() {
  const [logs, setLogs] = useState(["[Init] Stage ready", "[Info] Symbol loaded"]);

  return (
    <div className="debug-console-panel p-2 border-t bg-black text-green-400 text-xs font-mono">
      <h2 className="text-white font-semibold">Debug Console</h2>
      <div className="h-32 overflow-y-scroll border-t border-gray-600 mt-1">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
}

