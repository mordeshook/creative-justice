// Component: GridOverlay.jsx

"use client";

import { Line } from "react-konva";

export default function GridOverlay({ width, height, spacing = 50, stroke = "#ccc", strokeWidth = 0.5 }) {
  const lines = [];

  // Vertical lines
  for (let x = spacing; x < width; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let y = spacing; y < height; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke={stroke}
        strokeWidth={strokeWidth}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
}
