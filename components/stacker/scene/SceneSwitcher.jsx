// components/stacker/scene/SceneSwitcher.jsx

"use client";

import { useSceneStore } from "@/store/SceneStore";
import { Select } from "@/components/ui/select";

export default function SceneSwitcher() {
  const { scenes, currentSceneId, setCurrentScene } = useSceneStore();

  if (scenes.length <= 1) return null;

  return (
    <div className="px-4 py-2">
      <label className="text-xs font-semibold text-gray-500 mb-1 block">
        Current Scene
      </label>
      <Select
        value={currentSceneId || ""}
        onValueChange={(val) => setCurrentScene(val)}
        className="w-48"
      >
        {scenes.map((scene) => (
          <option key={scene.id} value={scene.id}>
            {scene.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
