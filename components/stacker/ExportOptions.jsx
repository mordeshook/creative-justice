// components/stacker/ExportOptions.jsx

"use client";

import { Button } from "@/components/ui/button";

export default function ExportOptions({ stageRef }) {
  const handleExport = (format) => {
    console.log("Export button clicked:", format);

    if (!stageRef?.current) {
      console.error("stageRef.current is NULL");
      return;
    }

    // 🔥 HIDE TRANSFORMER BEFORE EXPORT
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
      console.error("Unsupported export format:", format);
      return;
    }

    const filename = `MyStack-${new Date().toISOString().split("T")[0]}.${format}`;
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Export triggered:", filename);
  };

  return (
    <div className="mt-4 space-x-2">
      <h4 className="font-semibold mb-2">Export As</h4>
      <Button onClick={() => handleExport("png")}>PNG</Button>
      <Button onClick={() => handleExport("jpeg")}>JPEG</Button>
    </div>
  );
}
