"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DraftsPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDrafts = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("challenge_drafts")
      .select("*")
      .eq("auth_users_id", user.id)
      .order("saved_at", { ascending: false });

    if (!error) {
      setDrafts(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (id) => {
    router.push(`/challenge/create?draftId=${id}`);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await supabase.from("challenge_drafts").delete().eq("id", id);
    setDeletingId(null);
    fetchDrafts();
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Challenge Drafts</h1>

      {loading ? (
        <p className="text-gray-600">Loading drafts...</p>
      ) : drafts.length === 0 ? (
        <p className="text-gray-600">You have no saved challenge drafts yet.</p>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div key={draft.id} className="p-4 border rounded shadow-sm bg-white">
              <h2 className="text-lg font-semibold">{draft.title || "Untitled Draft"}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Saved on {new Date(draft.saved_at).toLocaleString()}
              </p>
              {draft.board && (
                <p className="text-sm text-gray-500 mb-2">Board: {draft.board}</p>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleEdit(draft.id)}
                  className="px-4 py-1 bg-indigo-600 text-white rounded text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded text-sm"
                  disabled={deletingId === draft.id}
                >
                  {deletingId === draft.id ? "Deleting..." : "🗑️ Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
