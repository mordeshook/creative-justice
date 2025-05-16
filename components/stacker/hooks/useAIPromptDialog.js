import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAIPromptDialog({ onInsertLayer }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  const onSubmit = async (promptText) => {
    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        throw new Error("Missing Supabase token");
      }

      const res = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-image-stability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      const response = await res.json();

      if (!res.ok || !response.imageUrl) {
        throw new Error(response.error || "No image URL returned");
      }

      const newId = Date.now();

      onInsertLayer({
        id: newId,
        type: "image",
        url: response.imageUrl,
        x: 500,
        y: 400,
        width: 512,
        height: 512,
        opacity: 1,
        keyframes: [0], // ✅ Timeline compatibility
        frames: {
          0: {
            type: "key",
            data: {
              id: newId,
              type: "image",
              url: response.imageUrl,
              x: 500,
              y: 400,
              width: 512,
              height: 512,
              opacity: 1,
            },
          },
        },
      });
    } catch (err) {
      console.error("❌ Error hitting Stability function:", err);
    } finally {
      setLoading(false);
      setPrompt("");
      setOpen(false);
    }
  };

  return {
    open,
    prompt,
    setPrompt,
    toggle,
    close,
    loading,
    onSubmit,
  };
}
