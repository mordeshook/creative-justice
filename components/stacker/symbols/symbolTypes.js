// components/stacker/symbols/SymbolCanvas.jsx

"use client";

import { useCallback } from "react";
import { useSymbolEditor } from "./useSymbolEditor";
import SymbolTimelinePanel from "./SymbolTimelinePanel";
import StackerCanvas from "../StackerCanvas";
import SymbolBreadcrumb from "./SymbolBreadcrumb";

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
     *       frame: number,        // Frame index
     *       x: number,            // X position
     *       y: number,            // Y position
     *       scaleX?: number,      // Optional scale X
     *       scaleY?: number,      // Optional scale Y
     *       rotation?: number,    // Optional rotation angle in degrees
     *       opacity?: number,     // Optional opacity (0 to 1)
     *       easing?: string,      // Optional easing type
     *       shapeTween?: object,  // Optional shape tweening structure
     *       boneData?: object     // Optional skeletal rigging data
     *     },
     *     ...
     *   ]
     * }
     *
     * Purpose:
     * - Used for animating properties between keyframes.
     * - Renders visual tween paths on canvas and timeline.
     * - Currently supports position-based interpolation.
     * - Future expansion includes:
     *   - shape tweening (path morphing, bezier curves)
     *   - bone animation (inverse kinematics, parenting)
     *   - easing curves and timing graphs
     *   - custom property interpolators
     */
    motionPaths,

    /**
     * frameScrub: Function triggered while user scrubs the timeline.
     *
     * Purpose:
     * - Dynamically updates currentFrame during scrubbing.
     * - Should be debounced or throttled to avoid lag.
     * - Enhancements may include onion skin or preview overlays.
     */
    frameScrub,

    /**
     * onDoubleClickFrame: Triggered when user double-clicks a frame in the timeline.
     *
     * Purpose:
     * - Opens contextual menu or performs quick action.
     * - Supports Insert Keyframe, Blank Keyframe, Motion Tween, etc.
     * - Enables contextual editing for frame data.
     */
    onDoubleClickFrame,

    /**
     * onDoubleClickLayer: Triggered when user double-clicks a layer label.
     *
     * Purpose:
     * - Enters symbol editing mode (e.g., MovieClip).
     * - May enter shape path mode or bone hierarchy in future.
     * - Launches isolated canvas and timeline for nested editing.
     */
    onDoubleClickLayer,
  } = useSymbolEditor();

  const memoizedFrameScrub = useCallback(frameScrub, [frameScrub]);

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
      <SymbolBreadcrumb path={breadcrumb} onExit={exitSymbol} />

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
        />
      </div>

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
