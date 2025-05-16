// components/RuntimeController.jsx
import React, { useEffect } from 'react';

export function RuntimeController({ compiledScene, frame }) {
  useEffect(() => {
    const data = compiledScene[frame];
    if (data) {
      // Here you could update canvas or props dynamically
      console.log("Render Frame", frame, data);
    }
  }, [compiledScene, frame]);

  return null;
}
