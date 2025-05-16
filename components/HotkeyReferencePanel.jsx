// components/HotkeyReferencePanel.jsx
import React from 'react';

export default function HotkeyReferencePanel() {
  const shortcuts = [
    { key: "V", action: "Selection Tool" },
    { key: "B", action: "Brush Tool" },
    { key: "T", action: "Text Tool" },
    { key: "Z", action: "Zoom Tool" },
    { key: "Ctrl+Z", action: "Undo" }
  ];

  return (
    <div className="hotkey-reference-panel p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Keyboard Shortcuts</h2>
      <ul>
        {shortcuts.map((s, idx) => (
          <li key={idx}><strong>{s.key}</strong>: {s.action}</li>
        ))}
      </ul>
    </div>
  );
}

