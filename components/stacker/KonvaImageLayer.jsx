// components/stacker/KonvaImageLayer.jsx
"use client";

import React from "react";
import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

const KonvaImageLayer = React.forwardRef(({ url, ...props }, ref) => {
  const [image] = useImage(url, "anonymous");

  if (!image) return null;

  return <KonvaImage ref={ref} image={image} {...props} />;
});

KonvaImageLayer.displayName = "KonvaImageLayer";
export default KonvaImageLayer;
