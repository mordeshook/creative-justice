"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function DraftChallengesPage() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDrafts, setEditingDrafts] = useState({});
  const [newAssets, setNewAssets] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  const fetchDrafts = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("challenge_drafts")
      .select("*")
      .eq("auth_users_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching drafts:", error);
    } else {
      setDrafts(data || []);
    }

    setLoading(false);
  };

  const fetchDropdownData = async () => {
    const { data: roleData } = await supabase.from("creative_roles").select("name");
    const { data: boardData } = await supabase.from("challenge_boards").select("name");
    setAllRoles(roleData?.map((r) => r.name) || []);
    setBoards(boardData?.map((b) => b.name) || []);
  };

  useEffect(() => {
    fetchDrafts();
    fetchDropdownData();
  }, []);

  const handleEditChange = (id, field, value) => {
    setEditingDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleAddRole = (id) => {
    const selected = selectedRole[id];
    if (!selected) return;
    const roles = editingDrafts[id]?.roles ?? drafts.find((d) => d.id === id)?.roles ?? [];
    if (!roles.includes(selected)) {
      handleEditChange(id, "roles", [...roles, selected]);
    }
    setSelectedRole((prev) => ({ ...prev, [id]: "" }));
  };

  const handleRemoveRole = (id, roleToRemove) => {
    const roles = editingDrafts[id]?.roles ?? drafts.find((d) => d.id === id)?.roles ?? [];
    handleEditChange(id, "roles", roles.filter((r) => r !== roleToRemove));
  };

  const handleAssetChange = (id, file) => {
    setNewAssets((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const uploadNewAsset = async (file, userId, draftId) => {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const path = `${userId}/${draftId}/${filename}`;

    const { error } = await supabase.storage.from("challenge-assets").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) throw error;

    return {
      publicUrl: `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${path}`,
      storagePath: path,
    };
  };

  const ensureRolesExist = async (roles) => {
    const { data: existing } = await supabase.from("creative_roles").select("name");
    const existingNames = existing.map((r) => r.name);
    const newRoles = roles.filter((r) => !existingNames.includes(r));
    for (const role of newRoles) {
      await supabase.from("creative_roles").insert({ name: role });
    }
  };

  const saveDraft = async (id) => {
    const updates = editingDrafts[id] || {};
    const file = newAssets[id];
    const roles = updates.roles ?? drafts.find((d) => d.id === id)?.roles ?? [];

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    try {
      await ensureRolesExist(roles);
    } catch (err) {
      console.error("Error ensuring roles exist:", err.message);
    }

    if (file) {
      try {
        const upload = await uploadNewAsset(file, userId, id);
        updates.assets = [upload.storagePath];
      } catch (err) {
        console.error("Upload failed:", err.message);
        return;
      }
    }

    const { error } = await supabase.from("challenge_drafts").update(updates).eq("id", id);
    if (error) {
      console.error("Error saving draft:", error);
    } else {
      fetchDrafts();
      setEditingDrafts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setNewAssets((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const deleteDraft = async (id) => {
    const { error } = await supabase.from("challenge_drafts").delete().eq("id", id);
    if (error) console.error("Error deleting draft:", error);
    else fetchDrafts();
  };

  const publishDraft = async (id) => {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;
    try {
      await ensureRolesExist(draft.roles);
    } catch (err) {
      console.error("Error ensuring roles exist:", err.message);
    }

    const { error: insertError } = await supabase.from("challenges").insert({
      auth_users_id: draft.auth_users_id,
      title: draft.title,
      description: draft.description,
      overview: draft.overview,
      intent: draft.intent,
      refined_intent: draft.refined_intent,
      board: draft.board,
      budget: draft.budget,
      deadline: draft.deadline,
      roles: draft.roles,
      assets: draft.assets,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error publishing challenge:", insertError);
    } else {
      await deleteDraft(id);
      router.push("/challenge");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Finalize Challenge Drafts</h1>
      <p className="mb-6 text-gray-600">
        Below are your saved challenge drafts. You can edit, save, delete, or publish them.
      </p>

      {loading ? (
        <p>Loading drafts...</p>
      ) : drafts.length === 0 ? (
        <p>No drafts found.</p>
      ) : (
        drafts.map((draft) => {
          const edit = editingDrafts[draft.id] || {};
          const imageUrl = draft.assets?.[0]
            ? `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${draft.assets[0]}`
            : null;

          return (
            <div key={draft.id} className="mb-6 border p-4 rounded shadow bg-white">
              <label className="block font-semibold">Title</label>
              <input className="w-full p-2 border rounded mb-3" value={edit.title ?? draft.title} onChange={(e) => handleEditChange(draft.id, "title", e.target.value)} />

              <label className="block font-semibold">Description</label>
              <textarea className="w-full p-2 border rounded mb-3" value={edit.description ?? draft.description} onChange={(e) => handleEditChange(draft.id, "description", e.target.value)} />

              <label className="block font-semibold">Overview</label>
              <textarea className="w-full p-2 border rounded mb-3" value={edit.overview ?? draft.overview} onChange={(e) => handleEditChange(draft.id, "overview", e.target.value)} />

              <label className="block font-semibold">Intent</label>
              <input className="w-full p-2 border rounded mb-3" value={edit.intent ?? draft.intent} onChange={(e) => handleEditChange(draft.id, "intent", e.target.value)} />

              <label className="block font-semibold">Refined Intent</label>
              <input className="w-full p-2 border rounded mb-3" value={edit.refined_intent ?? draft.refined_intent} onChange={(e) => handleEditChange(draft.id, "refined_intent", e.target.value)} />

              <label className="block font-semibold">Board</label>
              <select className="w-full p-2 border rounded mb-3" value={edit.board ?? draft.board} onChange={(e) => handleEditChange(draft.id, "board", e.target.value)}>
                <option value="">Select Board</option>
                {boards.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <label className="block font-semibold">Roles</label>
              <div className="flex gap-2 mb-2">
                <select value={selectedRole[draft.id] ?? ""} onChange={(e) => setSelectedRole((prev) => ({ ...prev, [draft.id]: e.target.value }))} className="p-2 border rounded">
                  <option value="">Select a role</option>
                  {allRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <button onClick={() => handleAddRole(draft.id)} className="bg-gray-800 text-white px-4 py-2 rounded">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(edit.roles ?? draft.roles)?.map((role) => (
                  <span key={role} className="bg-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {role} <button onClick={() => handleRemoveRole(draft.id, role)}>×</button>
                  </span>
                ))}
              </div>

              <label className="block font-semibold">Budget</label>
              <input type="number" className="w-full p-2 border rounded mb-3" value={edit.budget ?? draft.budget} onChange={(e) => handleEditChange(draft.id, "budget", e.target.value)} />

              <label className="block font-semibold">Deadline</label>
              <input type="date" className="w-full p-2 border rounded mb-3" value={edit.deadline ?? draft.deadline} onChange={(e) => handleEditChange(draft.id, "deadline", e.target.value)} />

              {imageUrl && (
                <div className="mb-3">
                  <label className="block font-semibold mb-1">Preview Asset</label>
                  <Image src={imageUrl} alt="Draft Asset" width={300} height={200} className="rounded border" />
                </div>
              )}

              <label className="block font-semibold">Upload New Asset (Optional)</label>
              <input type="file" onChange={(e) => handleAssetChange(draft.id, e.target.files[0])} className="mb-4" />

              <div className="flex gap-4 mt-4">
                <button onClick={() => saveDraft(draft.id)} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => deleteDraft(draft.id)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                <button onClick={() => publishDraft(draft.id)} className="bg-green-600 text-white px-4 py-2 rounded">Publish</button>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
