// components/stacker/scene/AllInOnePublisherPanel.jsx

"use client";

import { useState } from "react";
import { useSceneStore } from "@/store/SceneStore";
import { Button } from "@/components/ui/button";
import { downloadAsImage, exportSceneJSON, renderSceneVideo } from "@/utils/ExportRouter";

export default function AllInOnePublisherPanel({ layersMap, canvasRef }) {
  const { scenes } = useSceneStore();
  const [exporting, setExporting] = useState(false);
  const [log, setLog] = useState("");

  const handleExport = async () => {
    setExporting(true);
    setLog("Starting export...");

    try {
      for (const scene of scenes) {
        const layers = layersMap[scene.id] || [];
        setLog((prev) => prev + `\nExporting Scene: ${scene.name || scene.id}`);

        // Export JSON
        exportSceneJSON(scene, layers);

        // Export Image
        await downloadAsImage(canvasRef.current, `${scene.name || scene.id}.png`);

        // Export Video (placeholder for MP4 export)
        await renderSceneVideo(scene, layers);

        setLog((prev) => prev + `\nScene ${scene.name || scene.id} exported.`);
      }

      setLog((prev) => prev + "\nAll scenes exported successfully!");
    } catch (err) {
      console.error(err);
      setLog((prev) => prev + `\n❌ Export failed: ${err.message}`);
    }

    setExporting(false);
  };

  return (
    <div className="p-4 bg-white shadow border rounded space-y-4">
      <h2 className="text-lg font-semibold">📦 All-in-One Publisher</h2>
      <p className="text-sm text-gray-600">
        Export all scenes as PNG, JSON, and future MP4. Ensures every frame and keyframe is preserved.
      </p>

      <Button onClick={handleExport} disabled={exporting}>
        {exporting ? "Exporting..." : "Export All Scenes"}
      </Button>

      <pre className="text-xs mt-4 whitespace-pre-wrap bg-gray-100 p-2 rounded h-48 overflow-y-auto">
        {log}
      </pre>
    </div>
  );
}
