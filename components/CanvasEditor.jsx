// components/CanvasEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function CanvasEditor({ draft, onPublish }) {
  const router = useRouter();
  const [layers, setLayers] = useState([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);

  const addLayer = (type) => {
    const newLayer = {
      id: Date.now(),
      type,
      content: type === "text" ? "New Text" : null,
      position: { x: 50, y: 50 },
    };
    setLayers((prev) => [...prev, newLayer]);
  };

  const updateLayer = (id, updates) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  const handlePublish = async () => {
    const { data: published, error: pubErr } = await supabase
      .from("published_content")
      .insert({
        auth_users_id: draft.auth_users_id,
        raw_input: draft.raw_input,
        enhanced_output: draft.enhanced_output,
        tone_id: draft.tone_id,
        format_id: draft.format_id,
        style_id: draft.style_id,
        enhancer_category: draft.enhancer_category,
        is_public: draft.is_public,
        tone: draft.tone,
        format: draft.format,
        style: draft.style,
        category: draft.category,
        output: draft.output,
      })
      .select()
      .single();

    if (pubErr) return alert("Failed to publish.");

    const { error: stackErr } = await supabase.from("stacks").insert({
      content_id: published.id,
      layers,
    });
    if (stackErr) console.error(stackErr);

    await supabase.from("enhanced_content").delete().eq("id", draft.id);
    onPublish();
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/4 space-y-2">
        <h3 className="font-bold text-lg">Layers</h3>
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedLayerIndex === index ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedLayerIndex(index)}
          >
            {layer.type} Layer
            <Button
              size="sm"
              className="ml-2 text-xs text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeLayer(layer.id);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={() => addLayer("text")}>+ Text</Button>
        <Button onClick={() => addLayer("image")}>+ Image</Button>
        <Button onClick={() => addLayer("shape")}>+ Shape</Button>
        <Button onClick={() => addLayer("ai")}>+ AI Gen Image</Button>
        <hr className="my-2" />
        <Button className="bg-green-600 w-full" onClick={handlePublish}>
          Publish
        </Button>
      </div>

      <div className="flex-1 bg-gray-50 border p-4 relative min-h-[400px]">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className="absolute cursor-move"
            style={{
              top: `${layer.position.y}px`,
              left: `${layer.position.x}px`,
              zIndex: index,
            }}
            draggable
            onDragEnd={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              updateLayer(layer.id, {
                position: { x: rect.left, y: rect.top },
              });
            }}
          >
            {layer.type === "text" && (
              <div className="p-1 bg-white border">
                <input
                  type="text"
                  value={layer.content}
                  onChange={(e) =>
                    updateLayer(layer.id, { content: e.target.value })
                  }
                  className="border p-1 rounded"
                />
              </div>
            )}
            {layer.type === "image" && (
              <div className="p-1 border">[Image Placeholder]</div>
            )}
            {layer.type === "shape" && <div className="w-10 h-10 bg-red-400" />}
            {layer.type === "ai" && (
              <div className="w-20 h-20 bg-yellow-200 border text-xs p-2">
                AI Gen Image
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
