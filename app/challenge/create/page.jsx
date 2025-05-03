"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateChallengePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intent, setIntent] = useState("");
  const [tonePrompt, setTonePrompt] = useState("");
  const [mediumPrompt, setMediumPrompt] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [saving, setSaving] = useState(false);
  const [aaaIdeas, setAaaIdeas] = useState([]);
  const [keptIdeas, setKeptIdeas] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [error, setError] = useState(null);
  const [loadingAAA, setLoadingAAA] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAsset(file);
    setAssetPreview(URL.createObjectURL(file));
  };

  const fetchRolesAndBoards = async () => {
    const { data: roleData } = await supabase.from("creative_roles").select("name");
    const { data: boardData } = await supabase.from("challenge_boards").select("name");
    setAllRoles(roleData?.map((r) => r.name) || []);
    setBoards(boardData?.map((b) => b.name) || []);
  };

  const addRole = () => {
    if (selectedRole && !roles.includes(selectedRole)) {
      setRoles([...roles, selectedRole]);
      setSelectedRole("");
    }
  };

  const removeRole = (role) => {
    setRoles(roles.filter((r) => r !== role));
  };

  const keepIdea = (idea) => {
    if (!keptIdeas.find((i) => i.title === idea.title)) {
      setKeptIdeas([...keptIdeas, idea]);
    }
  };

  const discardIdea = (idea) => {
    setAaaIdeas(aaaIdeas.filter((i) => i.title !== idea.title));
  };

  const uploadAsset = async (file, userId, draftId) => {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const relativePath = `${userId}/${draftId}/${filename}`;
    const { error } = await supabase.storage
      .from("challenge-assets")
      .upload(relativePath, file, { upsert: true });
    if (error) throw error;
    return relativePath;
  };

  const saveSingleDraft = async (data, file, userId) => {
    const { data: inserted, error: insertError } = await supabase
      .from("challenge_drafts")
      .insert(data)
      .select("id")
      .single();

    if (insertError) throw insertError;

    const draftId = inserted.id;
    if (file) {
      const relativePath = await uploadAsset(file, userId, draftId);
      const { error: updateError } = await supabase
        .from("challenge_drafts")
        .update({ assets: [relativePath] })
        .eq("id", draftId);
      if (updateError) throw updateError;
    }
    return draftId;
  };

  const handleCreateChallenge = async () => {
    setSaving(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return setSaving(false);

    try {
      await saveSingleDraft(
        {
          auth_users_id: user.id,
          title,
          description,
          intent,
          board: selectedBoard,
          budget,
          deadline,
          roles,
          assets: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
        asset,
        user.id
      );

      for (const idea of keptIdeas) {
        await saveSingleDraft(
          {
            auth_users_id: user.id,
            title: idea.title,
            description: idea.description,
            overview: idea.overview,
            refined_intent: idea.intent,
            intent,
            board: selectedBoard,
            budget,
            deadline,
            roles: idea.roles || roles,
            assets: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          asset,
          user.id
        );
      }

      router.push("/challenge/draft");
    } catch (err) {
      console.error("Error saving challenge:", err.message);
      setError("Failed to save challenge.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setError(null);
    setLoadingAAA(true);
    const payload = {
      input_text: description + `\nTone: ${tonePrompt}\nMedium: ${mediumPrompt}`,
      intent
    };

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Missing Supabase auth token");

      const response = await fetch("https://tyxhurtlifaufindxhex.supabase.co/functions/v1/generate-challenge-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate ideas");
      }

      const data = await response.json();
      setAaaIdeas(data.ideas || []);
    } catch (err) {
      console.error("AAA error:", err.message);
      setError("Failed to generate ideas.");
    } finally {
      setLoadingAAA(false);
    }
  };

  const handleEditIdea = (idx) => {
    setEditingIndex(idx);
    setEditingIdea({ ...aaaIdeas[idx] });
  };

  const handleSaveEdit = () => {
    const updated = [...aaaIdeas];
    updated[editingIndex] = editingIdea;
    setAaaIdeas(updated);
    setEditingIndex(null);
    setEditingIdea(null);
  };

  useEffect(() => {
    fetchRolesAndBoards();
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create Challenge(s)</h1>
      <p className="mb-6 text-sm text-gray-700">
        Step 1 of 3: <strong>Create → Draft → Publish</strong>. Your entries will autosave once you hit "Save Challenge Drafts".
      </p>

      <label className="block mb-2">Title</label>
      <input className="w-full p-2 border rounded mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className="block mb-2">Description</label>
      <textarea className="w-full p-2 border rounded mb-4" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label className="block mb-2">Intent</label>
      <input className="w-full p-2 border rounded mb-4" value={intent} onChange={(e) => setIntent(e.target.value)} />

      <label className="block mb-2">Tone / Style Prompt (Optional)</label>
      <input className="w-full p-2 border rounded mb-4" value={tonePrompt} onChange={(e) => setTonePrompt(e.target.value)} placeholder="e.g., make it funny, nostalgic, emotional" />

      <label className="block mb-2">Preferred Medium (Optional)</label>
      <input className="w-full p-2 border rounded mb-4" value={mediumPrompt} onChange={(e) => setMediumPrompt(e.target.value)} placeholder="e.g., music, sculpture, photography" />

      <label className="block mb-2">Challenge Board</label>
      <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="w-full p-2 border rounded mb-4">
        <option value="">Select a Board</option>
        {boards.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <label className="block mb-2">Budget</label>
      <input type="number" className="w-full p-2 border rounded mb-4" value={budget} onChange={(e) => setBudget(e.target.value)} />

      <label className="block mb-2">Deadline</label>
      <input type="date" className="w-full p-2 border rounded mb-4" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

      <label className="block mb-2">Upload Asset</label>
      <input type="file" onChange={handleFileUpload} />
      {assetPreview && <Image src={assetPreview} alt="Preview" width={300} height={200} className="my-4 border rounded" />}

      <label className="block mb-2">Creative Roles Needed</label>
      <div className="flex gap-2 mb-2">
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="p-2 border rounded">
          <option value="">Select a role</option>
          {allRoles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button onClick={addRole} className="bg-gray-800 text-white px-4 py-2 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((role) => (
          <span key={role} className="bg-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {role} <button onClick={() => removeRole(role)}>×</button>
          </span>
        ))}
      </div>

      <p className="mb-2 text-sm text-gray-700">Want help generating ideas? Click below to use Activate Agent Assistant.</p>
      <button onClick={handleGenerateIdeas} className="bg-purple-700 text-white px-6 py-2 rounded">
        {loadingAAA ? "Thinking..." : "✨ Activate Agent Assistance"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {aaaIdeas.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Suggestions from Activate Agent Assistant:</p>
          {aaaIdeas.map((idea, idx) => (
            <div key={idx} className="p-3 border rounded mb-2 bg-white shadow-sm">
              {editingIndex === idx ? (
                <div>
                  <input className="w-full p-2 border rounded mb-2" value={editingIdea.title} onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })} />
                  <textarea className="w-full p-2 border rounded mb-2" value={editingIdea.description} onChange={(e) => setEditingIdea({ ...editingIdea, description: e.target.value })} />
                  <textarea className="w-full p-2 border rounded mb-2" value={editingIdea.overview} onChange={(e) => setEditingIdea({ ...editingIdea, overview: e.target.value })} />
                  <input className="w-full p-2 border rounded mb-2" value={editingIdea.intent} onChange={(e) => setEditingIdea({ ...editingIdea, intent: e.target.value })} />
                  <input className="w-full p-2 border rounded mb-2" value={editingIdea.roles?.join(", ")} onChange={(e) => setEditingIdea({ ...editingIdea, roles: e.target.value.split(",").map(r => r.trim()) })} />
                  <button onClick={handleSaveEdit} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">💾 Save Changes</button>
                </div>
              ) : (
                <>
                  <strong>{idea.title}</strong>
                  <p>{idea.description}</p>
                  {idea.overview && <p className="text-sm italic mt-1">Overview: {idea.overview}</p>}
                  {idea.intent && <p className="text-sm italic">Intent: {idea.intent}</p>}
                  <p className="text-sm text-gray-500">Roles: {idea.roles?.join(", ")}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => keepIdea(idea)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">✅ Keep</button>
                    <button onClick={() => discardIdea(idea)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">❌ Discard</button>
                    <button onClick={() => handleEditIdea(idx)} className="px-3 py-1 bg-gray-400 text-white rounded text-sm">✏️ Edit</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {keptIdeas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-bold mb-2">Saved Ideas</h3>
          {keptIdeas.map((idea, idx) => (
            <div key={idx} className="bg-gray-100 p-3 mb-2 rounded shadow">
              <strong>{idea.title}</strong>
              <p>{idea.description}</p>
              {idea.overview && <p className="text-sm italic mt-1">Overview: {idea.overview}</p>}
              {idea.intent && <p className="text-sm italic">Intent: {idea.intent}</p>}
              <p className="text-sm text-gray-600">Roles: {idea.roles?.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleCreateChallenge} className="bg-green-600 text-white px-6 py-2 mt-6 rounded">
        💾 Save Challenge Drafts
      </button>

      {saving && <p className="text-gray-500 mt-2 text-sm">Saving challenge drafts...</p>}
    </main>
  );
}
