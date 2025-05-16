// components/stacker/scene/SceneTimeline.jsx

"use client";

import { useSceneStore } from "@/store/SceneStore";
import TimelinePanel from "../TimelinePanel";

export default function SceneTimeline({ layersMap }) {
  const { currentSceneId, scenes, updateScene } = useSceneStore();
  const scene = scenes.find((s) => s.id === currentSceneId);

  if (!scene) return <div className="text-center text-gray-500">No scene selected</div>;

  return (
    <TimelinePanel
      layers={layersMap[scene.id] || []}
      currentFrame={scene.currentFrame || 0}
      isPlaying={scene.isPlaying || false}
      onPlayToggle={() => updateScene(scene.id, { isPlaying: !scene.isPlaying })}
      onStop={() => updateScene(scene.id, { isPlaying: false })}
      onSeek={(frame) => updateScene(scene.id, { currentFrame: frame })}
      onAddKeyframe={(layerId, frameIndex) => {
        const newLayers = (layersMap[scene.id] || []).map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                keyframes: Array.from(new Set([...(layer.keyframes || []), frameIndex])),
              }
            : layer
        );
        layersMap[scene.id] = newLayers;
      }}
    />
  );
}
