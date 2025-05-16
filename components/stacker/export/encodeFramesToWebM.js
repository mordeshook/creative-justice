// components/stacker/export/encodeFramesToWebM.js

export async function encodeFramesToWebM(frames, fps = 30) {
    const width = 1000;
    const height = 800;
  
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
  
    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
    });
  
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
  
    const recordingComplete = new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    });
  
    recorder.start();
  
    for (let i = 0; i < frames.length; i++) {
      await new Promise((r) => setTimeout(r, 1000 / fps));
      const img = new Image();
      img.src = frames[i];
      await new Promise((res) => (img.onload = res));
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    }
  
    recorder.stop();
  
    const videoBlob = await recordingComplete;
  
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MyStack-${new Date().toISOString().split("T")[0]}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  }
  