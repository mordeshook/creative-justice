// components/CanvasSymbolIsolate.jsx
import React from 'react';
import { Stage, Layer } from 'react-konva';

export function CanvasSymbolIsolate({ symbolData, onExit }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-2 w-[900px] h-[700px]">
        <Stage width={900} height={700} className="border">
          <Layer>
            {/* Render symbol layers here */}
            {symbolData?.map((node, idx) => (
              <node.Component key={idx} {...node.props} />
            ))}
          </Layer>
        </Stage>
        <button onClick={onExit} className="mt-2 px-4 py-1 bg-blue-600 text-white text-xs">Exit Symbol</button>
      </div>
    </div>
  );
}
