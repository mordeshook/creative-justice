// store/SceneStore.js

import { create } from "zustand";
import { nanoid } from "nanoid";

/**
 * useSceneStore
 * Manages the state for all animation scenes and scene-level switching.
 * Each scene contains its own timeline and layers.
 */
export const useSceneStore = create((set) => ({
  // List of all scenes in the project
  scenes: [],

  // ID of the currently active scene
  currentSceneId: null,

  /**
   * Adds a new scene and sets it as the current one.
   * @param {Object} scene - The scene object with unique id, name, and layers.
   */
  addScene: (scene = { id: nanoid(), name: "Untitled Scene", layers: [] }) =>
    set((state) => ({
      scenes: [...state.scenes, scene],
      currentSceneId: scene.id,
    })),

  /**
   * Switch the currently active scene.
   * @param {string} id - The ID of the scene to activate.
   */
  setCurrentScene: (id) => set({ currentSceneId: id }),

  /**
   * Updates properties of a specific scene.
   * @param {string} id - The scene ID to update.
   * @param {Object} updates - The updates to apply.
   */
  updateScene: (id, updates) =>
    set((state) => ({
      scenes: state.scenes.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  /**
   * Removes a scene and selects the next available one.
   * @param {string} id - The ID of the scene to remove.
   */
  removeScene: (id) =>
    set((state) => {
      const filtered = state.scenes.filter((s) => s.id !== id);
      const newCurrentId =
        filtered.length > 0 ? filtered[0].id : null;

      return {
        scenes: filtered,
        currentSceneId: newCurrentId,
      };
    }),
}));
