// components/stacker/symbols/SymbolBreadcrumb.jsx

"use client";

export default function SymbolBreadcrumb({ path = [], onExit }) {
  return (
    <div className="w-full bg-white border-b px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
      <button
        onClick={onExit}
        className="text-blue-600 hover:underline font-semibold"
      >
        Main
      </button>
      {path.map((symbol, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{symbol.name || `Symbol ${i + 1}`}</span>
        </span>
      ))}
    </div>
  );
}
