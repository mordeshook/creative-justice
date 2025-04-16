"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function DraftDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [boards, setBoards] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);

  useEffect(() => {
    fetchDraft();
    fetchRolesAndBoards();
  }, [id]);

  const fetchDraft = async () => {
    const { data, error } = await supabase
      .from("challenge_drafts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error("Draft fetch error:", error);
    else {
      setDraft(data);
      if (data.asset_url) {
        setAssetPreview(data.asset_url);
      }
    }

    setLoading(false);
  };

  const fetchRolesAndBoards = async () => {
    const { data: roleData } = await supabase.from("creative_roles").select("name");
    const { data: boardData } = await supabase.from("challenge_boards").select("name");
    setRoles(roleData?.map((r) => r.name) || []);
    setBoards(boardData?.map((b) => b.name) || []);
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleAdd = () => {
    if (newRole && !draft.roles.includes(newRole)) {
      updateDraft("roles", [...draft.roles, newRole]);
      setNewRole("");
    }
  };

  const handleRoleRemove = (role) => {
    updateDraft("roles", draft.roles.filter((r) => r !== role));
  };

  const handleAssetUpload = (e) => {
    const file = e.target.files[0];
    setAsset(file);
    setAssetPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    await supabase.from("challenge_drafts").update({
      title: draft.title,
      description: draft.description,
      intent: draft.intent,
      budget: draft.budget,
      deadline: draft.deadline,
      roles: draft.roles,
      board: draft.board,
      asset_url: assetPreview,
    }).eq("id", id);
  };

  const handlePublish = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    // Optionally upload asset to Supabase Storage here

    await supabase.from("challenges").insert({
      auth_users_id: user.id,
      title: draft.title,
      description: draft.description,
      intent: draft.intent,
      budget: draft.budget,
      deadline: draft.deadline,
      roles: draft.roles,
      board: draft.board,
      assets: asset ? [{ name: asset.name }] : [],
    });

    await supabase.from("challenge_drafts").delete().eq("id", id);
    router.push("/challenges");
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (!draft) return <main className="p-6">Draft not found.</main>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalize Your Challenge Draft</h1>

      <label className="block mb-2">Title</label>
      <input className="w-full p-2 border rounded mb-4" value={draft.title} onChange={(e) => updateDraft("title", e.target.value)} />

      <label className="block mb-2">Description</label>
      <textarea className="w-full p-2 border rounded mb-4" value={draft.description} onChange={(e) => updateDraft("description", e.target.value)} />

      <label className="block mb-2">Intent</label>
      <input className="w-full p-2 border rounded mb-4" value={draft.intent} onChange={(e) => updateDraft("intent", e.target.value)} />

      <label className="block mb-2">Board</label>
      <select className="w-full p-2 border rounded mb-4" value={draft.board} onChange={(e) => updateDraft("board", e.target.value)}>
        <option value="">Select Board</option>
        {boards.map((board) => (
          <option key={board} value={board}>{board}</option>
        ))}
      </select>

      <label className="block mb-2">Budget</label>
      <input type="number" className="w-full p-2 border rounded mb-4" value={draft.budget} onChange={(e) => updateDraft("budget", e.target.value)} />

      <label className="block mb-2">Deadline</label>
      <input type="date" className="w-full p-2 border rounded mb-4" value={draft.deadline} onChange={(e) => updateDraft("deadline", e.target.value)} />

      <label className="block mb-2">Upload New Asset</label>
      <input type="file" onChange={handleAssetUpload} />
      {assetPreview && (
        <Image src={assetPreview} alt="Preview" width={300} height={200} className="my-4 border rounded" />
      )}

      <label className="block mb-2">Roles</label>
      <div className="flex gap-2 mb-2">
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="p-2 border rounded">
          <option value="">Select role</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button onClick={handleRoleAdd} className="bg-gray-800 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {draft.roles.map((role) => (
          <span key={role} className="bg-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {role} <button onClick={() => handleRoleRemove(role)}>×</button>
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={handleSave} className="bg-yellow-600 text-white px-6 py-2 rounded">💾 Save Draft</button>
        <button onClick={handlePublish} className="bg-green-600 text-white px-6 py-2 rounded">🚀 Publish Challenge</button>
      </div>
    </main>
  );
}
