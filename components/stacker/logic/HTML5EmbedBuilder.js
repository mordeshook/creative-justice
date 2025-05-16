// components/stacker/logic/HTML5EmbedBuilder.js

export function buildHTML5Embed(sceneData, layers) {
  const sceneJson = JSON.stringify(sceneData).replace(/</g, '\\u003c');
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Embedded Scene</title></head>
    <body>
      <canvas id="scene" width="1000" height="800" style="border:1px solid #ccc;"></canvas>
      <script>
        // Minimal mock embed playback
        const sceneData = ${sceneJson};
        console.log('Embedded Scene Data:', sceneData);
        // Playback stub: extend this with actual canvas rendering logic
      </script>
    </body>
    </html>
  `;
}
