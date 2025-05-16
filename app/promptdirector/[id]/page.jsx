"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function PromptDetailPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [prompt, setPrompt] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    generated_prompt: "",
    category: "",
    is_public: false,
  });

  useEffect(() => {
    const fetchPrompt = async () => {
      const { data, error } = await supabase
        .from("promptdirector_content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Prompt load error:", error);
      } else {
        setPrompt(data);
        setFormData({
          generated_prompt: data.generated_prompt,
          category: data.category || "",
          is_public: data.is_public || false,
        });
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  const handleSaveChanges = async () => {
    const { data, error } = await supabase
      .from("promptdirector_content")
      .update({
        generated_prompt: formData.generated_prompt,
        category: formData.category,
        is_public: formData.is_public,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Prompt update error:", error);
      alert("Failed to save changes.");
    } else {
      setPrompt(data[0]);
      setEditMode(false);
      alert("Prompt successfully updated.");
    }
  };

  if (!prompt) return <div className="p-8">Loading prompt details...</div>;

  const isOwner = user?.id === prompt.auth_users_id;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Prompt Detail</h1>

      {prompt.thumbnail_url && (
        <Image
          src={prompt.thumbnail_url}
          alt="Prompt Thumbnail"
          width={600}
          height={400}
          className="mb-4 rounded"
          unoptimized
        />
      )}

      {editMode ? (
        <>
          <textarea
            value={formData.generated_prompt}
            onChange={(e) => setFormData({ ...formData, generated_prompt: e.target.value })}
            className="w-full h-60 p-4 border rounded"
          />

          <input
            type="text"
            value={formData.category}
            placeholder="Category"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 mt-2 border rounded"
          />

          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            />
            <span>Make Public</span>
          </label>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="whitespace-pre-wrap p-4 border rounded bg-gray-50">
            {prompt.generated_prompt}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            <strong>Category:</strong> {prompt.category || "Uncategorized"}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Engine:</strong> {prompt.engine} | 
            <strong> Subject:</strong> {prompt.subject_type} |
            <strong> Style:</strong> {prompt.style} |
            <strong> Mood:</strong> {prompt.mood} |
            <strong> Perspective:</strong> {prompt.perspective}
          </p>

          {isOwner && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Edit Prompt
            </button>
          )}
        </>
      )}
    </div>
  );
}
