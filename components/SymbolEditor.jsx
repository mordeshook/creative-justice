// components/SymbolEditor.jsx
import React from 'react';

export default function SymbolEditor({ name }) {
  return (
    <div className="symbol-editor border-t bg-white p-2 text-xs">
      <h2 className="font-semibold">Editing: {name}</h2>
      <div className="border mt-2 bg-gray-100 w-full h-40">[ Symbol Canvas Here ]</div>
      <button className="mt-2">Exit Symbol</button>
    </div>
  );
}
