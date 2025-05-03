"use client";

import LayerSettings from "@/components/panels/LayerSettings";

export default function RightInspector({ layer, onUpdate }) {
  return (
    <div className="w-80 bg-white border-l p-4 overflow-y-auto">
      {layer ? (
        <LayerSettings layer={layer} onUpdate={onUpdate} />
      ) : (
        <div className="text-gray-400 italic text-sm">Select a layer to edit properties</div>
      )}
    </div>
  );
}
