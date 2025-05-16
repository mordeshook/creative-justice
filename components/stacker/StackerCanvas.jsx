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
  currentFrame = 0,
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

  const getAnimatedProps = (layer) => {
    if (!layer.animations || !Array.isArray(layer.animations)) return layer;
    const keyframe = layer.animations.find((f) => f.frame === currentFrame);
    if (!keyframe) return layer;
    return {
      ...layer,
      ...keyframe.props,
    };
  };

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
            const display = getAnimatedProps(layer);

            if (display.visible === false) return null;

            if (display.type === "text") {
              return (
                <Text
                  key={display.id}
                  ref={(el) => (shapeRefs.current[display.id] = el)}
                  text={display.content}
                  x={display.x}
                  y={display.y}
                  fontSize={display.fontSize || 24}
                  fontFamily={display.fontFamily || "Arial"}
                  fill={display.fill || "#000"}
                  draggable={!display.locked}
                  onClick={() => !display.locked && onSelect(display.id)}
                  onTap={() => !display.locked && onSelect(display.id)}
                  onDragEnd={(e) =>
                    onChange(display.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onTransformEnd={(e) => {
                    const node = shapeRefs.current[display.id];
                    onChange(display.id, {
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

            if (display.type === "image") {
              return (
                <EditableImage
                  key={display.id}
                  layer={display}
                  onSelect={onSelect}
                  onChange={onChange}
                  shapeRefs={shapeRefs}
                />
              );
            }

            if (display.type === "shape") {
              const Shape = shapeComponentMap[display.shape] || Rect;
              return (
                <Shape
                  key={display.id}
                  ref={(el) => (shapeRefs.current[display.id] = el)}
                  x={display.x}
                  y={display.y}
                  width={display.width}
                  height={display.height}
                  fill={display.fill}
                  stroke={display.stroke}
                  strokeWidth={display.strokeWidth}
                  numPoints={display.shape === "star" ? 5 : undefined}
                  innerRadius={display.shape === "star" ? 20 : undefined}
                  outerRadius={display.shape === "star" ? 40 : undefined}
                  draggable={!display.locked}
                  onClick={() => !display.locked && onSelect(display.id)}
                  onTap={() => !display.locked && onSelect(display.id)}
                  onDragEnd={(e) =>
                    onChange(display.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  onTransformEnd={(e) => {
                    const node = shapeRefs.current[display.id];
                    onChange(display.id, {
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

  if (layer.visible === false) return null;

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
