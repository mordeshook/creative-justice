// components/LayerManager.jsx
import React from 'react';

export default function LayerManager({ layers, setSelectedId, selectedId }) {
  return (
    <div className="layer-manager p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Layers</h2>
      <ul>
        {layers.map((layer, i) => (
          <li
            key={i}
            onClick={() => setSelectedId(layer.id)}
            className={`cursor-pointer p-1 ${selectedId === layer.id ? 'bg-blue-100' : ''}`}
          >
            {layer.name || layer.type} ({layer.id})
          </li>
        ))}
      </ul>
    </div>
  );
}