// components/UndoHistoryPanel.jsx
import React from 'react';

export default function UndoHistoryPanel() {
  return (
    <div className="undo-history-panel p-2 border-t bg-white">
      <h2 className="text-sm font-semibold">History</h2>
      <ul className="text-xs">
        <li>Added Rectangle</li>
        <li>Changed Fill Color</li>
        <li>Moved Symbol</li>
        <li>Edited Timeline</li>
        <li>Added Keyframe</li>
      </ul>
    </div>
  );
}