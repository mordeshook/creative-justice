// components/stacker/scripts/CuePointManager.js

export class CuePointManager {
  constructor() {
    this.cues = {}; // { [sceneId]: { [frame]: [function, ...] } }
  }

  add(sceneId, frame, fn) {
    if (!this.cues[sceneId]) this.cues[sceneId] = {};
    if (!this.cues[sceneId][frame]) this.cues[sceneId][frame] = [];
    this.cues[sceneId][frame].push(fn);
  }

  check(sceneId, frame, context) {
    const frameCues = this.cues?.[sceneId]?.[frame];
    if (!frameCues) return;
    for (const cueFn of frameCues) {
      try {
        cueFn(context);
      } catch (err) {
        console.error(`Cue Error [${sceneId} @ frame ${frame}]`, err);
      }
    }
  }

  clear(sceneId) {
    if (sceneId) {
      delete this.cues[sceneId];
    } else {
      this.cues = {};
    }
  }
}
