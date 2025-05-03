"use client";

import { useSearchParams } from "next/navigation";
import CanvasEditor from "@/components/CanvasEditor";

export default function EditorContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Editor</h1>
      {draftId ? (
        <CanvasEditor draftId={draftId} />
      ) : (
        <p className="text-red-500">No draft ID provided in URL</p>
      )}
    </div>
  );
}
