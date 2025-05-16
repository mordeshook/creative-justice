// components/stacker/scene/ScenePanel.jsx

"use client";

import { useState } from "react";

export default function ScenePanel({ scenes, currentScene, onAddScene, onSwitchScene, onRenameScene }) {
  const [newSceneName, setNewSceneName] = useState("");

  return (
    <div className="p-4 border-r bg-white w-64 space-y-4">
      <h2 className="text-lg font-bold">Scenes</h2>

      <ul className="space-y-2">
        {scenes.map((scene) => (
          <li
            key={scene.id}
            className={`p-2 rounded cursor-pointer ${
              scene.id === currentScene ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => onSwitchScene(scene.id)}
          >
            {scene.name}
          </li>
        ))}
      </ul>

      <div className="flex space-x-2">
        <input
          className="border p-1 flex-1 rounded"
          value={newSceneName}
          onChange={(e) => setNewSceneName(e.target.value)}
          placeholder="New Scene"
        />
        <button
          className="bg-blue-500 text-white px-2 rounded"
          onClick={() => {
            if (newSceneName.trim()) {
              onAddScene(newSceneName);
              setNewSceneName("");
            }
          }}
        >
          ➕
        </button>
      </div>
    </div>
  );
}
