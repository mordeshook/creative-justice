"use client";

import { useState, useRef } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import useImage from "use-image";

function URLImage({ image, ...props }) {
  const [img] = useImage(image);
  return <Image image={img} {...props} />;
}

export default function EditorClient() {
  const router = useRouter();
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const fileInputRef = useRef(null);

  const addLayer = (type) => {
    if (type === "image") {
      fileInputRef.current.click();
      return;
    }

    const id = Date.now();
    const newLayer = {
      id,
      type,
      x: 50,
      y: 50,
      text: type === "text" ? "Edit me" : "",
      fill: type === "shape" ? "red" : "black",
      width: 100,
      height: 100,
    };

    setLayers((prev) => [...prev, newLayer]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const id = Date.now();
      const newLayer = {
        id,
        type: "image",
        x: 100,
        y: 100,
        src: reader.result,
      };
      setLayers((prev) => [...prev, newLayer]);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (id, e) => {
    const { x, y } = e.target.position();
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, x, y } : layer
      )
    );
  };

  const renderLayer = (layer) => {
    if (layer.type === "text") {
      return (
        <Text
          key={layer.id}
          text={layer.text}
          x={layer.x}
          y={layer.y}
          fontSize={20}
          draggable
          onClick={() => setSelectedLayer(layer.id)}
          onDragEnd={(e) => handleDragEnd(layer.id, e)}
        />
      );
    } else if (layer.type === "shape") {
      return (
        <Rect
          key={layer.id}
          x={layer.x}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          fill={layer.fill}
          draggable
          onClick={() => setSelectedLayer(layer.id)}
          onDragEnd={(e) => handleDragEnd(layer.id, e)}
        />
      );
    } else if (layer.type === "image") {
      return (
        <URLImage
          key={layer.id}
          image={layer.src}
          x={layer.x}
          y={layer.y}
          width={200}
          height={200}
          draggable
          onClick={() => setSelectedLayer(layer.id)}
          onDragEnd={(e) => handleDragEnd(layer.id, e)}
        />
      );
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 space-y-2 p-4">
        <button onClick={() => addLayer("text")}>+ Text</button>
        <button onClick={() => addLayer("shape")}>+ Shape</button>
        <button onClick={() => addLayer("image")}>+ Image</button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>
      <div className="flex-1 border bg-gray-100">
        <Stage width={800} height={600}>
          <Layer>
            {layers.map((layer) => renderLayer(layer))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
