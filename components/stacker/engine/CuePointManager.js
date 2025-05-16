// components/stacker/engine/CuePointManager.js

export class CuePointManager {
    constructor() {
      this.cues = {}; // frame: [ { id, type, payload } ]
      this.triggered = new Set(); // Track fired cue IDs
    }
  
    addCue(frame, cue) {
      if (!this.cues[frame]) this.cues[frame] = [];
      this.cues[frame].push({ ...cue, id: crypto.randomUUID() });
    }
  
    removeCue(frame, cueId) {
      if (!this.cues[frame]) return;
      this.cues[frame] = this.cues[frame].filter((c) => c.id !== cueId);
      if (this.cues[frame].length === 0) delete this.cues[frame];
    }
  
    getCuesAtFrame(frame) {
      return this.cues[frame] || [];
    }
  
    reset() {
      this.triggered.clear();
    }
  
    trigger(frame, onTrigger) {
      const currentCues = this.getCuesAtFrame(frame);
      for (const cue of currentCues) {
        if (!this.triggered.has(cue.id)) {
          onTrigger(cue);
          this.triggered.add(cue.id);
        }
      }
    }
  }
  