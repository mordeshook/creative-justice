"use client";

import { useRef, useEffect, useState } from "react";

export default function TimelineScrubber({ frame, setFrame, totalFrames = 120 }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateFrameFromPosition(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateFrameFromPosition(e);
  };

  const handleMouseUp = () => setIsDragging(false);

  const updateFrameFromPosition = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const newFrame = Math.round(percent * (totalFrames - 1));
    setFrame(newFrame);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const markerLeft = `${(frame / (totalFrames - 1)) * 100}%`;

  return (
    <div ref={containerRef} onMouseDown={handleMouseDown} className="relative h-6 bg-gray-200 rounded cursor-ew-resize select-none">
      <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: markerLeft }} />
      <div
        className="absolute top-0 w-1 bg-blue-800 h-full"
        style={{ left: markerLeft, transform: "translateX(-50%)" }}
      />
    </div>
  );
}
