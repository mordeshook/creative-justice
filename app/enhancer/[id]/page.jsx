// /app/enhancer/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function EnhancerItemPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [item, setItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    enhanced_output: "",
    category: "",
    is_public: false,
  });

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("enhanced_content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setItem(data);
        setFormData({
          enhanced_output: data.enhanced_output || "",
          category: data.enhancer_category || "",
          is_public: data.is_public || false,  // ✅ fixed here
        });
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("enhanced_content")
      .update({
        enhanced_output: formData.enhanced_output,
        enhancer_category: formData.category,
        is_public: formData.is_public, // ✅ fixed here
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
    } else {
      setItem(data[0]);
      setEditMode(false);
    }
  };

  if (!item) return <div className="p-8">Loading...</div>;

  const isOwner = user?.id === item.auth_users_id;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Enhanced Content</h1>

      {item.image_url && (
        <Image
          src={item.image_url}
          alt="Enhancement Image"
          width={600}
          height={400}
          className="mb-4 rounded"
        />
      )}

      {editMode ? (
        <>
          <textarea
            value={formData.enhanced_output}
            onChange={(e) =>
              setFormData({ ...formData, enhanced_output: e.target.value })
            }
            className="w-full h-60 p-4 border rounded"
          />
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 mt-2 border rounded"
          />
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
            />
            <span>Make Public</span>
          </label>
          <div className="mt-4 space-x-2">
            <button
              onClick={handleSave}
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
          <p className="whitespace-pre-wrap mb-4">{item.enhanced_output}</p>
          <p className="text-sm text-gray-500 mb-1">
            Category: {item.enhancer_category || "None"}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Tone: {item.tone || "N/A"} | Format: {item.format || "N/A"} | Style: {item.style || "N/A"}
          </p>
          {isOwner && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit This
            </button>
          )}
        </>
      )}
    </div>
  );
}
