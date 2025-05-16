// components/ShapeTransformer.jsx
import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

export default function ShapeTransformer({ selectedShape }) {
  const transformerRef = useRef(null);

  useEffect(() => {
    if (selectedShape && transformerRef.current) {
      transformerRef.current.nodes([selectedShape]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShape]);

  return <Transformer ref={transformerRef} />;
}
