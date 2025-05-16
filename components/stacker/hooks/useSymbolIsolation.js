// hooks/useSymbolIsolation.js
import { useState } from "react";

export function useSymbolIsolation() {
  const [activeSymbolId, setActiveSymbolId] = useState(null);

  const enterSymbol = (symbolId) => setActiveSymbolId(symbolId);
  const exitSymbol = () => setActiveSymbolId(null);

  const isInsideSymbol = activeSymbolId !== null;

  return { activeSymbolId, isInsideSymbol, enterSymbol, exitSymbol };
}
