// components/stacker/timeline/ContextMenu.jsx
"use client";

import { useEffect, useRef } from "react";

export default function ContextMenu({ position, visible, onAction, onClose }) {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border shadow text-sm rounded w-48"
      style={{ top: position.y, left: position.x }}
    >
      <button className="w-full px-3 py-2 hover:bg-gray-100 text-left" onClick={() => onAction("insertFrame")}>
        ➕ Insert Frame
      </button>
      <button className="w-full px-3 py-2 hover:bg-gray-100 text-left" onClick={() => onAction("insertKeyframe")}>
        🎯 Insert Keyframe
      </button>
      <button className="w-full px-3 py-2 hover:bg-gray-100 text-left" onClick={() => onAction("insertBlankKeyframe")}>
        🧼 Insert Blank Keyframe
      </button>
      <button className="w-full px-3 py-2 hover:bg-gray-100 text-left text-red-600" onClick={() => onAction("removeFrame")}>
        🗑 Remove Frame
      </button>
    </div>
  );
}
