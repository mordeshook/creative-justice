// components/stacker/hooks/useLayerState.js
import { useState } from 'react';
import { Rect, Text, Circle, Line, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

export function useLayerState() {
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const renderLayers = () =>
    layers.map((layer, i) => {
      if (layer.type === 'image') {
        const [image] = useImage(layer.url);
        return <KonvaImage key={layer.id || i} image={image} {...layer} />;
      }

      const Component = {
        rect: Rect,
        circle: Circle,
        text: Text,
        line: Line,
      }[layer.type];

      return Component ? <Component key={layer.id || i} {...layer} /> : null;
    });

  return { layers, setLayers, selectedId, setSelectedId, renderLayers };
}
