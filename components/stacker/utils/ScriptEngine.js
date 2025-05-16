// utils/ScriptEngine.js

/**
 * Simple script engine to handle timeline actions like:
 * - gotoAndPlay("label")
 * - stop()
 * - if (condition) { gotoAndPlay(...) }
 * - onClick, onEnterFrame
 */

export class ScriptEngine {
    constructor({ scene, layers, setFrame, stopPlayback }) {
      this.scene = scene;
      this.layers = layers;
      this.setFrame = setFrame;
      this.stopPlayback = stopPlayback;
    }
  
    execute(frameScripts = []) {
      for (const script of frameScripts) {
        try {
          const fn = new Function("gotoAndPlay", "stop", script);
          fn(this.gotoAndPlay.bind(this), this.stop.bind(this));
        } catch (err) {
          console.warn("Script error:", err.message);
        }
      }
    }
  
    gotoAndPlay(frameOrLabel) {
      if (typeof frameOrLabel === "number") {
        this.setFrame(frameOrLabel);
      } else {
        const labelFrame = this.scene.labels?.[frameOrLabel];
        if (labelFrame !== undefined) {
          this.setFrame(labelFrame);
        }
      }
    }
  
    stop() {
      this.stopPlayback();
    }
  }
  