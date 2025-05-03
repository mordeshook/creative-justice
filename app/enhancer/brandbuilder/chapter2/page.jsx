// app/enhancer/brandbuilder/chapter2/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import { Wand2 } from "lucide-react";


export default function Chapter2() {
  const { user } = useUser();
  const router = useRouter();

  const [draftId, setDraftId] = useState(null);

  const [brand_name, setBrandName] = useState("");
  const [brandSoul, setBrandSoul] = useState("");
  const [loadingSoul, setLoadingSoul] = useState(false);


  const [coreValues, setCoreValues] = useState([]);
  const [musicStyles, setMusicStyles] = useState([]);
  const [soundEffects, setSoundEffects] = useState([]);
  const [partyBehaviors, setPartyBehaviors] = useState([]);
  const [partyStyles, setPartyStyles] = useState([]);
 
  const [worldVisionOptions, setWorldVisionOptions] = useState([]);
  const [selectedWorldVisions, setSelectedWorldVisions] = useState([]);
  const [worldVisionInput, setWorldVisionInput] = useState("");
  const [showVisionList, setShowVisionList] = useState(false);


  const [selectedCoreValues, setSelectedCoreValues] = useState([]);
  const [selectedMusicStyles, setSelectedMusicStyles] = useState([]);
  const [selectedSoundEffects, setSelectedSoundEffects] = useState([]);
  const [selectedPartyBehavior, setSelectedPartyBehavior] = useState("");
  const [selectedPartyStyle, setSelectedPartyStyle] = useState("");

  

  const [culturalFlavorOptions, setCulturalFlavorOptions] = useState([]);
const [selectedCulturalFlavor, setSelectedCulturalFlavor] = useState([]);
const [culturalFlavorInput, setCulturalFlavorInput] = useState("");
const [showFlavorList, setShowFlavorList] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) setDraftId(id);
    }
  }, []);

  useEffect(() => {
    if (!user?.id || !draftId) return;

    const fetchOptions = async () => {
      const fetchTable = async (table) => {
        const { data } = await supabase.from(table).select("name");
        return data?.map((d) => d.name) || [];
      };

      const [core, music, sound, behavior, style, culture, vision] = await Promise.all([
        fetchTable("brand_core_values"),
        fetchTable("brand_music_styles"),
        fetchTable("brand_sound_effects"),
        fetchTable("brand_party_behaviors"),
        fetchTable("brand_party_styles"),
        fetchTable("brand_cultural_flavors"),
        fetchTable("brand_world_visions")
      ]);

      setCoreValues(core);
      setMusicStyles(music);
      setSoundEffects(sound);
      setPartyBehaviors(behavior);
      setPartyStyles(style);
      setCulturalFlavorOptions(culture);
      setWorldVisionOptions(vision);
    };

    const fetchExisting = async () => {
      const { data } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("auth_users_id", user.id)
        .eq("id", draftId)
        .single();

      if (data) {
        setBrandName(data.brand_name || "");
        setBrandSoul(data.brand_soul || "");
        setSelectedCoreValues(data.brand_core_values?.split(",") || []);
        setSelectedMusicStyles(data.brand_music_styles?.split(",") || []);
        setSelectedSoundEffects(data.brand_sound_effects?.split(",") || []);
        setSelectedPartyBehavior(data.brand_party_behaviors || "");
        setSelectedPartyStyle(data.brand_party_styles || "");
        setSelectedCulturalFlavor(data.brand_cultural_flavors?.split(",") || []);
        setSelectedWorldVisions(data.brand_world_visions?.split(",") || []);
      }
    };

    fetchOptions();
    fetchExisting();
  }, [user?.id, draftId]);

  const addMulti = (value, setter, current) => {
    if (value && !current.includes(value)) setter([...current, value]);
  };

  const removeMulti = (value, setter, current) => {
    setter(current.filter((item) => item !== value));
  };

  const handleSave = async () => {
    if (!draftId) return;

    const updates = {
      brand_soul: brandSoul,
      brand_core_values: selectedCoreValues.join(","),
      brand_music_styles: selectedMusicStyles.join(","),
      brand_sound_effects: selectedSoundEffects.join(","),
      brand_party_behaviors: selectedPartyBehavior,
      brand_party_styles: selectedPartyStyle,
      brand_cultural_flavors: selectedCulturalFlavor.join(","),
      brand_world_visions: selectedWorldVisions.join(","),
    };

    const { error } = await supabase
      .from("brand_profiles_drafts")
      .update(updates)
      .eq("id", draftId)
      .eq("auth_users_id", user.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      console.log("Saved successfully.");
    }
  };

  const handleNext = async () => {
    if (!draftId) return alert("Missing draft ID");
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter3?id=${draftId}`);
  };

  const handleBack = async () => {
    if (!draftId) return alert("Missing draft ID");
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter1?id=${draftId}`);
  };

  const handleWandEnhanceSoul = async () => {
    try {
      setLoadingSoul(true);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
  
      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/enhancer-chapter2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId,
          field: "brand_soul",
          question: "How would you describe the deeper meaning behind your brand—its soul, its essence?",
          existing: brandSoul,
        }),
      });
  
      const json = await res.json();
