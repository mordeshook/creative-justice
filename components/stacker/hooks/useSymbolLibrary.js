// hooks/useSymbolLibrary.js
import { useState } from "react";

export function useSymbolLibrary() {
  const [symbols, setSymbols] = useState([]);

  const addSymbol = (symbol) => {
    setSymbols((prev) => [...prev, symbol]);
  };

  const getSymbolById = (id) => symbols.find((s) => s.id === id);

  return { symbols, addSymbol, getSymbolById };
}
