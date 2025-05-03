"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StackerCanvas from "@/components/stacker/StackerCanvas";
import ToolBar from "@/components/stacker/Toolbar";
import TextEditorDialog from "@/components/stacker/TextEditorDialog";
import ImageUploadDialog from "@/components/stacker/ImageUploadDialog";
import ExportOptions from "@/components/stacker/ExportOptions";
import AIPromptDialog from "@/components/stacker/AIPromptDialog";
import LayerOptionsPanel from "@/components/stacker/LayerOptionsPanel";
import LeftPanel from "@/components/stacker/LeftPanel";
import SaveStackDialog from "@/components/stacker/SaveStackDialog";
import useHistory from "@/components/stacker/HistoryManager";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { saveStack } from "@/components/stacker/SaveStackLogic";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

export default function EditorClient() {
  const searchParams = useSearchParams();
  const stackId = searchParams.get("id");

  const stageRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [aiDialogOpen, setAIDialogOpen] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const {
    state: layers,
    set: setLayers,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory([]);

  useEffect(() => {
    if (!stackId) return;
    const loadStack = async () => {
      const { data, error } = await supabase
        .from("stacks")
        .select("layers")
        .eq("id", stackId)
        .single();
      if (error) {
        console.error("Failed to load stack:", error);
      } else {
        setLayers(data.layers || []);
      }
    };
    loadStack();
  }, [stackId]);

  const addLayer = (type) => {
    if (type === "text") setTextDialogOpen(true);
    else if (type === "image") setImageDialogOpen(true);
    else if (type === "shape") {
      const newLayer = {
        id: Date.now(),
        type: "shape",
        shape: "rectangle",
        fill: "#FF0000",
        stroke: "#000000",
        strokeWidth: 2,
        x: CANVAS_WIDTH / 2 - 50,
        y: CANVAS_HEIGHT / 2 - 50,
        width: 100,
        height: 100,
      };
      setLayers([...layers, newLayer]);
    } else if (type === "ai") setAIDialogOpen(true);
  };

  const handleAddText = (props) => {
    const newLayer = {
      id: Date.now(),
      type: "text",
      ...props,
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
    };
    setLayers([...layers, newLayer]);
    setTextDialogOpen(false);
  };

  const handleAddImage = (preview) => {
    const newLayer = {
      id: Date.now(),
      type: "image",
      url: preview,
      x: CANVAS_WIDTH / 2 - 100,
      y: CANVAS_HEIGHT / 2 - 100,
      width: 200,
      height: 200,
    };
    setLayers([...layers, newLayer]);
    setImageDialogOpen(false);
  };

  const handleAddAIGeneratedImage = async (prompt) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("User not logged in");

      const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-stability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const { imageUrl } = await res.json();
      if (!res.ok || !imageUrl) throw new Error("Image generation failed");

      const newLayer = {
        id: Date.now(),
        type: "image",
        url: imageUrl,
        x: CANVAS_WIDTH / 2 - 100,
        y: CANVAS_HEIGHT / 2 - 100,
        width: 200,
        height: 200,
      };
      setLayers((prev) => [...prev, newLayer]);
    } catch (err) {
      console.error("❌ AI image generation error:", err);
      toast.error(err.message || "AI image generation failed.");
    }
  };

  const handleSaveStack = async (stackName) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await saveStack({
      stageRef,
      stackId,
      layers,
      user,
      stackName,
    });
  };

  const updateLayer = (id, updates) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const removeLayer = (id) => {
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveLayer = (index, direction) => {
    const newLayers = [...layers];
    const target = newLayers.splice(index, 1)[0];
    newLayers.splice(index + direction, 0, target);
    setLayers(newLayers);
  };

  const toggleVisibility = (id) => {
    updateLayer(id, { visible: !layers.find((l) => l.id === id)?.visible });
  };

  const toggleLock = (id) => {
    updateLayer(id, { locked: !layers.find((l) => l.id === id)?.locked });
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden items-start justify-start">
      <ToolBar
        onAddLayer={addLayer}
        onUndo={undo}
        onRedo={redo}
        onExport={() => setSaveDialogOpen(true)}
      />

      <div className="flex flex-grow min-h-0 w-full overflow-hidden">
        <LeftPanel
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={removeLayer}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
          onMoveLayer={moveLayer}
          onAddShape={(shape) => setLayers([...layers, { id: Date.now(), ...shape }])}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          stageRef={stageRef}
        />

        <div className="flex-1 flex items-center justify-center bg-gray-100 min-w-0 min-h-0 overflow-auto">
          <div className="w-[1000px] h-[800px] flex items-center justify-center">
            <StackerCanvas
              stageRef={stageRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              layers={layers}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={updateLayer}
              backgroundColor={backgroundColor}
            />
          </div>
        </div>

        <div className="w-80 shrink-0 border-l bg-white shadow overflow-y-auto">
          {selectedId ? (
            <LayerOptionsPanel
              layer={layers.find((l) => l.id === selectedId)}
              onUpdate={(updates) => updateLayer(selectedId, updates)}
            />
          ) : (
            <div className="p-4 text-gray-400 italic text-sm">Select a layer to edit</div>
          )}
        </div>
      </div>

      <TextEditorDialog open={textDialogOpen} onClose={() => setTextDialogOpen(false)} onSave={handleAddText} />
      <ImageUploadDialog isOpen={imageDialogOpen} onClose={() => setImageDialogOpen(false)} onUpload={handleAddImage} />
      <AIPromptDialog
        open={aiDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        onSubmit={handleAddAIGeneratedImage}
        prompt={aiPrompt}
        setPrompt={setAIPrompt}
      />
      <SaveStackDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={(stackName) => {
          handleSaveStack(stackName);
          setSaveDialogOpen(false);
        }}
      />
    </div>
  );
}
