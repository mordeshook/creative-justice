
//components\stacker\panels\AnimationDebugger.jsx

"use client";
export default function AnimationDebugger({ frame, timeline }) {
  return (
    <div className="p-2 bg-yellow-100 border border-yellow-400 text-sm font-mono">
      <div>Frame: {frame}</div>
      <div>Layers: {timeline.length}</div>
      <div>Keyframes: {timeline.map(l => l.keyframes?.length || 0).reduce((a, b) => a + b, 0)}</div>
    </div>
  );
}
