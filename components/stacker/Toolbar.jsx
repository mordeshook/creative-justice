// components/stacker/Toolbar.jsx — updated with Add Paragraph and AI robot icon

"use client";

import Image from "next/image";

export default function ToolBar({ onAddLayer, onUndo, onRedo, onExport }) {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-white shadow w-full">
      {/* Left-side tool buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onAddLayer("text")}
          title="Add Text Header"
        >
          <Image src="/add-text.svg" alt="Add Text" width={24} height={24} />
        </button>
        <button
          onClick={() => onAddLayer("paragraph")}
          title="Add Paragraph Block"
        >
          <Image src="/add-paragraph.svg" alt="Add Paragraph" width={24} height={24} />
        </button>
        <button
          onClick={() => onAddLayer("image")}
          title="Upload Image Layer"
        >
          <Image src="/add-image.svg" alt="Add Image" width={24} height={24} />
        </button>
        <button
          onClick={() => onAddLayer("ai")}
          title="Generate AI Image"
        >
          <Image src="/add-AI.svg" alt="Add AI" width={24} height={24} />
        </button>
        <button
          onClick={() => onAddLayer("shape")}
          title="Add Shape Layer"
        >
          <Image src="/add-rect.svg" alt="Add Shape" width={24} height={24} />
        </button>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center space-x-4">
        <button onClick={onUndo} title="Undo Last Action">
          <Image src="/undo.svg" alt="Undo" width={24} height={24} />
        </button>
        <button onClick={onRedo} title="Redo Last Action">
          <Image src="/redo.svg" alt="Redo" width={24} height={24} />
        </button>
        <button
          onClick={onExport}
          title="Save stack to nuveuu-base"
          className="bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Save Stack
        </button>
      </div>
    </div>
  );
}
