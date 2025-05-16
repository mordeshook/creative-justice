// components/stacker/export/FrameCaptureEngine.js
export class FrameCaptureEngine {
    constructor({ canvasRef, totalFrames, fps = 30 }) {
      this.canvasRef = canvasRef;
      this.totalFrames = totalFrames;
      this.fps = fps;
      this.frames = [];
    }
  
    async captureFrames(renderFrameCallback) {
      this.frames = [];
      for (let frame = 0; frame < this.totalFrames; frame++) {
        await renderFrameCallback(frame); // You must re-render canvas for current frame
        await this.waitForNextPaint();
  
        const dataUrl = this.canvasRef.current.toDataURL("image/webp", 1.0); // high-quality snapshot
        this.frames.push(dataUrl);
      }
      return this.frames;
    }
  
    waitForNextPaint() {
      return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    }
  }
  