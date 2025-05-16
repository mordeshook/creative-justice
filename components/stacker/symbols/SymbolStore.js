// components/stacker/symbols/SymbolStore.js

import { create } from "zustand";

/**
 * Global symbol editing store.
 * Tracks nested timeline stack, current symbol, and per-symbol data.
 */
export const useSymbolStore = create((set, get) => ({
  timelineStack: [],
  currentSymbol: null,

  enterSymbol: (symbol) => {
    const state = get();
    const timelineStack = state?.timelineStack || [];
    const currentSymbol = state?.currentSymbol;

    if (currentSymbol) {
      set({ timelineStack: [...timelineStack, currentSymbol] });
    }
    set({ currentSymbol: { ...symbol } });
  },

  exitSymbol: () => {
    const state = get();
    const timelineStack = state?.timelineStack || [];

    if (timelineStack.length > 0) {
      const previous = timelineStack[timelineStack.length - 1];
      set({
        timelineStack: timelineStack.slice(0, -1),
        currentSymbol: previous,
      });
    } else {
      set({ currentSymbol: null });
    }
  },

  updateLayers: (layers) => {
    const currentSymbol = get()?.currentSymbol;
    if (currentSymbol) {
      set({ currentSymbol: { ...currentSymbol, layers } });
    }
  },

  getBreadcrumb: () => {
    const state = get() || {};
    const timelineStack = state.timelineStack || [];
    const currentSymbol = state.currentSymbol;

    return [...timelineStack.map((s) => s.name), currentSymbol?.name || ""].filter(Boolean);
  },
}));
