"use client";

import React, { useState, useEffect } from "react";
import { CanvasEngine } from "@/components/stacker/CanvasEngine";
import ToolBar from "@/components/stacker/Toolbar";
import LeftPanel from "@/components/stacker/LeftPanel";
import { useLayerState } from "@/components/stacker/hooks/useLayerState";
import TimelinePanel from "@/components/stacker/TimelinePanel";
import LayerOptionsPanel from "@/components/stacker/LayerOptionsPanel";
import CuePointPanel from "@/components/stacker/panels/CuePointPanel";
import TextEditorDialog from "@/components/stacker/TextEditorDialog";
import ImageUploadDialog from "@/components/stacker/ImageUploadDialog";
import AIPromptDialog from "@/components/stacker/AIPromptDialog";
import SaveStackDialog from "@/components/stacker/SaveStackDialog";
import TimelineScrubber from "@/components/stacker/TimelineScrubber";
import { useTimelinePlayer } from "@/components/stacker/hooks/useTimelinePlayer";
import { useUndoManager } from "@/components/stacker/hooks/useUndoManager";
import { useToolSelector } from "@/components/stacker/hooks/useToolSelector";
import { useAIPromptDialog } from "@/components/stacker/hooks/useAIPromptDialog";

export default function EditorClient_Konva() {
  useToolSelector();

  const {
    layers = [],
    setLayers = () => {},
    selectedId = null,
    setSelectedId = () => {},
  } = useLayerState() || {};

  const undoManager = useUndoManager() || {};
  const { undo = () => {}, redo = () => {} } = undoManager;

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [editingText, setEditingText] = useState(null);
  const [activeSymbolId, setActiveSymbolId] = useState(null);
  const [symbolLibrary, setSymbolLibrary] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  const timelinePlayer = useTimelinePlayer({ fps: 24, totalFrames: 120 }) || {};
  const { frame = 0, setFrame = () => {}, play = () => {}, stop = () => {} } = timelinePlayer;
  const [isPlaying, setIsPlaying] = useState(false);

  const aiPrompt = useAIPromptDialog({
    onInsertLayer: (newLayer) => {
      setLayers((prev) => [...prev, newLayer]);
    },
  });

  // Fake initial symbol for testing
  useEffect(() => {
    setSymbolLibrary({
      "test-symbol": {
        layers: [
          {
            id: "inner-text",
            type: "text",
            content: "Inside Symbol!",
            fontSize: 32,
            x: 200,
            y: 250,
            keyframes: [0],
            frames: {
              0: {
                type: "key",
                data: {
                  id: "inner-text",
                  type: "text",
                  content: "Inside Symbol!",
                  fontSize: 32,
                  x: 200,
                  y: 250,
                },
              },
            },
          },
        ],
      },
    });
  }, []);

  const onAddKeyframe = (layerId, frameIndex) => {
    const update = (layers) =>
      layers.map((l) =>
        l.id === layerId
          ? {
              ...l,
              keyframes: [...new Set([...(l.keyframes || []), frameIndex])],
            }
          : l
      );

    if (activeSymbolId) {
      setSymbolLibrary((prev) => ({
        ...prev,
        [activeSymbolId]: { layers: update(prev[activeSymbolId]?.layers || []) },
      }));
    } else {
      setLayers(update);
    }
  };

  const onPlayToggle = () => {
    isPlaying ? stop() : play();
    setIsPlaying(!isPlaying);
  };

  const onStop = () => {
    stop();
    setIsPlaying(false);
  };

  const onSeek = (frameNum) => setFrame(frameNum);
  const onFrameScrub = (frameNum) => setFrame(frameNum);

  const symbolLayers = symbolLibrary[activeSymbolId]?.layers || [];

const handleLayerUpdate = (id, updates) => {
  const update = (layers) =>
    layers.map((layer) => {
      if (layer.id !== id) return layer;
      const frameData = layer.frames?.[frame];
      if (!frameData || frameData.type !== "key") return layer;

      return {
        ...layer,
        frames: {
          ...layer.frames,
          [frame]: {
            ...frameData,
            data: {
              ...frameData.data,
              ...updates,
            },
          },
        },
      };
    });

  if (activeSymbolId) {
    setSymbolLibrary((prev) => ({
      ...prev,
      [activeSymbolId]: {
        layers: update(prev[activeSymbolId]?.layers || []),
      },
    }));
  } else {
    setLayers(update);
  }
};


  const currentLayers = activeSymbolId ? symbolLayers : layers;

  return (
    <>
      <ToolBar
        onAddLayer={(type) => {
          const newId = Date.now();
          const base = {
            id: newId,
            type,
            content: type === "text" ? "New Heading" : "New Paragraph",
            fontSize: type === "text" ? 28 : 16,
            x: 500,
            y: 300,
            keyframes: [0],
            frames: {
              0: {
                type: "key",
                data: {
                  id: newId,
                  type,
                  content: type === "text" ? "New Heading" : "New Paragraph",
                  x: 500,
                  y: 300,
                  fontSize: type === "text" ? 28 : 16,
                },
              },
            },
          };

          if (type === "ai") {
            aiPrompt.toggle();
          } else if (type === "text" || type === "paragraph") {
            activeSymbolId
              ? setSymbolLibrary((prev) => ({
                  ...prev,
                  [activeSymbolId]: {
                    layers: [...(prev[activeSymbolId]?.layers || []), base],
                  },
                }))
              : setLayers((prev) => [...prev, base]);
          } else if (type === "image") {
            setShowImageUpload(true);
          } else if (type === "shape") {
            const shape = {
              id: newId,
              type: "shape",
              fill: "#FF0000",
              stroke: "#000000",
              strokeWidth: 2,
              x: 500,
              y: 400,
              keyframes: [0],
              frames: {
                0: {
                  type: "shape",
                  x: 500,
                  y: 400,
                  fill: "#FF0000",
                  stroke: "#000000",
                  strokeWidth: 2,
                },
              },
            };
            activeSymbolId
              ? setSymbolLibrary((prev) => ({
                  ...prev,
                  [activeSymbolId]: {
                    layers: [...(prev[activeSymbolId]?.layers || []), shape],
                  },
                }))
              : setLayers((prev) => [...prev, shape]);
          }
        }}
        onUndo={undo}
        onRedo={redo}
        onExport={() => {}}
      />

      {selectedIds.length > 1 && (
        <div className="bg-blue-100 text-sm px-4 py-2 flex items-center justify-between">
          <div>{selectedIds.length} layers selected</div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              const newSymbolId = "symbol-" + Date.now();
              const selectedLayers = currentLayers.filter((l) => selectedIds.includes(l.id));
              const symbolInstance = {
                id: Date.now(),
                type: "symbol",
                symbolId: newSymbolId,
                x: 500,
                y: 300,
                keyframes: [0],
                frames: {
                  0: {
                    type: "key",
                    data: {
                      id: Date.now(),
                      type: "symbol",
                      symbolId: newSymbolId,
                      x: 500,
                      y: 300,
                    },
                  },
                },
              };

              setSymbolLibrary((prev) => ({
                ...prev,
                [newSymbolId]: { layers: selectedLayers },
              }));

              setLayers((prev) => [
                ...prev.filter((l) => !selectedIds.includes(l.id)),
                symbolInstance,
              ]);

              setSelectedIds([]);
            }}
          >
            Convert to Symbol
          </button>
        </div>
      )}

      <div className="flex">
        <LeftPanel
          layers={currentLayers}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setSelectedIds([id]);
          }}
          onRemove={(id) =>
            activeSymbolId
              ? setSymbolLibrary((prev) => ({
                  ...prev,
                  [activeSymbolId]: {
                    layers: prev[activeSymbolId].layers.filter((l) => l.id !== id),
                  },
                }))
              : setLayers((prev) => prev.filter((l) => l.id !== id))
          }
          onToggleVisibility={(id) => handleLayerUpdate(id, { visible: false })}
          onToggleLock={(id) => handleLayerUpdate(id, { locked: true })}
          onMoveLayer={() => {}}
          onAddShape={() => {}}
          stageRef={{ current: null }}
        />

        <div className="flex-1">
          {activeSymbolId && (
            <div className="bg-yellow-100 text-sm px-4 py-2 font-bold flex justify-between items-center">
              Editing Symbol: {activeSymbolId}
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => setActiveSymbolId(null)}
              >
                Exit Symbol
              </button>
            </div>
          )}

          <CanvasEngine
            layers={currentLayers}
            currentFrame={frame}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={(id) => {
              setSelectedId(id);
              setSelectedIds([id]); // you can add multi-select logic later
            }}
            onChange={handleLayerUpdate}
            onDoubleClick={(id) => {
              const layer = currentLayers.find((l) => l.id === id);
              if (layer?.type === "symbol") {
                setActiveSymbolId(layer.symbolId);
              } else if (layer?.type === "text" || layer?.type === "paragraph") {
                setEditingText({
                  id,
                  content: layer.frames[frame]?.data?.content || "",
                });
              }
            }}
          />

          <TimelineScrubber frame={frame} setFrame={setFrame} />
        </div>

        <div className="w-[280px] border-l bg-white overflow-y-auto">
          <LayerOptionsPanel
            layer={currentLayers.find((l) => l.id === selectedId)}
            onUpdate={(updates) => handleLayerUpdate(selectedId, updates)}
          />
          {selectedId && (
            <CuePointPanel
              layerId={selectedId}
              currentFrame={frame}
              onAddCue={(cue) => console.log("Cue added", cue)}
              onRemoveCue={(id) => console.log("Cue removed", id)}
            />
          )}
        </div>
      </div>

      <TimelinePanel
        layers={currentLayers}
        currentFrame={frame}
        totalFrames={120}
        onSeek={onSeek}
        onAddKeyframe={onAddKeyframe}
        onFrameScrub={onFrameScrub}
        onPlayToggle={onPlayToggle}
        onStop={onStop}
        isPlaying={isPlaying}
        onToggleVisibility={(id) => handleLayerUpdate(id, { visible: false })}
        onToggleLock={(id) => handleLayerUpdate(id, { locked: true })}
        onRenameLayer={() => {}}
        onDeleteLayer={() => {}}
      />

      <TextEditorDialog
        open={!!editingText}
        onClose={() => setEditingText(null)}
        value={editingText?.content || ""}
        onSave={(newText) => {
          setLayers((prev) =>
            prev.map((layer) => {
              if (layer.id !== editingText.id) return layer;
              return {
                ...layer,
                frames: {
                  ...layer.frames,
                  [frame]: {
                    ...layer.frames[frame],
                    data: {
                      ...layer.frames[frame].data,
                      content: newText,
                    },
                  },
                },
              };
            })
          );
          setEditingText(null);
        }}
      />

      <SaveStackDialog open={false} onClose={() => {}} onSave={() => {}} />

      <AIPromptDialog
        open={aiPrompt.open}
        onClose={aiPrompt.close}
        onSubmit={aiPrompt.onSubmit}
        prompt={aiPrompt.prompt}
        setPrompt={aiPrompt.setPrompt}
      />

      <ImageUploadDialog
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={(previewUrl) => {
          const newId = Date.now();
          const layer = {
            id: newId,
            type: "image",
            url: previewUrl,
            x: 500,
            y: 400,
            width: 512,
            height: 512,
            opacity: 1,
            keyframes: [0],
            frames: {
              0: {
                type: "key",
                data: {
                  id: newId,
                  type: "image",
                  url: previewUrl,
                  x: 500,
                  y: 400,
                  width: 512,
                  height: 512,
                  opacity: 1,
                },
              },
            },
          };
          activeSymbolId
            ? setSymbolLibrary((prev) => ({
                ...prev,
                [activeSymbolId]: {
                  layers: [...(prev[activeSymbolId]?.layers || []), layer],
                },
              }))
            : setLayers((prev) => [...prev, layer]);
        }}
      />
    </>
  );
}
