// app/stacks/editor/page.jsx

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import EditorClient to disable SSR
const EditorClient = dynamic(() => import("./EditorClient_Konva"), {
  ssr: false,
  loading: () => <div className="p-4">Loading editor...</div>,
});

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading editor...</div>}>
      <EditorClient />
    </Suspense>
  );
}
