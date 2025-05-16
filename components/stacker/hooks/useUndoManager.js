// hooks/useUndoManager.js
import { useRef } from 'react';

export function useUndoManager(initialState) {
  const history = useRef([initialState]);
  const index = useRef(0);

  const commit = (state) => {
    history.current = history.current.slice(0, index.current + 1);
    history.current.push(state);
    index.current++;
  };

  const undo = () => {
    if (index.current > 0) index.current--;
    return history.current[index.current];
  };

  const redo = () => {
    if (index.current < history.current.length - 1) index.current++;
    return history.current[index.current];
  };

  return { commit, undo, redo };
}