"use client";

import { Button } from "@/components/ui/Button";
import LayerListItem from "@/components/panels/LayerListItem";

export default function LeftSidebar({ layers, selectedId, onSelect, onRemove, onReorder, onToggleVisibility, onToggleLock }) {
  return (
    <div className="w-72 bg-gray-50 border-r p-2 overflow-y-auto">
      <h2 className="text-sm font-bold mb-2">Layers</h2>
      <div className="space-y-1">
        {layers.map((layer, index) => (
          <LayerListItem
            key={layer.id}
            layer={layer}
            selected={layer.id === selectedId}
            onSelect={() => onSelect(layer.id)}
            onRemove={() => onRemove(layer.id)}
            onToggleVisibility={() => onToggleVisibility(layer.id)}
            onToggleLock={() => onToggleLock(layer.id)}
            onMoveUp={() => onReorder(index, -1)}
            onMoveDown={() => onReorder(index, 1)}
          />
        ))}
      </div>
    </div>
  );
}
