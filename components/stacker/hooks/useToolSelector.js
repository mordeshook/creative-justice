// hooks/useToolSelector.js
import { useState } from 'react';

const toolState = { current: 'selection' };

export function useToolSelector() {
  const [activeTool, setActiveTool] = useState(toolState.current);
  const selectTool = (tool) => {
    toolState.current = tool;
    setActiveTool(tool);
  };
  return { activeTool, selectTool };
}
