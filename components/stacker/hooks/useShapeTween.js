// hooks/useShapeTween.js

import { useMemo } from "react";
import { interpolateShape } from "@/utils/ShapeTweenEngine";

/**
 * useShapeTween
 * Computes tweened shape at a given frame based on keyframes.
 *
 * @param {Object[]} keyframes - Array of shape keyframes { frame, shape }
 * @param {number} currentFrame - The current frame in the timeline
 * @returns {Object|null} - Tweened shape data or null
 */
export function useShapeTween(keyframes, currentFrame) {
  return useMemo(() => {
    if (!keyframes || keyframes.length < 2) return null;

    // Sort keyframes to find bounding frames
    const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
    let start = null;
    let end = null;

    for (let i = 0; i < sorted.length - 1; i++) {
      if (currentFrame >= sorted[i].frame && currentFrame <= sorted[i + 1].frame) {
        start = sorted[i];
        end = sorted[i + 1];
        break;
      }
    }

    if (!start || !end) return null;

    const range = end.frame - start.frame;
    const t = (currentFrame - start.frame) / range;

    return interpolateShape(start.shape, end.shape, t);
  }, [keyframes, currentFrame]);
}
