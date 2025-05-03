"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";

export default function Chapter4() {
  const { user } = useUser();
  const router = useRouter();


  const [brandName, setBrandName] = useState("");
  const [brandColors, setBrandColors] = useState([]);
  const [brandStyles, setBrandStyles] = useState([]);
  const [brandVisuals, setBrandVisuals] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRGBs, setSelectedRGBs] = useState([]);
  const [customColor, setCustomColor] = useState("#000000");
  const [customColorName, setCustomColorName] = useState("");

  const [selectedStyles, setSelectedStyles] = useState([]);
  const [customStyleName, setCustomStyleName] = useState("");
  const [customStyleDesc, setCustomStyleDesc] = useState("");
  const [customStyleDescriptions, setCustomStyleDescriptions] = useState([]);

  const [selectedVisuals, setSelectedVisuals] = useState([]);
  const [draftId, setDraftId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDraftId(params.get("id"));
    }
  }, []);

  useEffect(() => {
    if (!user?.id || !draftId) return;
  
    const fetchEverything = async () => {
      const [{ data: colors }, { data: styles }, { data: visuals }] = await Promise.all([
        supabase.from("brand_colors").select("name, rgb"),
        supabase.from("brand_styles").select("name, description"),
        supabase.from("brand_visual_styles").select("name, image_url"),
      ]);
  
      setBrandColors(colors || []);
      setBrandStyles(styles || []);
      setBrandVisuals(visuals || []);
  
      const { data } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("auth_users_id", user.id)
        .eq("id", draftId)
        .single();
  
      if (data) {
        setBrandName(data.brand_name || "");
        setSelectedColors(data.brand_color_names?.split(",") || []);
        setSelectedRGBs(data.brand_color_rgb?.split(",") || []);
        setSelectedStyles(data.brand_styles_name?.split(",") || []);
        setCustomStyleDescriptions(data.brand_styles_description?.split(",") || []);
        setSelectedVisuals(data.brand_visual_styles?.split(",") || []);
      }
    };
  
    fetchEverything();
  }, [user?.id, draftId]);

  const handleAddColor = (name, rgb) => {
    if (!selectedColors.includes(name)) {
      setSelectedColors([...selectedColors, name]);
      setSelectedRGBs([...selectedRGBs, rgb]);
    }
  };

  const handleRemoveColor = (name) => {
    const index = selectedColors.indexOf(name);
    if (index !== -1) {
      const newNames = [...selectedColors];
      const newRGBs = [...selectedRGBs];
      newNames.splice(index, 1);
      newRGBs.splice(index, 1);
      setSelectedColors(newNames);
      setSelectedRGBs(newRGBs);
    }
  };

  const handleAddCustomStyle = () => {
    if (!customStyleName) return;

    setSelectedStyles([...selectedStyles, customStyleName]);
    setCustomStyleDescriptions([...customStyleDescriptions, customStyleDesc || ""]);
    setCustomStyleName("");
    setCustomStyleDesc("");
  };

  const handleRemoveStyle = (name) => {
    const index = selectedStyles.indexOf(name);
    if (index !== -1) {
      const newNames = [...selectedStyles];
      const newDescs = [...customStyleDescriptions];
      newNames.splice(index, 1);
      newDescs.splice(index, 1);
      setSelectedStyles(newNames);
      setCustomStyleDescriptions(newDescs);
    }
  };

  const handleSave = async () => {
    if (!draftId) return;
  
    const updates = {
      brand_color_names: selectedColors.join(","),
      brand_color_rgb: selectedRGBs.join(","),
      brand_styles_name: selectedStyles.filter(s => brandStyles.some(bs => bs.name === s)).join(","),
      brand_style_custom_names: selectedStyles.filter(s => !brandStyles.some(bs => bs.name === s)).join(","),
      brand_styles_description: customStyleDescriptions.join(","),
      brand_visual_styles: selectedVisuals.join(","),
    };
  
    await supabase
      .from("brand_profiles_drafts")
      .update(updates)
      .eq("id", draftId)
      .eq("auth_users_id", user.id);
  };

  const toggleVisual = (name) => {
    if (selectedVisuals.includes(name)) {
      setSelectedVisuals(selectedVisuals.filter((v) => v !== name));
    } else if (selectedVisuals.length < 2) {
      setSelectedVisuals([...selectedVisuals, name]);
    }
  };

  const handleNext = async () => {
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter5?id=${draftId}`);
  };

  const handleBack = async () => {
    await handleSave();
    router.push(`/enhancer/brandbuilder/chapter3?id=${draftId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="text-green-600 font-semibold">Chapter 4 of 7</div>
          <div className="text-black font-bold">Brand: {brandName}</div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: "57.14%" }}></div>
        </div>

        <h1 className="text-2xl font-bold mb-4">🎨 Chapter 4: Paint Your Brand</h1>

        {/* Brand Colors */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Brand Colors</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            {brandColors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleAddColor(color.name, color.rgb)}
                className="flex items-center gap-2 border px-2 py-1 rounded"
              >
                <span
                  style={{ backgroundColor: color.rgb }}
                  className="w-4 h-4 rounded-full border"
                ></span>
                {color.name}
              </button>
            ))}
          </div>
          <div className="mb-4 flex gap-2 items-center">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom color name"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={() => {
                if (customColorName) {
                  handleAddColor(customColorName, customColor);
                  setCustomColorName("");
                }
              }}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((name, idx) => (
              <div
                key={name}
                className="flex items-center gap-2 border px-2 py-1 rounded-full"
              >
                <span
  className="w-4 h-4 rounded-full border"
  style={{
    backgroundColor: selectedRGBs[idx] || "#ccc",
    borderColor: selectedRGBs[idx] === "#000000" ? "#888" : "transparent",
  }}
></span>
                {name}
                <button
                  onClick={() => handleRemoveColor(name)}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Style Guide */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Brand Style Guide</h2>
          <select
            onChange={(e) => {
              const style = brandStyles.find((s) => s.name === e.target.value);
              if (style && !selectedStyles.includes(style.name)) {
                setSelectedStyles([...selectedStyles, style.name]);
                setCustomStyleDescriptions([...customStyleDescriptions, ""]);
              }
            }}
            className="w-full border px-2 py-2 rounded mb-2"
          >
            <option value="">Select a style</option>
            {brandStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.name}
              </option>
            ))}
          </select>
          <input
            className="w-full border px-2 py-2 rounded mb-2"
            placeholder="Custom style name"
            value={customStyleName}
            onChange={(e) => setCustomStyleName(e.target.value)}
          />
          <textarea
            className="w-full border px-2 py-2 rounded mb-2"
            placeholder="Custom style description"
            value={customStyleDesc}
            onChange={(e) => setCustomStyleDesc(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-1 rounded"
            onClick={handleAddCustomStyle}
          >
            Add Custom Style
          </button>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedStyles.map((name) => (
              <span
                key={name}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {name}
                <button
                  onClick={() => handleRemoveStyle(name)}
                  className="ml-2 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Visual Style Thumbnails */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Visual Style Thumbnails</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandVisuals.map((v) => (
              <div
                key={v.name}
                onClick={() => toggleVisual(v.name)}
                className={`cursor-pointer border rounded-lg p-2 bg-white hover:border-blue-500 ${
                  selectedVisuals.includes(v.name)
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={v.image_url}
                  alt={v.name}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-center text-sm font-semibold mt-2">{v.name}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-2 text-gray-600">
            Select up to 2. Click again to unselect.
          </p>
        </section>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
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
  );
}
