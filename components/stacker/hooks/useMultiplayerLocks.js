// hooks/useMultiplayerLocks.js
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';


export function useMultiplayerLocks(roomId) {
  const [lockedIds, setLockedIds] = useState([]);

  useEffect(() => {
    const channel = supabase.channel(`locks:${roomId}`);

    channel.on("broadcast", { event: "lock" }, ({ payload }) => {
      setLockedIds((prev) => [...new Set([...prev, payload.id])]);
    });

    channel.subscribe();
    return () => supabase.removeChannel(channel);
  }, [roomId]);

  const lockItem = (id) => {
    supabase.channel(`locks:${roomId}`).send({ type: 'broadcast', event: 'lock', payload: { id } });
  };

  return { lockedIds, lockItem };
}