//components\stacker\panels\ComponentLibraryPanel.jsx
"use client";
export default function ComponentLibraryPanel({ onAdd }) {
  const components = [
    { name: "Button", type: "button" },
    { name: "Slider", type: "slider" },
    { name: "Video", type: "video" },
  ];
  return (
    <div className="p-2 bg-white border shadow">
      <h3 className="font-semibold">Component Library</h3>
      <ul>
        {components.map(c => (
          <li key={c.type}>
            <button onClick={() => onAdd(c.type)}>{c.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
