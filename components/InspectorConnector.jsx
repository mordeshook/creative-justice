// components/InspectorConnector.jsx
import React, { useEffect } from 'react';

export default function InspectorConnector({ selectedShapeRef, fill, stroke, alpha, onUpdate }) {
  useEffect(() => {
    if (selectedShapeRef?.current) {
      selectedShapeRef.current.fill(fill);
      selectedShapeRef.current.stroke(stroke);
      selectedShapeRef.current.opacity(alpha / 100);
      selectedShapeRef.current.getLayer().batchDraw();
    }
  }, [fill, stroke, alpha, selectedShapeRef]);

  return null;
}