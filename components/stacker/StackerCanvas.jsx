// components/stacker/StackerCanvas.jsx

"use client";

import { useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image,
  Transformer,
  Circle,
  Ellipse,
  Star,
} from "react-konva";
import useImage from "use-image";

const shapeComponentMap = {
  rectangle: Rect,
  circle: Circle,
  ellipse: Ellipse,
  star: Star,
};

export default function StackerCanvas({
  stageRef,
  width,
  height,
  layers,
  selectedId,
  onSelect,
  onChange,
  backgroundColor = "#ffffff",
}) {
  const trRef = useRef();
  const shapeRefs = useRef({});

  useEffect(() => {
    const node = shapeRefs.current[selectedId];
    if (node && trRef.current) {
      trRef.current.nodes([node]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, layers]);

  return (
    <div className="border shadow bg-white inline-block">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="border"
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) onSelect(null);
        }}
      >
        {/* Background Layer */}
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={backgroundColor === "transparent" ? undefined : backgroundColor}
            listening={false}
          />
        </Layer>

        {/* Content Layer */}
        <Layer>
          {layers.map((layer) => {
            if (layer.visible === false) {
              return null; // 🔥 Hide if not visible
            }

            if (layer.type === "text") {
              return (
                <Text
                  key={layer.id}
                  ref={(el) => (shapeRefs.current[layer.id] = el)}
                  text={layer.content}
                  x={layer.x}
                  y={layer.y}
                  fontSize={layer.fontSize || 24}
                  fontFamily={layer.fontFamily || "Arial"}
                  fill={layer.fill || "#000"}
                  draggable={!layer.locked}
                  onClick={() => !layer.locked && onSelect(layer.id)}
                  onTap={() => !layer.locked && onSelect(layer.id)}
                  onDragEnd={(e) =>
                    onChange(layer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onTransformEnd={(e) => {
                    const node = shapeRefs.current[layer.id];
                    onChange(layer.id, {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      scaleX: 1,
                      scaleY: 1,
                    });
                  }}
                />
              );
            }

            if (layer.type === "image") {
              return (
                <EditableImage
                  key={layer.id}
                  layer={layer}
                  onSelect={onSelect}
                  onChange={onChange}
                  shapeRefs={shapeRefs}
                />
              );
            }

            if (layer.type === "shape") {
              const Shape = shapeComponentMap[layer.shape] || Rect;
              return (
                <Shape
                  key={layer.id}
                  ref={(el) => (shapeRefs.current[layer.id] = el)}
                  x={layer.x}
                  y={layer.y}
                  width={layer.width}
                  height={layer.height}
                  fill={layer.fill}
                  stroke={layer.stroke}
                  strokeWidth={layer.strokeWidth}
                  numPoints={layer.shape === "star" ? 5 : undefined}
                  innerRadius={layer.shape === "star" ? 20 : undefined}
                  outerRadius={layer.shape === "star" ? 40 : undefined}
                  draggable={!layer.locked}
                  onClick={() => !layer.locked && onSelect(layer.id)}
                  onTap={() => !layer.locked && onSelect(layer.id)}
                  onDragEnd={(e) =>
                    onChange(layer.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onTransformEnd={(e) => {
                    const node = shapeRefs.current[layer.id];
                    onChange(layer.id, {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      scaleX: 1,
                      scaleY: 1,
                    });
                  }}
                />
              );
            }

            return null;
          })}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </div>
  );
}

function EditableImage({ layer, onSelect, onChange, shapeRefs }) {
  const [image] = useImage(layer.url, "anonymous");

  if (layer.visible === false) return null; // 🔥 Hide invisible images

  return (
    <Image
      key={layer.id}
      ref={(el) => (shapeRefs.current[layer.id] = el)}
      image={image}
      x={layer.x}
      y={layer.y}
      width={layer.width || 200}
      height={layer.height || 200}
      draggable={!layer.locked}
      onClick={() => !layer.locked && onSelect(layer.id)}
      onTap={() => !layer.locked && onSelect(layer.id)}
      onDragEnd={(e) =>
        onChange(layer.id, {
          x: e.target.x(),
          y: e.target.y(),
        })
      }
      onTransformEnd={(e) => {
        const node = shapeRefs.current[layer.id];
        onChange(layer.id, {
          x: node.x(),
          y: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1,
        });
      }}
    />
  );
}
