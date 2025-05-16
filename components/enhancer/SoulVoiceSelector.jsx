// components/enhancer/SoulVoiceSelector.jsx

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function SoulVoiceSelector({ selectedId, onSelect }) {
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("soul_voices")
      .select("id, name, role")
      .eq("auth_users_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Failed to load voices:", error);
    else setVoices(data);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Label>Soul Voice</Label>
      <Select value={selectedId || ""} onChange={(e) => onSelect(e.target.value)} disabled={loading}>
        <option value="">-- Select a Soul Voice --</option>
        {voices.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name} ({v.role})
          </option>
        ))}
      </Select>
    </div>
  );
}
