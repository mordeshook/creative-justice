//components\ui\SceneFlowEditor.jsx
"use client";
export default function SceneFlowEditor({ scenes }) {
  return (
    <div className="p-4 border bg-white shadow">
      <h3 className="text-lg font-semibold">🔀 Scene Flow Map</h3>
      <ul>{scenes.map((s) => <li key={s.id}>{s.name}</li>)}</ul>
    </div>
  );
}
