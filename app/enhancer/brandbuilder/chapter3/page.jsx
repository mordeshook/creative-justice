// app/enhancer/brandbuilder/chapter3/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";

export default function Chapter3() {
  const { user } = useUser();
  const router = useRouter();

  const [draftId, setDraftId] = useState(null);

  const [brandName, setBrandName] = useState("");
  const [brandMotto, setBrandMotto] = useState("");
  const [brandPhrase, setBrandPhrase] = useState("");

  const [spiritAnimals, setSpiritAnimals] = useState([]);
  const [spiritAnimalInput, setSpiritAnimalInput] = useState("");
  const [selectedSpiritAnimal, setSelectedSpiritAnimal] = useState("");
  const [showSpiritList, setShowSpiritList] = useState(false);

  const [motivationalEnergy, setMotivationalEnergy] = useState([]);
  const [selectedMotivation, setSelectedMotivation] = useState([]);

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

      const [animals, motivations] = await Promise.all([
        fetchTable("brand_spirit_animals"),
        fetchTable("brand_motivational_energy"),
      ]);

      setSpiritAnimals(animals);
      setMotivationalEnergy(motivations);
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
        setBrandMotto(data.brand_motto || "");
        setBrandPhrase(data.brand_phrase || "");
        setSelectedSpiritAnimal(data.brand_spirit_animal || "");
        setSelectedMotivation(data.brand_motivation_energy?.split(",") || []);
      }
    };

    fetchOptions();
    fetchExisting();
  }, [user?.id, draftId]);

  const handleAddMotivation = (value) => {
    if (value && !selectedMotivation.includes(value)) {
      setSelectedMotivation([...selectedMotivation, value]);
    }
  };

  const handleRemoveMotivation = (value) => {
    setSelectedMotivation(selectedMotivation.filter((v) => v !== value));
  };

  const handleSave = async () => {
    if (!draftId) return;

    const updates = {
      brand_motto: brandMotto,
      brand_phrase: brandPhrase,
      brand_spirit_animal: selectedSpiritAnimal,
      brand_motivation_energy: selectedMotivation.join(","),
    };

    const { error } = await supabase
      .from("brand_profiles_drafts")
      .update(updates)
      .eq("id", draftId)
      .eq("auth_users_id", user.id);

    if (error) alert("Save failed: " + error.message);
    else console.log("Saved successfully.");
  };

  const handleNext = async () => {
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter4?id=${draftId}`);
  };

  const handleBack = async () => {
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter2?id=${draftId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="text-green-600 font-semibold">Chapter 3 of 7</div>
          <div className="text-black font-bold">Brand: {brandName}</div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: "42.85%" }}></div>
        </div>

        <h2 className="text-2xl font-bold mb-4">💫 Give it Spirit</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            What is your brand’s personal motto or mantra?
          </label>
          <textarea
            value={brandMotto}
            onChange={(e) => setBrandMotto(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your brand motto"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            What’s a saying or phrase that sums up your brand’s attitude?
          </label>
          <textarea
            value={brandPhrase}
            onChange={(e) => setBrandPhrase(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter a representative phrase"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">Spirit Animal</label>
          <input
            type="text"
            value={spiritAnimalInput}
            onChange={(e) => setSpiritAnimalInput(e.target.value)}
            onFocus={() => setShowSpiritList(true)}
            onBlur={() => setTimeout(() => setShowSpiritList(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = spiritAnimalInput.trim();
                if (value) {
                  setSelectedSpiritAnimal(value);
                  setSpiritAnimalInput("");
                }
              }
            }}
            className="w-full border px-3 py-2 rounded"
            placeholder="Type or choose a Spirit Animal"
          />

          {showSpiritList && spiritAnimals.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
              {spiritAnimals
                .filter((opt) => opt.toLowerCase().includes(spiritAnimalInput.toLowerCase()))
                .map((opt, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSelectedSpiritAnimal(opt);
                      setSpiritAnimalInput("");
                    }}
                  >
                    {opt}
                  </li>
                ))}
            </ul>
          )}

          {selectedSpiritAnimal && (
            <div className="mt-2">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm inline-flex items-center">
                {selectedSpiritAnimal}
                <button
                  onClick={() => setSelectedSpiritAnimal("")}
                  className="ml-2 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Motivational Energy</label>
          <select
            onChange={(e) => handleAddMotivation(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select or add energy</option>
            {motivationalEnergy.map((mot, idx) => (
              <option key={idx} value={mot}>{mot}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedMotivation.map((m, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {m}
                <button
                  onClick={() => handleRemoveMotivation(m)}
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
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
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
