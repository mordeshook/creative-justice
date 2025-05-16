// components/stacker/scene/SceneToolbar.jsx

"use client";

import { useState } from "react";
import { useSceneStore } from "@/store/SceneStore";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SceneToolbar() {
  const {
    scenes,
    currentSceneId,
    addScene,
    setCurrentScene,
    updateScene,
    removeScene,
  } = useSceneStore();

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const id = nanoid();
    addScene({ id, name: `Scene ${scenes.length + 1}`, layers: [] });
  };

  const handleRename = (id) => {
    updateScene(id, { name: newName });
    setEditingId(null);
  };

  return (
    <div className="w-full px-4 py-2 border-b bg-white flex items-center gap-4 shadow-sm">
      <Button onClick={handleAdd}>➕ New Scene</Button>

      <div className="flex gap-2 overflow-x-auto">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`flex items-center gap-1 px-2 py-1 rounded border ${
              scene.id === currentSceneId
                ? "bg-blue-100 border-blue-500"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            {editingId === scene.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRename(scene.id);
                }}
                className="flex gap-1 items-center"
              >
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  className="h-7 w-28 text-sm"
                />
                <Button type="submit" size="sm" className="px-2 h-7 text-xs">
                  Save
                </Button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => setCurrentScene(scene.id)}
                  className="text-sm font-medium"
                >
                  {scene.name}
                </button>
                <button
                  onClick={() => {
                    setNewName(scene.name);
                    setEditingId(scene.id);
                  }}
                  className="text-xs"
                  title="Rename"
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeScene(scene.id)}
                  className="text-xs"
                  title="Delete"
                >
                  ❌
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
