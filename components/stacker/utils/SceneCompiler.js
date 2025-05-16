// utils/SceneCompiler.js
export function compileScene(layers, frameCount = 100) {
    const compiled = [];
    for (let f = 0; f < frameCount; f++) {
      const frameData = layers.map((layer) => {
        const keyframe = layer.keyframes?.find(kf => kf.frame === f);
        return keyframe ? { ...keyframe, layerId: layer.id } : null;
      }).filter(Boolean);
      compiled.push({ frame: f, elements: frameData });
    }
    return compiled;
  }