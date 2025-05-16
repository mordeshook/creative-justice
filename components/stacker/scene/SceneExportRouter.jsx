// components/stacker/scene/SceneExportRouter.jsx

"use client";

import { useSceneStore } from "@/store/SceneStore";
import { useEffect, useRef, useState } from "react";
import { exportSceneAsImage, exportSceneAsVideo } from "@/utils/exportUtils";
import { Button } from "@/components/ui/button";

export default function SceneExportRouter() {
  const { scenes, currentSceneId } = useSceneStore();
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef();

  const currentScene = scenes.find((s) => s.id === currentSceneId);

  const handleExportImage = async () => {
    if (!currentScene) return;
    setExporting(true);
    await exportSceneAsImage(currentScene, canvasRef);
    setExporting(false);
  };

  const handleExportVideo = async () => {
    if (!currentScene) return;
    setExporting(true);
    await exportSceneAsVideo(currentScene, canvasRef);
    setExporting(false);
  };

  return (
    <div className="p-4 border-t bg-white shadow space-y-4">
      <h2 className="text-lg font-bold">Export Scene</h2>
      <div className="space-x-2">
        <Button onClick={handleExportImage} disabled={exporting}>
          {exporting ? "Exporting..." : "Export Image"}
        </Button>
        <Button onClick={handleExportVideo} disabled={exporting}>
          {exporting ? "Rendering..." : "Export Video"}
        </Button>
      </div>
    </div>
  );
}
