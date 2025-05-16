// components/EmbedScriptRunner.jsx
import React, { useEffect } from 'react';

export default function EmbedScriptRunner({ script }) {
  useEffect(() => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(script);
      fn();
    } catch (err) {
      console.error("Script Error:", err);
    }
  }, [script]);

  return null;
}
