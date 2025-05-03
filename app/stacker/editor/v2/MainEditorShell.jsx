// components/editor/MainEditorShell.jsx

"use client";

import TopToolbar from "./TopToolbar";
import LeftSidebar from "./LeftSidebar";
import CanvasWrapper from "./CanvasWrapper";
import RightInspector from "./RightInspector";
import TimelinePanel from "./TimelinePanel";

export default function MainEditorShell() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-100 text-neutral-900">
      <TopToolbar />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        <CanvasWrapper />

        <RightInspector />
      </div>

      <TimelinePanel />
    </div>
  );
}
