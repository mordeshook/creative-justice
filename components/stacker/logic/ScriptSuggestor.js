
// components\stacker\logic\ScriptSuggestor.js
export function suggestScript(layerType, context) {
  if (layerType === "button") return "onClick(() => gotoAndPlay(0));";
  if (context.includes("end")) return "if (currentFrame === totalFrames - 1) stop();";
  return "stop();";
}
