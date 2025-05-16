// components\stacker\scripts\PreloaderEngine.js
/**
 * PreloaderEngine.js
 * Simulates Flash-style preloaders with progress.
 */
export class PreloaderEngine {
  constructor(sceneLoader) {
    this.sceneLoader = sceneLoader;
    this.progress = 0;
  }

  async preloadScenes(scenes, onProgress) {
    for (let i = 0; i < scenes.length; i++) {
      await this.sceneLoader(scenes[i]);
      this.progress = ((i + 1) / scenes.length) * 100;
      onProgress(this.progress);
    }
  }
}