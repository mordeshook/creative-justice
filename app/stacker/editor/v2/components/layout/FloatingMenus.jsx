"use client";

import ExportPanel from "@/components/panels/ExportPanel";

export default function FloatingMenus({ stageRef }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <ExportPanel stageRef={stageRef} />
    </div>
  );
}
