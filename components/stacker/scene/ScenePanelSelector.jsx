// components/stacker/scene/ScenePanelSelector.jsx

"use client";

import { useSceneStore } from "@/store/SceneStore";
import { Button } from "@/components/ui/button";

export default function ScenePanelSelector() {
  const { scenes, currentSceneId, setCurrentScene, addScene } = useSceneStore();

  return (
    <div className="flex gap-2 items-center">
      <div className="text-sm font-semibold">🎬 Scenes:</div>
      {scenes.map((scene) => (
        <Button
          key={scene.id}
          onClick={() => setCurrentScene(scene.id)}
          variant={scene.id === currentSceneId ? "default" : "outline"}
        >
          {scene.name || `Scene ${scene.id}`}
        </Button>
      ))}
      <Button
        onClick={() =>
          addScene({ id: Date.now(), name: `Scene ${scenes.length + 1}` })
        }
      >
        ➕ Add Scene
      </Button>
    </div>
  );
}
