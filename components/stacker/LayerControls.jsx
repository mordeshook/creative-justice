//components\stacker\LayerControls.jsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LayerControls({
  layers,
  selectedId,
  onSelect,
  onRemove,
  onToggleVisibility,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  onRename, // 🔥 Optional: for external control
}) {
  const handleRename = (layerId, newName) => {
    if (onRename) {
      onRename(layerId, newName);
    }
  };

  // Safety check for layers array
  if (!Array.isArray(layers)) return <p className="text-sm text-red-500">⚠️ Layer data not available</p>;

  return (
    <div className="w-full space-y-2">
      <h2 className="font-semibold text-lg">Stacks</h2>
      
      {/* Handle case where no layers exist */}
      {layers.length === 0 && (
        <p className="text-sm text-gray-500">No stacks yet</p>
      )}

      {/* Loop through layers safely */}
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          className={cn(
            "border p-2 rounded cursor-pointer space-y-2",
            selectedId === layer.id ? "bg-blue-100 border-blue-400" : "bg-white"
          )}
          onClick={() => onSelect(layer.id)}
        >
          <input
            type="text"
            value={layer.name || layer.type}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleRename(layer.id, e.target.value)}
            className="w-full text-sm font-medium border rounded px-2 py-1"
          />

          <div className="flex items-center flex-wrap gap-1">
            <Button
              size="icon"
              variant="ghost"
              title="Move up"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(index);
              }}
            >
              ⬆️
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Move down"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(index);
              }}
            >
              ⬇️
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Toggle visibility"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(layer.id);
              }}
            >
              {layer.visible === false ? "🙈" : "👁️"}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Lock/Unlock"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(layer.id);
              }}
            >
              {layer.locked ? "🔒" : "🔓"}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Delete"
              className="w-8 h-8 p-0 flex items-center justify-center text-lg"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(layer.id);
              }}
            >
              ❌
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
