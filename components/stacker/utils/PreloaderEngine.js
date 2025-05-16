// utils/PreloaderEngine.js

/**
 * Simulates Flash-style preloaders.
 * Can be tied to actual load progress or fake one over time.
 */

export class PreloaderEngine {
    constructor({ onProgress, onComplete }) {
      this.onProgress = onProgress;
      this.onComplete = onComplete;
      this.progress = 0;
    }
  
    startFake(duration = 3000) {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        this.progress = Math.min(1, elapsed / duration);
        this.onProgress(this.progress);
        if (this.progress < 1) {
          requestAnimationFrame(tick);
        } else {
          this.onComplete();
        }
      };
      tick();
    }
  }
  