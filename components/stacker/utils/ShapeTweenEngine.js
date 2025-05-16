/**
 * ShapeTweenEngine
 * Handles interpolation between two vector shapes for shape tweening.
 * Supports linear interpolation of points and curves (initial version).
 */

export function interpolateShape(startShape, endShape, t) {
    // Ensure both shapes have same number of points for morphing
    const length = Math.min(startShape.points.length, endShape.points.length);

    const tweenedPoints = [];
    for (let i = 0; i < length; i++) {
      const start = startShape.points[i];
      const end = endShape.points[i];

      tweenedPoints.push({
        x: lerp(start.x, end.x, t),
        y: lerp(start.y, end.y, t),
        cp1x: lerp(start.cp1x || start.x, end.cp1x || end.x, t),
        cp1y: lerp(start.cp1y || start.y, end.cp1y || end.y, t),
        cp2x: lerp(start.cp2x || start.x, end.cp2x || end.x, t),
        cp2y: lerp(start.cp2y || start.y, end.cp2y || end.y, t),
        type: start.type || "line"
      });
    }

    return {
      ...startShape,
      points: tweenedPoints,
    };
  }

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Shape format example:
 * {
 *   type: "path",
 *   points: [
 *     { x: 10, y: 10, cp1x: 15, cp1y: 5, cp2x: 20, cp2y: 15, type: "curve" },
 *     { x: 30, y: 40, type: "line" },
 *     ...
 *   ]
 * }
 */
