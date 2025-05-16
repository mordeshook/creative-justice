//components\ui\AIAssistPanel.jsx
"use client";
export default function AIAssistPanel({ onAutoAnimate }) {
  return (
    <div className="p-2 bg-white border rounded shadow">
      <h3 className="font-semibold mb-1">🤖 AI Assistant</h3>
      <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={onAutoAnimate}>
        Auto-Complete Tween
      </button>
    </div>
  );
}
