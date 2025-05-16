// components/SymbolUsageTracker.jsx
import React from 'react';

export default function SymbolUsageTracker() {
  const usageData = [
    { name: "Symbol1", count: 3 },
    { name: "Button1", count: 2 },
    { name: "MovieClip1", count: 5 }
  ];

  return (
    <div className="symbol-usage-tracker p-2 border-t bg-white text-xs">
      <h2 className="font-semibold">Symbol Usage</h2>
      <ul>
        {usageData.map((item) => (
          <li key={item.name}>{item.name}: {item.count} instances</li>
        ))}
      </ul>
    </div>
  );
}