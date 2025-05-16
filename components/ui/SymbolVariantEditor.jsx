//components\ui\SymbolVariantEditor.jsx
"use client";
export default function SymbolVariantEditor({ symbol, onClone }) {
  return (
    <div className="p-2 border bg-white rounded">
      <h3 className="font-semibold">🎨 Symbol Variant</h3>
      <button onClick={() => onClone(symbol)}>Create Variant</button>
    </div>
  );
}
