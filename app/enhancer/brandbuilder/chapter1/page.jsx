// app/enhancer/brandbuilder/chapter1/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function Chapter1() {
  const { user } = useUser();
  const router = useRouter();
  const [brand_name, setBrandName] = useState("");
  const [mission_statement, setMissionStatement] = useState("");
  const [adjectiveOptions, setAdjectiveOptions] = useState([]);
  const [selectedAdjectives, setSelectedAdjectives] = useState([]);
  const [personalityOptions, setPersonalityOptions] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const [{ data: adjectives }, { data: personalities }, { data: drafts }] = await Promise.all([
        supabase.from("brand_adjectives").select("name"),
        supabase.from("brand_personality").select("name"),
        supabase
          .from("brand_profiles_drafts")
          .select("id, brand_name")
          .eq("auth_users_id", user.id)
          .order("created_at", { ascending: false })
      ]);

      if (adjectives) setAdjectiveOptions(adjectives.map((d) => d.name));
      if (personalities) setPersonalityOptions(personalities.map((d) => d.name));
      if (drafts) setBrandOptions(drafts);
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!id || !user?.id) return;

    const fetchDraft = async () => {
      const { data } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setBrandName(data.brand_name || "");
        setMissionStatement(data.mission_statement || "");
        setSelectedAdjectives(data.brand_adjectives?.split(",") || []);
        setSelectedPersonality(data.brand_personality?.split(",") || []);
      }
    };

    fetchDraft();
  }, [id, user?.id]);

  const handleSave = async () => {
    if (!user?.id) return alert("Not logged in");

    const draftData = {
      auth_users_id: user.id,
      is_draft: true,
      brand_name,
      mission_statement,
      brand_adjectives: selectedAdjectives.join(","),
      brand_personality: selectedPersonality.join(",")
    };

    console.log("Saving draft. ID:", id, "DATA:", draftData);

    if (id) {
      const { data, error } = await supabase
        .from("brand_profiles_drafts")
        .update(draftData)
        .eq("id", id)
        .eq("auth_users_id", user.id)
        .select();

      if (error) {
        console.error("Update failed:", error.message);
        alert("Update failed: " + error.message);
      } else {
        console.log("Update success:", data);
      }
    } else {
      const { data, error } = await supabase
        .from("brand_profiles_drafts")
        .insert({ id: uuidv4(), ...draftData })
        .select();

      if (error) {
        console.error("Insert failed:", error.message);
        alert("Insert failed: " + error.message);
      } else if (data?.[0]) {
        setId(data[0].id);
        console.log("Insert success:", data[0]);
      }
    }
  };

  const handleAdjectiveAdd = (value) => {
    if (value && !selectedAdjectives.includes(value)) {
      setSelectedAdjectives([...selectedAdjectives, value]);
    }
  };

  const handleAdjectiveRemove = (value) => {
    setSelectedAdjectives(selectedAdjectives.filter((a) => a !== value));
  };

  const handlePersonalityAdd = (value) => {
    if (value && !selectedPersonality.includes(value)) {
      setSelectedPersonality([...selectedPersonality, value]);
    }
  };

  const handlePersonalityRemove = (value) => {
    setSelectedPersonality(selectedPersonality.filter((p) => p !== value));
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <div className="text-green-600 font-semibold">Chapter 1 of 7</div>
          </div>
          <div>
            <select
              className="border text-sm px-3 py-2 rounded"
              onChange={(e) => {
                const val = e.target.value;
                if (val === "new") {
                  setId(null);
                  setBrandName("");
                  setMissionStatement("");
                  setSelectedAdjectives([]);
                  setSelectedPersonality([]);
                } else {
                  setId(val);
                }
              }}
            >
              <option value="">Select Brand to Edit</option>
              <option value="new">Create New Brand</option>
              {brandOptions.map((b) => (
                <option key={b.id} value={b.id}>{b.brand_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: "14.28%" }}></div>
        </div>

        <h2 className="text-2xl font-bold mb-4">🌱 Plant Your Seed</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name Your Brand*</label>
          <input
            value={brand_name}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter brand name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mission Statement</label>
          <textarea
            value={mission_statement}
            onChange={(e) => setMissionStatement(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter mission statement"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Three Adjectives</label>
          <select
            onChange={(e) => handleAdjectiveAdd(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select adjective to add</option>
            {adjectiveOptions.map((a, idx) => (
              <option key={idx} value={a}>{a}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAdjectives.map((a, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {a}
                <button onClick={() => handleAdjectiveRemove(a)} className="ml-2 text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Describe Your Brand as a Person</label>
          <select
            onChange={(e) => handlePersonalityAdd(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select personality to add</option>
            {personalityOptions.map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedPersonality.map((p, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                {p}
                <button onClick={() => handlePersonalityRemove(p)} className="ml-2 text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Save
          </button>
          <button
  onClick={async () => {
    let finalId = id;

    if (!finalId) {
      const { data, error } = await supabase
        .from("brand_profiles_drafts")
        .insert({
          id: uuidv4(),
          auth_users_id: user.id,
          is_draft: true,
          brand_name,
          mission_statement,
          brand_adjectives: selectedAdjectives.join(","),
          brand_personality: selectedPersonality.join(",")
        })
        .select();

      if (error) {
        console.error("Insert failed:", error.message);
        return alert("Insert failed: " + error.message);
      }

      finalId = data?.[0]?.id;
      setId(finalId);
    } else {
      const { error } = await supabase
        .from("brand_profiles_drafts")
        .update({
          brand_name,
          mission_statement,
          brand_adjectives: selectedAdjectives.join(","),
          brand_personality: selectedPersonality.join(",")
        })
        .eq("id", finalId)
        .eq("auth_users_id", user.id);

      if (error) {
        console.error("Update failed:", error.message);
        return alert("Update failed: " + error.message);
      }
    }

    router.push(`/enhancer/brandbuilder/chapter2?id=${finalId}`);
  }}
  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
>
  Next Chapter
</button>
        </div>
      </div>
    </div>
  );
}
