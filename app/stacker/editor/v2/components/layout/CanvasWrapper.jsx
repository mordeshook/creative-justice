"use client";

import StackerCanvas from "@/components/stacker/StackerCanvas";

export default function CanvasWrapper({ stageRef, layers, selectedId, onSelect, onChange }) {
  return (
    <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-100">
      <div className="relative w-[1000px] h-[800px] bg-white border shadow">
        <StackerCanvas
          stageRef={stageRef}
          width={1000}
          height={800}
          layers={layers}
          selectedId={selectedId}
          onSelect={onSelect}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
