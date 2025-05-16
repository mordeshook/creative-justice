// components/stacker/CanvasEngine.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text, Transformer } from "react-konva";
import KonvaImageLayer from "@/components/stacker/KonvaImageLayer";

function applyEasing(t, type) {
  switch (type) {
    case "easeIn": return t * t;
    case "easeOut": return t * (2 - t);
    case "easeInOut": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default: return t;
  }
}

function interpolateFrameData(from, to, t) {
  return {
    ...from,
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    scaleX: from.scaleX + (to.scaleX - from.scaleX) * t,
    scaleY: from.scaleY + (to.scaleY - from.scaleY) * t,
    rotation: from.rotation + (to.rotation - from.rotation) * t,
    opacity: from.opacity + (to.opacity - from.opacity) * t,
  };
}

export function CanvasEngine({
  layers = [],
  currentFrame = 0,
  selectedId = null,
  onSelect = () => {},
  onChange = () => {},
  onDoubleClick = () => {},
}) {
  const stageRef = useRef(null);
  const trRef = useRef();
  const shapeRefs = useRef({});

  useEffect(() => {
    const node = shapeRefs.current[selectedId];
    if (node && trRef.current) {
      trRef.current.nodes([node]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, layers]);

  const renderLayerAtFrame = (layer) => {
    const frame = layer.frames?.[currentFrame];
    if (!frame || frame.type === "blank") return null;

    const data =
      frame.type === "key"
        ? frame.data
        : frame.type === "tween"
        ? interpolateFrameData(
            layer.frames?.[frame.fromKeyIndex]?.data || {},
            layer.frames?.[frame.toKeyIndex]?.data || {},
            applyEasing(
              (currentFrame - frame.fromKeyIndex) / (frame.toKeyIndex - frame.fromKeyIndex),
              frame.easing || "linear"
            )
          )
        : null;

    if (!data || data.visible === false) return null;

    const common = {
      key: layer.id,
      ref: (el) => (shapeRefs.current[layer.id] = el),
      x: data.x ?? 0,
      y: data.y ?? 0,
      scaleX: data.scaleX ?? 1,
      scaleY: data.scaleY ?? 1,
      rotation: data.rotation ?? 0,
      opacity: data.opacity ?? 1,
      draggable: !data.locked,
      onClick: () => !data.locked && onSelect(layer.id),
      onTap: () => !data.locked && onSelect(layer.id),
      onDblClick: () => !data.locked && onDoubleClick(layer.id),
      onDragEnd: (e) => {
        onChange(layer.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      },
      onTransformEnd: (e) => {
        const node = shapeRefs.current[layer.id];
        if (!node) return;
        onChange(layer.id, {
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1,
          rotation: node.rotation(),
        });
      },
    };

    switch (data.type) {
      case "text":
      case "paragraph":
        return (
          <Text
            {...common}
            text={data.text}
            fontSize={data.fontSize || 24}
            fontFamily={data.fontFamily || "Arial"}
            fill={data.fill || "#000"}
            width={data.width || 400}
            height={data.height}
            align="left"
            wrap={data.type === "paragraph" ? "word" : "none"}
          />
        );
      case "image":
        return (
          <KonvaImageLayer
            {...common}
            url={data.url}
            width={data.width || 300}
            height={data.height || 300}
          />
        );
      case "shape":
        return (
          <Rect
            {...common}
            width={data.width || 100}
            height={data.height || 100}
            fill={data.fill || "#f00"}
            stroke={data.stroke || "#000"}
            strokeWidth={data.strokeWidth || 1}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage width={1000} height={800} ref={stageRef} className="bg-white border">
      <Layer>
        <Rect x={0} y={0} width={1000} height={800} fill="#fff" listening={false} />
      </Layer>
      <Layer>
        {layers.map((layer) => renderLayerAtFrame(layer))}
        <Transformer ref={trRef} />
      </Layer>
    </Stage>
  );
}
