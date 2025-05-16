// hooks/useInspectorBindings.js
import { useEffect } from 'react';

export function useInspectorBindings({ selectedShapeRef, inspector }) {
  useEffect(() => {
    if (selectedShapeRef.current) {
      const shape = selectedShapeRef.current;
      shape.fill(inspector.fill);
      shape.stroke(inspector.stroke);
      shape.opacity(inspector.alpha / 100);
      shape.strokeWidth(inspector.strokeWidth);
      shape.getLayer().batchDraw();
    }
  }, [inspector, selectedShapeRef]);
}