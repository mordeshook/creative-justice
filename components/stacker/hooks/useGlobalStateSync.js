// hooks/useGlobalStateSync.js
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';


export function useGlobalStateSync(roomId, onStateChange) {
  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);

    channel.on("broadcast", { event: "state" }, (payload) => {
      onStateChange(payload.payload);
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, onStateChange]);

  const broadcastState = (state) => {
    supabase.channel(`room:${roomId}`).send({ type: 'broadcast', event: 'state', payload: state });
  };

  return { broadcastState };
}