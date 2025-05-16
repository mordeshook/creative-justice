// utils/CuePointManager.js

/**
 * CuePointManager
 * Handles frame-based or time-based events like:
 * - "fire animation at frame 12"
 * - "trigger audio on frame 24"
 */

export class CuePointManager {
    constructor({ onCue }) {
      this.onCue = onCue;
      this.fired = new Set();
    }
  
    reset() {
      this.fired.clear();
    }
  
    check(frame, cuePoints = []) {
      for (const cue of cuePoints) {
        if (!this.fired.has(cue.id) && cue.frame === frame) {
          this.fired.add(cue.id);
          this.onCue(cue);
        }
      }
    }
  }
  