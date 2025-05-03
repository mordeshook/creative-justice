"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function StacksPage() {
  const router = useRouter();
  const [stacks, setStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStacks = async () => {
      const { data, error } = await supabase
        .from("stacks")
        .select("id, content_id, created_at")
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

  const handleNewStack = () => {
    router.push("/stacks/editor");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Stacks</h1>
        <Button onClick={handleNewStack}>+ New Stack</Button>
      </div>

      {loading ? (
        <p>Loading your stacks...</p>
      ) : stacks.length === 0 ? (
        <p>No stacks yet. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stacks.map((stack) => (
            <div
              key={stack.id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/stacks/editor?id=${stack.id}`)}
            >
              <h2 className="font-semibold text-lg">Stack #{stack.id}</h2>
              <p className="text-sm text-gray-500">
                Created: {new Date(stack.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
