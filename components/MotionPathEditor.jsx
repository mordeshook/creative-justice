// components/MotionPathEditor.jsx
import React from 'react';

export default function MotionPathEditor() {
  return (
    <div className="motion-path-editor border-t bg-white p-2 text-xs">
      <h2 className="font-semibold">Motion Path</h2>
      <p className="text-xs mb-2">Drag points to shape motion path.</p>
      <div className="w-full h-32 bg-gray-200 border">[ Path UI Canvas ]</div>
    </div>
  );
}

