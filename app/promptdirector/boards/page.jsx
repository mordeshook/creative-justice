//app\promptdirector\boards\page.jsx

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function PromptBoards() {
  const { user } = useUser();
  const [myPrompts, setMyPrompts] = useState([]);
  const [publicPrompts, setPublicPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;

      const { data: privateData, error: privateError } = await supabase
        .from("promptdirector_content")
        .select("*")
        .eq("auth_users_id", user.id);

      const { data: publicData, error: publicError } = await supabase
        .from("promptdirector_content")
        .select("*")
        .eq("is_public", true);

      if (privateError) console.error("Private prompts load error:", privateError);
      if (publicError) console.error("Public prompts load error:", publicError);

      setMyPrompts(privateData || []);
      setPublicPrompts(publicData || []);
      setLoading(false);
    };

    fetchPrompts();
  }, [user]);

  if (loading) return <div className="p-8">Loading your prompts...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Prompt Board</h1>

      {myPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPrompts.map((item) => (
            <Link
              key={item.id}
              href={`/promptdirector/${item.id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {(item.thumbnail_url || item.image_url) && (
                <Image
                  src={item.thumbnail_url || item.image_url}
                  alt="Prompt Thumbnail"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  unoptimized
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">
                  {item.category || "Uncategorized"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {item.engine} | {item.subject_type} | {item.style}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No saved prompts yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-4">Public Prompts</h2>

      {publicPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicPrompts.map((item) => (
            <Link
              key={item.id}
              href={`/promptdirector/${item.id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {(item.thumbnail_url || item.image_url) && (
                <Image
                  src={item.thumbnail_url || item.image_url}
                  alt="Public Prompt Thumbnail"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  unoptimized
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">
                  {item.category || "Uncategorized"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {item.engine} | {item.subject_type} | {item.style}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No public prompts available.</p>
      )}
    </div>
  );
}
