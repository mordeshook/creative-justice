// Component: HistoryManager.jsx

"use client";

import { useState } from "react";

export default function useHistory(initialState = []) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState([]);

  const set = (newPresent) => {
    setPast([...past, present]);
    setPresent(newPresent);
    setFuture([]);
  };

  const undo = () => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  };

  const redo = () => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setPresent(next);
    setFuture(newFuture);
  };

  const reset = (state) => {
    setPast([]);
    setPresent(state);
    setFuture([]);
  };

  return {
    state: present,
    set,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
