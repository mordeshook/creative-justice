// components/SceneNavigator.jsx
import React from 'react';

export default function SceneNavigator() {
  return (
    <div className="scene-navigator p-2 border-t bg-white">
      <h2 className="text-sm font-semibold">Scenes</h2>
      <ul className="text-xs">
        <li>Scene 1</li>
        <li>Scene 2</li>
        <li>Preloader</li>
      </ul>
    </div>
  );
}