// components/stacker/ExportOptions.jsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useLayerState } from "@/components/stacker/hooks/useLayerState";
import { exportToZip } from "@/components/stacker/logic/ExportToZIP";
import { FrameCaptureEngine } from "@/components/stacker/export/FrameCaptureEngine";
import { encodeFramesToMP4 } from "@/components/stacker/export/encodeFramesToMP4";

const RESOLUTIONS = [
  { label: "1000×800", width: 1000, height: 800 },
  { label: "1280×720", width: 1280, height: 720 },
  { label: "1920×1080", width: 1920, height: 1080 },
];

const FRAME_RATES = [24, 30, 60];

export default function ExportOptions({ stageRef, setCurrentFrame, totalFrames = 120 }) {
  const { layers } = useLayerState();
  const isExportingRef = useRef(false);
  const [status, setStatus] = useState("");

  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [fps, setFps] = useState(30);

  const handleExport = (format) => {
    if (!stageRef?.current) {
      console.error("❌ stageRef.current is null");
      return;
    }

    const transformer = stageRef.current.findOne("Transformer");
    if (transformer) {
      transformer.nodes([]);
      transformer.getLayer().batchDraw();
    }

    const stage = stageRef.current;
    let dataURL = "";

    if (format === "png") {
      dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
    } else if (format === "jpeg") {
      dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/jpeg", quality: 1 });
    } else {
      console.error("Unsupported format:", format);
      return;
    }

    const filename = `MyStack-${new Date().toISOString().split("T")[0]}.${format}`;
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportZip = () => {
    if (!stageRef?.current) {
      console.error("❌ stageRef.current is null");
      return;
    }
    exportToZip({ stageRef, layers, projectName: "MyAnimation" });
  };

  const handleExportMP4 = async () => {
    if (!stageRef?.current || !setCurrentFrame) {
      console.error("❌ stageRef.current or setCurrentFrame missing");
      return;
    }
    if (isExportingRef.current) return;
    isExportingRef.current = true;

    try {
      setStatus("🎞 Capturing frames...");

      const engine = new FrameCaptureEngine({
        canvasRef: { current: stageRef.current.content },
        totalFrames,
        fps,
      });

      const frames = await engine.captureFrames(async (frame) => {
        setCurrentFrame(frame);
      });

      console.log(`✅ Captured ${frames.length} frames`);
      await encodeFramesToMP4(frames, fps, setStatus, resolution);
    } catch (err) {
      console.error("❌ MP4 Export Failed", err);
      setStatus("❌ Export failed. See console for details.");
    } finally {
      isExportingRef.current = false;
      setTimeout(() => setStatus(""), 4000);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-semibold">Export Options</h4>

      <div className="flex gap-4">
        <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer" title="Save PNG" onClick={() => handleExport("png")}>        
          <Image src="/save-png.svg" alt="Save PNG" width={28} height={28} />
          <span className="mt-1">PNG</span>
        </div>
        <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer" title="Save JPEG" onClick={() => handleExport("jpeg")}>        
          <Image src="/save-jpeg.svg" alt="Save JPEG" width={28} height={28} />
          <span className="mt-1">JPEG</span>
        </div>
        <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer" title="Save ZIP" onClick={handleExportZip}>        
          <Image src="/save-zip.svg" alt="Save ZIP" width={28} height={28} />
          <span className="mt-1">ZIP</span>
        </div>
        <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer" title="Save MP4" onClick={handleExportMP4}>        
          <Image src="/save-mp4.svg" alt="Save MP4" width={28} height={28} />
          <span className="mt-1">MP4</span>
        </div>
      </div>

      {status && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded shadow text-sm">
          <span className="font-mono">{status}</span>
        </div>
      )}
    </div>
  );
}
