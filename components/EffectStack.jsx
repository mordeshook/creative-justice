// components/EffectStack.jsx
import React from 'react';

export default function EffectStack() {
  return (
    <div className="effect-stack p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Effect Stack</h2>
      <ul>
        <li>Drop Shadow</li>
        <li>Glow</li>
        <li>Blur</li>
        <li>Color Transform</li>
      </ul>
      <button className="mt-2">+ Add Effect</button>
    </div>
  );
}
