// utils/ExportRouter.js

import html2canvas from "html2canvas";

/**
 * ExportRouter
 * Responsible for rendering scenes and exporting them as images, JSON, or video.
 *
 * @param {HTMLElement} containerRef - A reference to the canvas container
 * @param {Array} scenes - List of scenes from SceneStore
 * @param {Object} layersMap - Mapping of sceneId => array of layers
 */

export async function exportAllScenesAsPNGs(containerRef, scenes, layersMap) {
  const exportedImages = [];

  for (const scene of scenes) {
    const layers = layersMap[scene.id] || [];
    await renderSceneToDOM(containerRef, layers);

    const canvas = await html2canvas(containerRef);
    const dataUrl = canvas.toDataURL("image/png");
    exportedImages.push({ sceneId: scene.id, dataUrl });
  }

  return exportedImages;
}

export function exportAllScenesAsJSON(scenes, layersMap) {
  return scenes.map((scene) => ({
    id: scene.id,
    name: scene.name,
    layers: layersMap[scene.id] || [],
  }));
}

// Placeholder for video export
export async function exportAsMP4(containerRef, scenes, layersMap) {
  console.warn("MP4 export is not implemented yet");
  return null;
}

/**
 * renderSceneToDOM - responsible for rendering a given layer set into the target DOM node
 *
 * In production: this should dynamically render a React canvas or Konva instance.
 * Here, we assume containerRef is already linked to a <div> that will be drawn to.
 */
function renderSceneToDOM(containerRef, layers) {
  return new Promise((resolve) => {
    // In real use, this would trigger the actual render pipeline.
    // For now, mock a short delay assuming React has updated the view.
    setTimeout(() => {
      resolve();
    }, 100);
  });
}
