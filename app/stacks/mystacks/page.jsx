// app/stacks/mystacks/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MyStacksPage() {
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStacks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("stacks")
        .select("id, name, image_url")
        .eq("auth_users_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading stacks:", error);
      } else {
        setStacks(data);
      }
      setLoading(false);
    };

    fetchStacks();
  }, []);

  const handleCreateNew = () => {
    router.push("/stacks/editor");
  };

  const handleEditStack = (id) => {
    router.push(`/stacks/editor?id=${id}`);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Stacks</h1>
        <Button onClick={handleCreateNew}>Create New Stack</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : stacks.length === 0 ? (
        <div className="text-center text-gray-500 space-y-4">
          <p>No stacks yet!</p>
          <Button onClick={handleCreateNew}>Create Your First Stack</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
              onClick={() => handleEditStack(stack.id)}
            >
              {stack.image_url ? (
                <div className="w-full h-48 relative">
                  <Image
                    src={stack.image_url}
                    alt={stack.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Thumbnail</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{stack.name}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
