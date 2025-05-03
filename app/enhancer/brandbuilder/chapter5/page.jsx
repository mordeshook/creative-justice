// app/enhancer/brandbuilder/chapter5/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";

export default function Chapter5() {
  const { user } = useUser();
  const router = useRouter();

  const [brandName, setBrandName] = useState("");
  const [draftId, setDraftId] = useState(null);


  const [disruptOrConquer, setDisruptOrConquer] = useState("");
  const [disruptText, setDisruptText] = useState("");
  const [conquerText, setConquerText] = useState("");

  const [principles, setPrinciples] = useState([]);
  const [selectedPrinciples, setSelectedPrinciples] = useState([]);
  const [customPrinciple, setCustomPrinciple] = useState("");

  const [tensions, setTensions] = useState([]);
  const [selectedTensions, setSelectedTensions] = useState([]);
  const [customTensionLeft, setCustomTensionLeft] = useState("");
  const [customTensionRight, setCustomTensionRight] = useState("");

  const [collabStyles, setCollabStyles] = useState([]);
  const [selectedCollabStyles, setSelectedCollabStyles] = useState([]);
  const [customCollab, setCustomCollab] = useState("");

  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [customFilter, setCustomFilter] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDraftId(params.get("id"));
    }
  }, []);

  useEffect(() => {
    if (!user?.id || !draftId) return;
  
    const fetchEverything = async () => {
      const [{ data: principlesData }, { data: tensionsData }, { data: collabData }, { data: filtersData }] = await Promise.all([
        supabase.from("brand_principles").select("name"),
        supabase.from("brand_tensions").select("name"),
        supabase.from("brand_collaboration_styles").select("name"),
        supabase.from("brand_filters").select("name")
      ]);
  
      setPrinciples(principlesData?.map(p => p.name) || []);
      setTensions(tensionsData?.map(t => t.name) || []);
      setCollabStyles(collabData?.map(c => c.name) || []);
      setFilters(filtersData?.map(f => f.name) || []);
  
      const { data: draft } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("auth_users_id", user.id)
        .eq("id", draftId)
        .single();
  
      if (draft) {
        setBrandName(draft.brand_name || "");
        setDisruptOrConquer(draft.disruption_or_conquest || "");
        setDisruptText(draft.disrupt_text || "");
        setConquerText(draft.conquer_text || "");
        setSelectedPrinciples([
          ...(draft.brand_principles?.split(",") || []),
          ...(draft.brand_principles_custom?.split(",") || [])
        ]);
        setSelectedTensions([
          ...(draft.brand_tensions?.split(",") || []),
          ...(draft.brand_tensions_custom?.split(",") || [])
        ]);
        setSelectedCollabStyles([
          ...(draft.brand_collaboration_styles?.split(",") || []),
          ...(draft.brand_collaboration_styles_custom?.split(",") || [])
        ]);
        setSelectedFilters([
          ...(draft.brand_filters?.split(",") || []),
          ...(draft.brand_filters_custom?.split(",") || [])
        ]);
      }
    };
  
    fetchEverything();
  }, [user?.id, draftId]);

  const handleSave = async () => {
    if (!user?.id || !draftId) return;
  
    const corePrinciplesFromTable = principles || [];
    const predefinedPrinciples = selectedPrinciples.filter(p => corePrinciplesFromTable.includes(p));
    const customPrinciples = selectedPrinciples.filter(p => !corePrinciplesFromTable.includes(p));
  
    const coreTensionsFromTable = tensions || [];
    const predefinedTensions = selectedTensions.filter(t => coreTensionsFromTable.includes(t));
    const customTensions = selectedTensions.filter(t => !coreTensionsFromTable.includes(t));
  
    const collabsFromTable = collabStyles || [];
    const predefinedCollabs = selectedCollabStyles.filter(c => collabsFromTable.includes(c));
    const customCollabs = selectedCollabStyles.filter(c => !collabsFromTable.includes(c));
  
    const filtersFromTable = filters || [];
    const predefinedFilters = selectedFilters.filter(f => filtersFromTable.includes(f));
    const customFilters = selectedFilters.filter(f => !filtersFromTable.includes(f));
  
    await supabase
      .from("brand_profiles_drafts")
      .update({
        disruption_or_conquest: disruptOrConquer,
        disrupt_text: disruptText,
        conquer_text: conquerText,
        brand_principles: predefinedPrinciples.join(","),
        brand_principles_custom: customPrinciples.join(","),
        brand_tensions: predefinedTensions.join(","),
        brand_tensions_custom: customTensions.join(","),
        brand_collaboration_styles: predefinedCollabs.join(","),
        brand_collaboration_styles_custom: customCollabs.join(","),
        brand_filters: predefinedFilters.join(","),
        brand_filters_custom: customFilters.join(",")
      })
      .eq("id", draftId)
      .eq("auth_users_id", user.id);
  };

  const toggleSelection = (value, list, setter, limit = 99) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value));
    else if (list.length < limit) setter([...list, value]);
  };

  const renderSelectedChips = (items, setter) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <span
          key={item}
          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          {item}
          <button
            onClick={() => toggleSelection(item, items, setter)}
            className="ml-2 text-red-500 font-bold"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="text-green-600 font-semibold">Chapter 5 of 7</div>
          <div className="text-black font-bold">Brand: {brandName}</div>
        </div>

        <h2 className="text-2xl font-bold mb-6">⚔️ Chapter 5: Blueprint for Brand OS</h2>

        {/* Question 1 */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">What Drives You: Disruption or Conquest?</h3>
          <div className="flex gap-4 mb-2">
            <button
              onClick={() => setDisruptOrConquer("disrupt")}
              className={`px-4 py-2 rounded border ${disruptOrConquer === "disrupt" ? "bg-blue-600 text-white" : "bg-white"}`}
            >🧨 Disrupt</button>
            <button
              onClick={() => setDisruptOrConquer("conquer")}
              className={`px-4 py-2 rounded border ${disruptOrConquer === "conquer" ? "bg-blue-600 text-white" : "bg-white"}`}
            >🏔 Conquer</button>
          </div>
          {disruptOrConquer === "disrupt" && (
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="What do you want to disrupt?"
              value={disruptText}
              onChange={(e) => setDisruptText(e.target.value)}
            />
          )}
          {disruptOrConquer === "conquer" && (
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="What do you want to conquer?"
              value={conquerText}
              onChange={(e) => setConquerText(e.target.value)}
            />
          )}
        </div>

        {/* Question 2: Principles */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Core Principles</h3>
          <div className="flex flex-wrap gap-2">
            {principles.map((p) => (
              <button
                key={p}
                className={`border px-3 py-1 rounded-full ${selectedPrinciples.includes(p) ? "bg-green-600 text-white" : "bg-white"}`}
                onClick={() => toggleSelection(p, selectedPrinciples, setSelectedPrinciples, 3)}
              >{p}</button>
            ))}
          </div>
          <input
            className="w-full mt-2 border px-2 py-1 rounded"
            placeholder="Add your own..."
            value={customPrinciple}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const trimmed = customPrinciple.trim();
                  if (trimmed && !selectedPrinciples.includes(trimmed) && selectedPrinciples.length < 3) {
                    setSelectedPrinciples([...selectedPrinciples, trimmed]);
                    setCustomPrinciple("");
                  }
                }
              }}
            onChange={(e) => setCustomPrinciple(e.target.value)}
          />
          {renderSelectedChips(selectedPrinciples, setSelectedPrinciples)}
        </div>

        {/* Question 3: Tensions */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Choose Your Tensions</h3>
          <div className="flex flex-wrap gap-2">
            {tensions.map((t) => (
              <button
                key={t}
                className={`border px-3 py-1 rounded-full ${selectedTensions.includes(t) ? "bg-blue-600 text-white" : "bg-white"}`}
                onClick={() => toggleSelection(t, selectedTensions, setSelectedTensions)}
              >{t}</button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              className="border px-2 py-1 rounded w-1/2"
              placeholder="Left word"
              value={customTensionLeft}
              onChange={(e) => setCustomTensionLeft(e.target.value)}
            />
            <input
              className="border px-2 py-1 rounded w-1/2"
              placeholder="Right word"
              value={customTensionRight}
              onChange={(e) => setCustomTensionRight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customTensionLeft && customTensionRight) {
                  const combined = `${customTensionLeft} ↔ ${customTensionRight}`;
                  toggleSelection(combined, selectedTensions, setSelectedTensions);
                  setCustomTensionLeft("");
                  setCustomTensionRight("");
                }
              }}
            />
          </div>
          {renderSelectedChips(selectedTensions, setSelectedTensions)}
        </div>

        {/* Question 4: Collaboration Style */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Your Brand's Collaboration Posture</h3>
          <div className="flex flex-wrap gap-2">
            {collabStyles.map((c) => (
              <button
                key={c}
                className={`border px-3 py-1 rounded-full ${selectedCollabStyles.includes(c) ? "bg-purple-600 text-white" : "bg-white"}`}
                onClick={() => toggleSelection(c, selectedCollabStyles, setSelectedCollabStyles)}
              >{c}</button>
            ))}
          </div>
          <input
            className="w-full mt-2 border px-2 py-1 rounded"
            placeholder="Add your own..."
            value={customCollab}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customCollab) {
                toggleSelection(customCollab, selectedCollabStyles, setSelectedCollabStyles);
                setCustomCollab("");
              }
            }}
            onChange={(e) => setCustomCollab(e.target.value)}
          />
          {renderSelectedChips(selectedCollabStyles, setSelectedCollabStyles)}
        </div>

        {/* Question 5: Filters */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">On-Brand Filters</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                className={`border px-3 py-1 rounded-full ${selectedFilters.includes(f) ? "bg-yellow-600 text-white" : "bg-white"}`}
                onClick={() => toggleSelection(f, selectedFilters, setSelectedFilters)}
              >{f}</button>
            ))}
          </div>
          <input
  className="w-full mt-2 border px-2 py-1 rounded"
  placeholder="Add your own..."
  value={customFilter}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = customFilter.trim();
      if (trimmed && !selectedFilters.includes(trimmed)) {
        setSelectedFilters([...selectedFilters, trimmed]);
        setCustomFilter("");
      }
    }
  }}
  onChange={(e) => setCustomFilter(e.target.value)}
/>
{renderSelectedChips(selectedFilters, setSelectedFilters)}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={async () => { await handleSave(); router.push(`/enhancer/brandbuilder/chapter4?id=${draftId}`); }}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >Back</button>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >Save</button>

            <button
              onClick={async () => { await handleSave(); router.push(`/enhancer/brandbuilder/chapter6?id=${draftId}`); }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >Next Chapter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
