// components/stacker/ToolPanel.jsx
"use client";

import React from "react";

const tools = [
  { src: "/select.svg", title: "Select Tool" },
  { src: "/subselect.svg", title: "Subselect Tool" },
  { src: "/pen.svg", title: "Pen Tool" },
  { src: "/brush.svg", title: "Brush Tool" },
  { src: "/pencil.svg", title: "Pencil Tool" },
  { src: "/fill.svg", title: "Fill Tool" },
  { src: "/eraser.svg", title: "Eraser Tool" },
  { src: "/text_select.svg", title: "Text Tool" },
  { src: "/rectangle.svg", title: "Rectangle Tool" },
  { src: "/oval.svg", title: "Oval Tool" },
  { src: "/line.svg", title: "Line Tool" },
  { src: "/zoom.svg", title: "Zoom Tool" },
  { src: "/hand.svg", title: "Hand Tool" },
  { src: "/AI-image.svg", title: "AI Text+Image-to-Image", onClick: "onImageToAIImage" },
  { src: "/AI-video.svg", title: "AI Image-to-Video", onClick: "onVideoFromImageText" },
  { src: "/enhanced.svg", title: "Enhanced Paragraph with AI", onClick: "onEnhanceParagraph" },
  { src: "/text-enhance.svg", title: "Select to Enhance with AI", onClick: "onSelectTextToEnhance" },
];

export default function ToolPanel({
  onImageToAIImage,
  onVideoFromImageText,
  onEnhanceParagraph,
  onSelectTextToEnhance,
}) {
  const handlers = {
    onImageToAIImage,
    onVideoFromImageText,
    onEnhanceParagraph,
    onSelectTextToEnhance,
  };

  return (
    <div className="tool-panel grid grid-cols-4 gap-2 text-center">
      {tools.map(({ src, title, onClick }, index) => (
        <button
          key={index}
          title={title}
          onClick={onClick ? handlers[onClick] : undefined}
          className="p-2"
        >
          <img src={src} alt={title} className="w-6 h-6 mx-auto" />
        </button>
      ))}
    </div>
  );
}
