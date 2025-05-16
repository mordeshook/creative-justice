// components\ui\BehaviorLinkerPanel.jsx
"use client";
export default function BehaviorLinkerPanel({ onLink }) {
  return (
    <div className="p-2 bg-white border rounded shadow">
      <h3 className="font-semibold mb-2">🔗 Behavior Linker</h3>
      <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={onLink}>
        Link Behavior
      </button>
    </div>
  );
}
