// components/stacker/SaveStackLogic.jsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

async function uploadBlob(blob, path) {
  const { error } = await supabase.storage
    .from("stacker-images")
    .upload(path, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: blob.type,
    });
  if (error) throw error;

  const { data } = supabase.storage.from("stacker-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveStack({ stageRef, stackId, layers, user, stackName }) {
  if (!user) {
    toast("Login Required", { description: "Please sign in to save your stack." });
    return;
  }

  try {
    const currentId = stackId || crypto.randomUUID();

    if (!stageRef.current) {
      toast.error("Canvas not ready. Please try again.");
      return;
    }

    const dataUrl = stageRef.current.toDataURL({ mimeType: "image/png" });
    const previewBlob = await (await fetch(dataUrl)).blob();
    const previewPath = `${user.id}/${currentId}.png`;
    const previewUrl = await uploadBlob(previewBlob, previewPath);

    const updatedLayers = await Promise.all(
      layers.map(async (layer) => {
        if (layer.type === "image") {
          const isRemote = layer.url.startsWith("http") || layer.url.startsWith("https");

          if (!isRemote) {
            const response = await fetch(layer.url);
            const blob = await response.blob();
            const uploadPath = `${user.id}/uploads/${currentId}-${layer.id}.png`;
            const publicUrl = await uploadBlob(blob, uploadPath);
            return { ...layer, url: publicUrl };
          } else if (layer.url.includes("stability")) {
            const response = await fetch(layer.url);
            const blob = await response.blob();
            const uploadPath = `${user.id}/ai/${currentId}-${layer.id}.png`;
            const publicUrl = await uploadBlob(blob, uploadPath);
            return { ...layer, url: publicUrl };
          }
        }
        return layer;
      })
    );

    const { error: dbError } = stackId
      ? await supabase
          .from("stacks")
          .update({
            name: stackName || `Stack - ${new Date().toLocaleString()}`,
            image_url: previewUrl,
            layers: updatedLayers,
          })
          .eq("id", stackId)
      : await supabase.from("stacks").insert({
          id: currentId,
          auth_users_id: user.id,
          name: stackName || `Stack - ${new Date().toLocaleString()}`,
          image_url: previewUrl,
          layers: updatedLayers,
        });

    if (dbError) throw dbError;

    toast.success("Stack saved successfully!");
  } catch (err) {
    console.error("❌ Save stack error:", err);
    toast.error("Failed to save stack.");
  }
}
