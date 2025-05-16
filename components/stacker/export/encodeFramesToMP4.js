// components/stacker/export/encodeFramesToMP4.js
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export async function encodeFramesToMP4(frames, fps = 30, onProgress = () => {}, resolution = { width: 1000, height: 800 }) {
  const ffmpeg = createFFmpeg({ log: true });
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  onProgress("🌀 Preparing input...");

  const { width, height } = resolution;

  for (let i = 0; i < frames.length; i++) {
    const resized = await resizeImageToCanvas(frames[i], width, height);
    const binary = await fetch(resized).then((res) => res.arrayBuffer());
    ffmpeg.FS("writeFile", `frame${i}.png`, new Uint8Array(binary));
  }

  onProgress("🎬 Encoding video...");

  await ffmpeg.run(
    "-framerate", String(fps),
    "-i", "frame%d.png",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-vf", `scale=${width}:${height}`,
    "output.mp4"
  );

  const mp4 = ffmpeg.FS("readFile", "output.mp4");
  const blob = new Blob([mp4.buffer], { type: "video/mp4" });
  const url = URL.createObjectURL(blob);

  onProgress("✅ Download ready");

  const a = document.createElement("a");
  a.href = url;
  a.download = `MyStack-${new Date().toISOString().split("T")[0]}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

// 🔧 Resize any base64 frame to exact dimensions using canvas
async function resizeImageToCanvas(dataURL, width, height) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = dataURL;
  });
}
