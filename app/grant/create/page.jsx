"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function CreateGrantPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intent, setIntent] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [asset, setAsset] = useState(null);
  const [assetPreview, setAssetPreview] = useState(null);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [allRoles, setAllRoles] = useState([]);

  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [allSkills, setAllSkills] = useState([]);

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      const { data: roleData } = await supabase.from("creative_roles").select("name");
      const { data: skillData } = await supabase.from("skills").select("name");
      const { data: boardData } = await supabase.from("challenge_boards").select("name").eq("is_public", true);

      setAllRoles(roleData?.map(r => r.name) || []);
      setAllSkills(skillData?.map(s => s.name) || []);
      setBoards(boardData?.map(b => b.name) || []);
    };

    fetchMeta();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAsset(file);
    setAssetPreview(URL.createObjectURL(file));
  };

  const addRole = () => {
    if (selectedRole && !roles.includes(selectedRole)) {
      setRoles([...roles, selectedRole]);
      setSelectedRole("");
    }
  };

  const addSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
      setSelectedSkill("");
    }
  };

  const removeRole = (role) => setRoles(roles.filter((r) => r !== role));
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const saveDraft = async () => {
    setSaving(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData?.session?.user;
    if (!sessionUser) return;

    await supabase.from("opportunity_grants").upsert({
      auth_users_id: sessionUser.id,
      title,
      description,
      intent,
      budget,
      deadline,
      board: selectedBoard,
      roles,
      skills,
      assets: asset ? [{ name: asset.name }] : [],
      created_at: new Date(),
    });

    setSaving(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title || description || intent) saveDraft();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [title, description, intent, budget, deadline, roles, skills, selectedBoard]);

  const handleSubmit = async () => {
    await saveDraft();
    router.push("/dashboard");
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create an Opportunity Grant</h1>

      <label className="block mb-1">Title</label>
      <input className="w-full p-2 border rounded mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className="block mb-1">Description</label>
      <textarea className="w-full p-2 border rounded mb-4" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label className="block mb-1">Intent / Goal</label>
      <input className="w-full p-2 border rounded mb-4" value={intent} onChange={(e) => setIntent(e.target.value)} />

      <label className="block mb-1">Challenge Board</label>
      <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)} className="w-full p-2 border rounded mb-4">
        <option value="">Select a Board</option>
        {boards.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      <label className="block mb-1">Budget</label>
      <input type="number" className="w-full p-2 border rounded mb-4" value={budget} onChange={(e) => setBudget(e.target.value)} />

      <label className="block mb-1">Deadline</label>
      <input type="date" className="w-full p-2 border rounded mb-4" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

      <label className="block mb-1">Upload Preview Asset</label>
      <input type="file" onChange={handleFileUpload} />
      {assetPreview && <Image src={assetPreview} alt="preview" width={300} height={200} className="my-3 rounded border" />}

      <label className="block mt-4 mb-1">Creative Roles Needed</label>
      <div className="flex gap-2 mb-2">
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="p-2 border rounded">
          <option value="">Select a Role</option>
          {allRoles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button onClick={addRole} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map((role) => (
          <span key={role} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {role} <button onClick={() => removeRole(role)}>×</button>
          </span>
        ))}
      </div>

      <label className="block mt-4 mb-1">Skills Needed</label>
      <div className="flex gap-2 mb-2">
        <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="p-2 border rounded">
          <option value="">Select a Skill</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
        <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {skills.map((skill) => (
          <span key={skill} className="bg-green-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {skill} <button onClick={() => removeSkill(skill)}>×</button>
          </span>
        ))}
      </div>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded">
        ✅ Save & Return to Dashboard
      </button>

      {saving && <p className="text-gray-500 mt-2 text-sm">Auto-saving draft...</p>}
    </main>
  );
}
