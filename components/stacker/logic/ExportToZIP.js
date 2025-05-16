// components/stacker/logic/ExportToZIP.js

import JSZip from "jszip";
import { saveAs } from "file-saver";

// Utility: Download blob as file
function downloadBlob(blob, filename) {
  saveAs(blob, filename);
}

// Utility: Convert dataURL to Blob
function dataURLToBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

export async function exportToZip({ stageRef, layers, projectName = "MyAnimation" }) {
  const zip = new JSZip();
  const assetFolder = zip.folder("assets");

  // 1. Export canvas as preview image
  const previewDataUrl = stageRef.current.toDataURL({ mimeType: "image/png" });
  const previewBlob = dataURLToBlob(previewDataUrl);
  assetFolder.file("preview.png", previewBlob);

  // 2. Process layers and upload local image assets
  const exportedLayers = await Promise.all(
    layers.map(async (layer) => {
      if (layer.type === "image" && layer.url.startsWith("data:")) {
        const blob = dataURLToBlob(layer.url);
        const assetPath = `assets/layer-${layer.id}.png`;
        assetFolder.file(`layer-${layer.id}.png`, blob);
        return { ...layer, url: assetPath };
      }
      return layer;
    })
  );

  // 3. Build animation JSON
  const animationData = {
    name: projectName,
    layers: exportedLayers,
    width: 1000,
    height: 800,
    frameRate: 24,
    version: "1.0.0",
  };

  zip.file("animation.json", JSON.stringify(animationData, null, 2));

  // 4. (Optional) Add minimal HTML/JS player
  zip.file(
    "index.html",
    `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${projectName}</title></head>
<body>
<canvas id="canvas" width="1000" height="800" style="border:1px solid #ccc"></canvas>
<script src="embed.js"></script>
</body>
</html>
  `.trim()
  );

  zip.file(
    "embed.js",
    `
fetch("animation.json")
  .then((res) => res.json())
  .then((data) => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const layer of data.layers) {
        if (layer.type === "text") {
          ctx.fillStyle = layer.fill || "#000";
          ctx.font = (layer.fontSize || 24) + "px Arial";
          ctx.fillText(layer.content || "", layer.x, layer.y);
        } else if (layer.type === "shape") {
          ctx.fillStyle = layer.fill || "#f00";
          ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
        } else if (layer.type === "image") {
          const img = new Image();
          img.src = layer.url;
          img.onload = () => ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
        }
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  });
  `.trim()
  );

  // 5. Generate ZIP and trigger download
  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadBlob(zipBlob, `${projectName}.zip`);
}
