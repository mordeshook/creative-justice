// app/stacks/editor/page.jsx

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const EditorClient = dynamic(() => import("./EditorClient_Konva"), {
  ssr: false,
  loading: () => <div className="p-4">Loading Stacks Editor...</div>,
});

export default function StacksEditorPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <EditorClient />
    </Suspense>
  );
}
