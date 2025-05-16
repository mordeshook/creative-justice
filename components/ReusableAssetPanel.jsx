// components/ReusableAssetPanel.jsx
import React from 'react';

export default function ReusableAssetPanel() {
  const assets = ["HeroSymbol", "LogoClip", "ButtonPrimary"];

  return (
    <div className="reusable-asset-panel p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Reusable Assets</h2>
      <ul>
        {assets.map((asset) => (
          <li key={asset} className="cursor-pointer hover:underline">{asset}</li>
        ))}
      </ul>
      <button className="mt-2">+ Add Asset</button>
    </div>
  );
}
