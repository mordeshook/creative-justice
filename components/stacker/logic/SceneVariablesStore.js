
// components\stacker\logic\SceneVariablesStore.js
import { create } from "zustand";
export const useSceneVariablesStore = create((set) => ({
  variables: {},
  setVariable: (key, value) => set((state) => ({
    variables: { ...state.variables, [key]: value }
  })),
  getVariable: (key) => get().variables[key],
}));
