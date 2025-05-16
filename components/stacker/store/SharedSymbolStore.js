
// SharedSymbolStore.js
// Global symbol registry across scenes
import { create } from "zustand";

export const useSharedSymbolStore = create((set, get) => ({
  symbols: {},
  registerSymbol: (id, data) => set((state) => ({
    symbols: { ...state.symbols, [id]: data }
  })),
  getSymbol: (id) => get().symbols[id],
}));
