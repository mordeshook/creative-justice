// components/stacker/scene/SceneEditorLayout.jsx

"use client";

import SceneTimeline from "./SceneTimeline";
import AllInOnePublisherPanel from "./AllInOnePublisherPanel";
import ScenePanelSelector from "./ScenePanelSelector";
import { useRef } from "react";

export default function SceneEditorLayout({ layersMap }) {
  const canvasRef = useRef(null);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between p-2 bg-gray-100 border-b">
        <ScenePanelSelector />
        <AllInOnePublisherPanel layersMap={layersMap} canvasRef={canvasRef} />
      </div>

      <div className="flex-1 bg-white flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1000}
          height={800}
          className="border shadow-lg"
        />
      </div>

      <SceneTimeline layersMap={layersMap} />
    </div>
  );
}
