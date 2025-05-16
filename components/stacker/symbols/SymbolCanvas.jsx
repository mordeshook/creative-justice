// components/stacker/symbols/SymbolCanvas.jsx

"use client";

import { useCallback } from "react";
import { useSymbolEditor } from "./useSymbolEditor";
import SymbolTimelinePanel from "./SymbolTimelinePanel";
import StackerCanvas from "../StackerCanvas";
import SymbolBreadcrumb from "./SymbolBreadcrumb";
import { BoneHierarchyManager } from "./BoneHierarchyManager";

const boneManager = new BoneHierarchyManager(); // Global bone manager per symbol

export default function SymbolCanvas() {
  const {
    currentSymbol,
    layers,
    selectedId,
    setSelectedId,
    currentFrame,
    isPlaying,
    setCurrentFrame,
    setIsPlaying,
    updateLayer,
    addKeyframe,
    toggleVisibility,
    toggleLock,
    renameLayer,
    deleteLayer,
    insertBlankKeyframe,
    insertFrame,
    removeFrame,
    convertToSymbol,
    setEasing,
    adjustDuration,
    breadcrumb,
    exitSymbol,

    /**
     * motionPaths: Object containing interpolated motion tween path data.
     * 
     * Structure:
     * {
     *   [layerId]: [
     *     {
     *       frame: number,   // Frame index
     *       x: number,       // X position
     *       y: number,       // Y position
     *       scaleX?: number, // Optional scale X
     *       scaleY?: number, // Optional scale Y
     *       rotation?: number, // Optional rotation angle in degrees
     *       opacity?: number   // Optional opacity value (0-1)
     *     },
     *     ...
     *   ]
     * }
     * 
     * Purpose:
     * - Used for animating layer properties between keyframes.
     * - Renders tween paths visually on canvas and timeline.
     * - Currently supports position-based interpolation.
     * - Support for shape tweening and skeletal animation (bone tool) is in development.
     */
    motionPaths,

    /**
     * frameScrub: Function triggered while user scrubs the timeline.
     * Updates the current frame number dynamically.
     */
    frameScrub,

    /**
     * onDoubleClickFrame: Triggered when user double-clicks a frame in the timeline.
     * Intended for inserting or converting keyframes on the fly.
     */
    onDoubleClickFrame,

    /**
     * onDoubleClickLayer: Triggered when user double-clicks a layer label.
     * Allows entering MovieClip editing mode.
     * Future: Will also support direct entry to shape tween or bone rig editing.
     */
    onDoubleClickLayer,
  } = useSymbolEditor();

  // Memoized frameScrub to avoid unnecessary re-renders during timeline scrubbing
  const memoizedFrameScrub = useCallback(frameScrub, [frameScrub]);

  // Show placeholder if no symbol is selected
  if (!currentSymbol) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 italic space-y-4">
        <div>No symbol selected for editing.</div>
        <button
          className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          onClick={exitSymbol}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Breadcrumb for navigating nested symbol hierarchy */}
      <SymbolBreadcrumb path={breadcrumb} onExit={exitSymbol} />

      {/* Canvas for rendering current symbol layers */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <StackerCanvas
          stageRef={null}
          width={1000}
          height={800}
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={updateLayer}
          backgroundColor="#fff"
          currentFrame={currentFrame}
          motionPaths={motionPaths}
          onDoubleClickLayer={onDoubleClickLayer}
          boneManager={boneManager} // 🔥 Inject bone hierarchy for manipulation/visibility
        />
      </div>

      {/* Timeline panel for editing frames and tweening */}
      <SymbolTimelinePanel
        layers={layers}
        currentFrame={currentFrame}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onStop={() => setIsPlaying(false)}
        onSeek={setCurrentFrame}
        onAddKeyframe={addKeyframe}
        onToggleVisibility={toggleVisibility}
        onToggleLock={toggleLock}
        onRenameLayer={renameLayer}
        onDeleteLayer={deleteLayer}
        onInsertBlankKeyframe={insertBlankKeyframe}
        onInsertFrame={insertFrame}
        onRemoveFrame={removeFrame}
        onConvertToSymbol={convertToSymbol}
        onSetEasing={setEasing}
        onAdjustDuration={adjustDuration}
        onDoubleClickFrame={onDoubleClickFrame}
        onDoubleClickLayer={onDoubleClickLayer}
        motionPaths={motionPaths}
        onFrameScrub={memoizedFrameScrub}
      />
    </div>
  );
}
