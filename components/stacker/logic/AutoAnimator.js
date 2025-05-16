
// components\stacker\logic\AutoAnimator.js
export function autoAnimateLayer(layer) {
  const keyframes = [0, 20];
  return keyframes.map(frame => ({
    frame,
    props: {
      x: layer.x + frame * 2,
      y: layer.y + frame,
    }
  }));
}
