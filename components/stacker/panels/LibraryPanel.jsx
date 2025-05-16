// components/stacker/panels/LibraryPanel.jsx
"use client";

import { useSymbolLibrary } from "@/hooks/useSymbolLibrary";
import { Button } from "@/components/ui/button";

export default function LibraryPanel({ onInsert }) {
  const { symbols } = useSymbolLibrary();

  return (
    <div className="p-2">
      <h4 className="font-semibold text-sm mb-2">🎞 Symbol Library</h4>
      <div className="space-y-1">
        {symbols.map((sym) => (
          <div
            key={sym.id}
            className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
          >
            <span className="text-xs">{sym.name}</span>
            <Button size="xs" onClick={() => onInsert(sym.id)}>➕ Add</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
