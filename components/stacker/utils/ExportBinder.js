// utils/ExportBinder.js
import html2canvas from 'html2canvas';

export async function exportCanvasToPNG(canvasElement) {
  const blob = await new Promise((resolve) => canvasElement.toBlob(resolve, 'image/png'));
  downloadBlob(blob, 'export.png');
}

export async function exportCanvasToSVG(stageRef) {
  const uri = stageRef.current.toDataURL({ mimeType: 'image/svg+xml' });
  downloadDataURI(uri, 'export.svg');
}

export async function exportCanvasToMP4(canvasElement) {
  // Placeholder only – use ffmpeg/wormhole/recorder logic in production
  console.warn("MP4 export not implemented.");
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function downloadDataURI(uri, filename) {
  const link = document.createElement('a');
  link.href = uri;
  link.download = filename;
  link.click();
}