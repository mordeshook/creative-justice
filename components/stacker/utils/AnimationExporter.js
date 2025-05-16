// utils/AnimationExporter.js
import html2canvas from 'html2canvas';

export async function exportToPNGSequence(stageRef, frameCount) {
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const canvas = stageRef.current.toCanvas();
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    frames.push(blob);
  }
  return frames;
}

export async function exportToGIF(frames) {
  console.warn('GIF export requires external encoder (e.g., gif.js).');
}

export async function exportToZIP(frames) {
  console.warn('ZIP export requires external ZIP lib (e.g., JSZip).');
}

export async function exportToMP4(frames) {
  console.warn('MP4 export requires encoding service or ffmpeg WASM.');
}

// components/RuntimeController.jsx
import React, { useEffect } from 'react';

export default function RuntimeController({ compiledScene, frame }) {
  useEffect(() => {
    const data = compiledScene[frame];
    if (data) {
      // Here you could update canvas or props dynamically
      console.log("Render Frame", frame, data);
    }
  }, [compiledScene, frame]);

  return null;
}