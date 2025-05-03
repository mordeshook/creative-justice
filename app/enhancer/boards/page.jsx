// /app/enhancer/boards/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

export default function EnhancerBoardsPage() {
  const { user } = useUser();
  const [myEnhancements, setMyEnhancements] = useState([]);
  const [publicEnhancements, setPublicEnhancements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) return;

      const { data: privateData, error: privateError } = await supabase
        .from("enhanced_content")
        .select("*")
        .eq("auth_users_id", user.id);

      const { data: publicData, error: publicError } = await supabase
        .from("enhanced_content")
        .select("*")
        .eq("is_public", true);

      if (privateError) console.error(privateError);
      if (publicError) console.error(publicError);

      setMyEnhancements(privateData || []);
      setPublicEnhancements(publicData || []);
      setLoading(false);
    };

    fetchBoards();
  }, [user]);

  if (loading) return <div className="p-8">Loading your boards...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Enhancer Board</h1>

      {myEnhancements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEnhancements.map((item) => (
            <Link
              key={item.id}
              href={`/enhancer/${item.id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt="Enhancement Thumbnail"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  unoptimized // prevent 400 errors if external url
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">
                  {item.enhancer_category || "No Category"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {item.tone} | {item.format} | {item.style}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No private enhancements yet.</p>
      )}

      <h2 className="text-2xl font-bold mt-12 mb-4">Public Enhancements</h2>

      {publicEnhancements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicEnhancements.map((item) => (
            <Link
              key={item.id}
              href={`/enhancer/${item.id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt="Public Enhancement Thumbnail"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  unoptimized // prevent 400 errors if external url
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">
                  {item.enhancer_category || "No Category"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {item.tone} | {item.format} | {item.style}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No public enhancements yet.</p>
      )}
    </div>
  );
}
