// hooks/useTimelineContextMenu.js
import { useState } from "react";

export function useTimelineContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const openMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  return { visible, position, openMenu, closeMenu };
}
