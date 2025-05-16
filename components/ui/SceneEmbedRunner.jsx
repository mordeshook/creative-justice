//components\ui\SceneEmbedRunner.jsx
"use client";
export default function SceneEmbedRunner({ scene }) {
  return (
    <div className="border bg-white p-2 shadow">
      <h2>Scene Runner</h2>
      <p>Scene ID: {scene.id}</p>
    </div>
  );
}
