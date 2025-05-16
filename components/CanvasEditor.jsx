// components/CanvasEditor.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { CanvasEngine } from "@/components/stacker/CanvasEngine";
import { useTimelinePlayer } from "@/hooks/useTimelinePlayer";
import TimelineScrubber from "@/components/stacker/TimelineScrubber";
import PlaybackBar from "@/components/stacker/PlaybackBar";

export function CanvasEditor({ draft, onPublish }) {
  const router = useRouter();
  const [layers, setLayers] = useState([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(null);

  const player = useTimelinePlayer({ totalFrames: 120, fps: 24 });

  const addLayer = (type) => {
    const newLayer = {
      id: Date.now(),
      type,
      content: type === "text" ? "New Text" : null,
      position: { x: 50, y: 50 },
      frames: [
        {
          type: "key",
          data: {
            id: Date.now(),
            type,
            content: type === "text" ? "New Text" : null,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            fill: "#f00",
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
          },
        },
      ],
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
    <div className="flex flex-col h-screen">
      <div className="flex gap-4 px-4 py-2 border-b bg-white">
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

        <div className="flex-1 border bg-gray-100 relative">
          <CanvasEngine currentFrame={player.frame} />
        </div>
      </div>

      <div className="px-4 py-2 bg-white border-t">
        <TimelineScrubber
          frame={player.frame}
          setFrame={player.setFrame}
          totalFrames={120}
        />
      </div>

      <PlaybackBar player={player} totalFrames={120} />
    </div>
  );
}