if (json.result) {
  setBrandSoul(json.result);
  console.log("📤 GPT PROMPT:\n", json.debug); // ✅ This shows exactly what GPT saw
} else {
  console.error("No result returned:", json);
}
    } catch (err) {
      console.error("Error enhancing soul:", err);
    } finally {
      setLoadingSoul(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="text-green-600 font-semibold">Chapter 2 of 7</div>
          <div>Editing: <span className="text-black font-semibold">{brand_name}</span></div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: "28.57%" }}></div>
        </div>

        <h2 className="text-2xl font-bold mb-4">🌀 Shape Your Soul</h2>

        <div className="mb-6">
  <div className="flex justify-between items-center mb-1">
    <label className="block text-sm font-medium">
      How would you describe the deeper meaning behind your brand—its soul, its essence?
    </label>
    <button
      onClick={handleWandEnhanceSoul}
      title="Enhance with AAA"
      className="hover:text-[#cc006f]"
      disabled={loadingSoul}
    >
      {loadingSoul ? "⏳" : <Wand2 className="w-5 h-5" color="#e5007d" />}
    </button>
  </div>
  <textarea
    value={brandSoul}
    onChange={(e) => setBrandSoul(e.target.value)}
    className="w-full border px-3 py-2 rounded"
    placeholder="Write something brief. The wand will replace it with an enhanced version."
  />
</div>


        {[{
          label: "Core Value",
          selected: selectedCoreValues,
          options: coreValues,
          setter: setSelectedCoreValues
        }, {
          label: "Music Style",
          selected: selectedMusicStyles,
          options: musicStyles,
          setter: setSelectedMusicStyles
        }, {
          label: "Sound Effect",
          selected: selectedSoundEffects,
          options: soundEffects,
          setter: setSelectedSoundEffects
        }].map(({ label, selected, options, setter }) => (
          <div className="mb-4" key={label}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select
              onChange={(e) => addMulti(e.target.value, setter, selected)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selected.map((val, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                  {val}
                  <button onClick={() => removeMulti(val, setter, selected)} className="ml-2 text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Party Behavior</label>
          <select
            value={selectedPartyBehavior}
            onChange={(e) => setSelectedPartyBehavior(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select party behavior</option>
            {partyBehaviors.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Party Style</label>
          <select
            value={selectedPartyStyle}
            onChange={(e) => setSelectedPartyStyle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select party style</option>
            {partyStyles.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 relative">
  <label className="block text-sm font-medium mb-1">Cultural Flavor</label>
  <input
    type="text"
    value={culturalFlavorInput}
    onChange={(e) => setCulturalFlavorInput(e.target.value)}
    onFocus={() => setShowFlavorList(true)}
    onBlur={() => setTimeout(() => setShowFlavorList(false), 150)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = culturalFlavorInput.trim();
        if (value && !selectedCulturalFlavor.includes(value)) {
          setSelectedCulturalFlavor([...selectedCulturalFlavor, value]);
          setCulturalFlavorInput("");
        }
      }
    }}
    className="w-full border px-3 py-2 rounded"
    placeholder="Type or choose a Cultural Flavor"
  />

  {showFlavorList && culturalFlavorOptions.length > 0 && (
    <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
      {culturalFlavorOptions
        .filter((opt) => opt.toLowerCase().includes(culturalFlavorInput.toLowerCase()))
        .map((opt, idx) => (
          <li
            key={idx}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onMouseDown={() => {
              if (!selectedCulturalFlavor.includes(opt)) {
                setSelectedCulturalFlavor([...selectedCulturalFlavor, opt]);
              }
              setCulturalFlavorInput("");
            }}
          >
            {opt}
          </li>
        ))}
    </ul>
  )}

  <div className="flex flex-wrap gap-2 mt-2">
    {selectedCulturalFlavor.map((val, idx) => (
      <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
        {val}
        <button
          onClick={() => removeMulti(val, setSelectedCulturalFlavor, selectedCulturalFlavor)}
          className="ml-2 text-red-500 font-bold"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>


<div className="mb-6 relative">
  <label className="block text-sm font-medium mb-1">World Vision</label>
  <input
    type="text"
    value={worldVisionInput}
    onChange={(e) => setWorldVisionInput(e.target.value)}
    onFocus={() => setShowVisionList(true)}
    onBlur={() => setTimeout(() => setShowVisionList(false), 150)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = worldVisionInput.trim();
        if (value && !selectedWorldVisions.includes(value)) {
          setSelectedWorldVisions([...selectedWorldVisions, value]);
          setWorldVisionInput("");
        }
      }
    }}
    className="w-full border px-3 py-2 rounded"
    placeholder="Type or choose a World Vision"
  />

  {showVisionList && worldVisionOptions.length > 0 && (
    <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
      {worldVisionOptions
        .filter((opt) => opt.toLowerCase().includes(worldVisionInput.toLowerCase()))
        .map((opt, idx) => (
          <li
            key={idx}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onMouseDown={() => {
              if (!selectedWorldVisions.includes(opt)) {
                setSelectedWorldVisions([...selectedWorldVisions, opt]);
              }
              setWorldVisionInput("");
            }}
          >
            {opt}
          </li>
        ))}
    </ul>
  )}

  <div className="flex flex-wrap gap-2 mt-2">
    {selectedWorldVisions.map((val, idx) => (
      <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
        {val}
        <button
          onClick={() => removeMulti(val, setSelectedWorldVisions, selectedWorldVisions)}
          className="ml-2 text-red-500 font-bold"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>


        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={handleNext}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
