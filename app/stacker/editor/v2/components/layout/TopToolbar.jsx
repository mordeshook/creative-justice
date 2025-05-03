// compontents/TopToolbar.jsx

"use client";

export default function TopToolbar({ onAddLayer, onUndo, onRedo, onSave }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100">
      <div className="flex items-center gap-2">
        <button onClick={() => onAddLayer("text")} className="btn">
          + Text
        </button>
        <button onClick={() => onAddLayer("shape")} className="btn">
          + Shape
        </button>
        <button onClick={() => onAddLayer("image")} className="btn">
          + Image
        </button>
        <button onClick={() => onAddLayer("ai")} className="btn">
          + AI Image
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onUndo} className="btn">
          Undo
        </button>
        <button onClick={onRedo} className="btn">
          Redo
        </button>
        <button onClick={onSave} className="btn-primary">
          Save Stack
        </button>
      </div>
    </div>
  );
}
