
// ScriptLibrary.js
// Provides reusable scripts for drag-n-drop into ScriptingPanel

export const ScriptLibrary = {
  gotoStart: "gotoAndPlay(0);",
  stopAtEnd: "if (currentFrame === totalFrames - 1) stop();",
  fadeOut: "setProperty(layerId, 'opacity', 0);",
};
