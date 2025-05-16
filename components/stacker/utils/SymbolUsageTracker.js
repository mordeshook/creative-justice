
// SymbolUsageTracker.js
// Tracks instances of symbols across scenes

export class SymbolUsageTracker {
  constructor() {
    this.usage = {};
  }

  track(sceneId, symbolId) {
    if (!this.usage[symbolId]) this.usage[symbolId] = new Set();
    this.usage[symbolId].add(sceneId);
  }

  getUsage(symbolId) {
    return Array.from(this.usage[symbolId] || []);
  }
}



