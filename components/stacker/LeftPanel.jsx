// components/stacker/LeftPanel.jsx

"use client";

import { useState } from "react";
import ExportOptions from "@/components/stacker/ExportOptions";
import LayerControls from "@/components/stacker/LayerControls";
import ToolPanel from "@/components/stacker/ToolPanel"; // ✅ moved import

function AccordionSection({ title, children, isOpen, onToggle }) {
  return (
    <div className="border rounded bg-white">
      <button
        onClick={onToggle}
        className="w-full text-left font-semibold px-4 py-2 bg-gray-100 hover:bg-gray-200"
      >
        {title}
      </button>
      {isOpen && <div className="p-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function LeftPanel({
  layers,
  selectedId,
  onSelect,
  onRemove,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onAddShape,
  backgroundColor,
  setBackgroundColor,
  stageRef,
}) {
  const [accordion, setAccordion] = useState({
    layers: true,
    toolpanel: true, // ✅ added toolpanel state
    background: true,
    export: true,
  });

  return (
    <div className="min-w-[320px] max-w-[340px] shrink-0 p-4 space-y-4 overflow-y-auto border-r bg-gray-50">
      
      {/* Stacks (Layers) */}
      <AccordionSection
        title="Stacks"
        isOpen={accordion.layers}
        onToggle={() =>
          setAccordion((prev) => ({ ...prev, layers: !prev.layers }))
        }
      >
        <LayerControls
          layers={layers}
          selectedId={selectedId}
          onSelect={onSelect}
          onRemove={onRemove}
          onToggleVisibility={onToggleVisibility}
          onToggleLock={onToggleLock}
          onMoveUp={(i) => onMoveLayer(i, -1)}
          onMoveDown={(i) => onMoveLayer(i, 1)}
        />
      </AccordionSection>

      {/* Tool Panel — new accordion section */}
      <AccordionSection
        title="Tool Panel"
        isOpen={accordion.toolpanel}
        onToggle={() =>
          setAccordion((prev) => ({ ...prev, toolpanel: !prev.toolpanel }))
        }
      >
        <ToolPanel />
      </AccordionSection>

      {/* Canvas Background */}
      <AccordionSection
        title="Canvas Background"
        isOpen={accordion.background}
        onToggle={() =>
          setAccordion((prev) => ({ ...prev, background: !prev.background }))
        }
      >
        <label className="block text-sm font-medium">Background Color</label>
        <select
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="border rounded p-1 w-full"
        >
          <option value="#ffffff">White</option>
          <option value="#000000">Black</option>
          <option value="#f0f0f0">Light Gray</option>
          <option value="transparent">Transparent</option>
        </select>
      </AccordionSection>

      {/* Export Panel */}
      <AccordionSection
        title="Export As"
        isOpen={accordion.export}
        onToggle={() =>
          setAccordion((prev) => ({ ...prev, export: !prev.export }))
        }
      >
        <ExportOptions stageRef={stageRef} />
      </AccordionSection>
    </div>
  );
}
