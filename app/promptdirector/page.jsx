"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PromptDirectorPage() {
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [engineOptions, setEngineOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [moodOptions, setMoodOptions] = useState([]);
  const [perspectiveOptions, setPerspectiveOptions] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedPerspective, setSelectedPerspective] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    const loadDropdowns = async () => {
      const [engineRes, subjectRes, styleRes, moodRes, perspectiveRes] = await Promise.all([
        supabase.from("promptdirector_engines").select("name"),
        supabase.from("promptdirector_subject_types").select("name"),
        supabase.from("promptdirector_styles").select("name"),
        supabase.from("promptdirector_moods").select("name"),
        supabase.from("promptdirector_perspectives").select("name"),
      ]);
      setEngineOptions(engineRes.data || []);
      setSubjectOptions(subjectRes.data || []);
      setStyleOptions(styleRes.data || []);
      setMoodOptions(moodRes.data || []);
      setPerspectiveOptions(perspectiveRes.data || []);
    };
    loadDropdowns();
  }, []);

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    setGeneratedPrompt("");
    setCanSave(false);

    if (!description.trim()) {
      alert("You must provide a description before generating.");
      setIsGenerating(false);
      return;
    }

    try {
      const res = await fetch("/api/promptdirector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          engine: selectedEngine,
          subject_type: selectedSubject,
          style: selectedStyle,
          mood: selectedMood,
          perspective: selectedPerspective,
        }),
      });

      if (!res.ok) throw new Error("Prompt generation failed");

      const data = await res.json();
      setGeneratedPrompt(data.generated_prompt);
      setCanSave(true);
    } catch (err) {
      console.error("Prompt generation error:", err);
      alert("Prompt generation failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateThumbnail = async () => {
    if (!generatedPrompt.trim()) {
      alert("Generate a prompt first.");
      return;
    }

    setIsGeneratingImage(true);
    setThumbnailUrl(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: generatedPrompt.slice(0, 200) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unknown image error");

      const openaiImageUrl = data.imageUrl;

      const saveRes = await fetch("/api/promptdirector/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: openaiImageUrl }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "Failed to upload thumbnail");

      setThumbnailUrl(saveData.publicUrl);

    } catch (err) {
      console.error("Thumbnail error:", err);
      alert(`Thumbnail generation failed: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };
const handleEnhanceSelection = async () => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (!selectedText) {
    alert("Please highlight some text to enhance.");
    return;
  }

  try {
    const res = await fetch("/api/promptdirector", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: selectedText,
        engine: selectedEngine,
        subject_type: selectedSubject,
        style: selectedStyle,
        mood: selectedMood,
        perspective: selectedPerspective,
      }),
    });

    if (!res.ok) throw new Error("Enhancement failed");

    const data = await res.json();
    const enhancedSelectedText = data.generated_prompt;

    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(enhancedSelectedText));
    }

    const editableDiv = document.getElementById("generatedPromptEditable");
    setGeneratedPrompt(editableDiv.innerText.trim());

  } catch (err) {
    console.error("Enhance selection failed:", err);
    alert("Enhancement failed: " + err.message);
  }
};

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const formData = new FormData();
    formData.append("rawText", description);
    formData.append("output", generatedPrompt);
    formData.append("engine", selectedEngine);
    formData.append("subject_type", selectedSubject);
    formData.append("style", selectedStyle);
    formData.append("mood", selectedMood);
    formData.append("perspective", selectedPerspective);
    formData.append("category", category);
    formData.append("is_public", isPublic);
    if (imageFile) formData.append("image", imageFile);
    if (thumbnailUrl) formData.append("thumbnail_url", thumbnailUrl);
    if (user) formData.append("auth_users_id", user.id);

    const res = await fetch("/api/promptdirector/save", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) alert("Prompt saved successfully!");
    else alert("Failed to save prompt: " + (result.error || "Unknown error"));
  };

 return (
  <div className="p-8 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">Creative Prompt Director</h1>

    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Describe your idea..."
      className="w-full h-40 p-4 border rounded"
    />

    <div className="grid grid-cols-5 gap-2 my-4">
      <select onChange={(e) => setSelectedEngine(e.target.value)} className="p-2 border rounded">
        <option value="">Engine</option>
        {engineOptions.map((t) => <option key={t.name}>{t.name}</option>)}
      </select>
      <select onChange={(e) => setSelectedSubject(e.target.value)} className="p-2 border rounded">
        <option value="">Subject</option>
        {subjectOptions.map((f) => <option key={f.name}>{f.name}</option>)}
      </select>
      <select onChange={(e) => setSelectedStyle(e.target.value)} className="p-2 border rounded">
        <option value="">Style</option>
        {styleOptions.map((s) => <option key={s.name}>{s.name}</option>)}
      </select>
      <select onChange={(e) => setSelectedMood(e.target.value)} className="p-2 border rounded">
        <option value="">Mood</option>
        {moodOptions.map((a) => <option key={a.name}>{a.name}</option>)}
      </select>
      <select onChange={(e) => setSelectedPerspective(e.target.value)} className="p-2 border rounded">
        <option value="">Perspective</option>
        {perspectiveOptions.map((a) => <option key={a.name}>{a.name}</option>)}
      </select>
    </div>

    <button
      onClick={handleGeneratePrompt}
      disabled={
        isGenerating ||
        !description ||
        !selectedEngine ||
        !selectedSubject ||
        !selectedStyle ||
        !selectedMood ||
        !selectedPerspective
      }
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {isGenerating ? "Generating..." : "Generate Prompt"}
    </button>

    {generatedPrompt && (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Generated Prompt</h2>

        <div
          id="generatedPromptEditable"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setGeneratedPrompt(e.currentTarget.innerText)}
          className="w-full h-60 p-4 border rounded overflow-y-auto whitespace-pre-wrap bg-white"
        >
          {generatedPrompt}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleEnhanceSelection}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Enhance Selected Text
          </button>

          <button
            onClick={generateThumbnail}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {isGeneratingImage ? "Generating Image..." : "Generate Image"}
          </button>

          <button
            onClick={handleUploadImage}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Upload Image
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => setImageFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {thumbnailUrl && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Generated Thumbnail:</h3>
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-48 h-48 object-cover rounded border mb-2"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Enter category label"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full my-2 p-2 border rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span>Make Public</span>
        </label>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
        >
          Save Prompt
        </button>
      </div>
    )}
  </div>
);
}
