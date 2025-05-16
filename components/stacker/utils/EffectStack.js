
// EffectStack.js
// Applies non-destructive filters to MovieClips (drop shadow, glow, etc.)
export class EffectStack {
  constructor() {
    this.effects = {};
  }

  applyEffect(layerId, effectName, settings) {
    if (!this.effects[layerId]) this.effects[layerId] = [];
    this.effects[layerId].push({ effectName, settings });
  }

  getEffects(layerId) {
    return this.effects[layerId] || [];
  }

  clearEffects(layerId) {
    delete this.effects[layerId];
  }
}
