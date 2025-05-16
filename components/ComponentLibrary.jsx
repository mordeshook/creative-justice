// components/ComponentLibrary.jsx
import React from 'react';

export default function ComponentLibrary() {
  const components = ["Button", "MovieClip", "InputField", "Slider", "Checkbox"];

  return (
    <div className="component-library p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Component Library</h2>
      <ul>
        {components.map((comp) => (
          <li key={comp} className="cursor-pointer hover:underline">{comp}</li>
        ))}
      </ul>
    </div>
  );
}

