
// components\stacker\symbols\CameraLayer.jsx
"use client";
export default function CameraLayer({ zoom = 1, offsetX = 0, offsetY = 0, children }) {
  return (
    <div style={{ transform: `scale(${zoom}) translate(${offsetX}px, ${offsetY}px)`
    , transformOrigin: "0 0" }}>
      {children}
    </div>
  );
}
