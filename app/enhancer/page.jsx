"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EnhancerPage() {
  const [rawText, setRawText] = useState("");
  const [output, setOutput] = useState("");
  const [toneOptions, setToneOptions] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [targetAudienceOptions, setTargetAudienceOptions] = useState([]);
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedTargetAudience, setSelectedTargetAudience] = useState("");
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
      const [toneRes, formatRes, styleRes, audienceRes] = await Promise.all([
        supabase.from("enhancer_tones").select("name"),
        supabase.from("enhancer_formats").select("name"),
        supabase.from("enhancer_styles").select("name"),
        supabase.from("enhancer_target_audience").select("name"),
      ]);
      setToneOptions(toneRes.data || []);
      setFormatOptions(formatRes.data || []);
      setStyleOptions(styleRes.data || []);
      setTargetAudienceOptions(audienceRes.data || []);
    };
    loadDropdowns();
  }, []);

  const handleEnhance = async () => {
    setIsGenerating(true);
    setOutput("");
    setCanSave(false);

    if (!rawText.trim()) {
      alert("You must paste some text before enhancing.");
      setIsGenerating(false);
      return;
    }

    try {
      const res = await fetch("/api/enhancer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawText,
          tone: selectedTone,
          format: selectedFormat,
          style: selectedStyle,
          targetAudience: selectedTargetAudience,
        }),
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const data = await res.json();
      setOutput(data.enhanced_output || data.output || data.result || "");
      setCanSave(true);
    } catch (err) {
      console.error("Enhance error:", err);
      alert("Enhance failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceSelection = async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      alert("Please highlight some text to enhance.");
      return;
    }

    try {
      const res = await fetch("/api/enhancer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectedText,
          tone: selectedTone,
          format: selectedFormat,
          style: selectedStyle,
          targetAudience: selectedTargetAudience,
        }),
      });

      if (!res.ok) throw new Error("Enhancement failed");

      const data = await res.json();
      const enhancedSelectedText = data.enhanced_output || data.output || data.result || "";

      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(enhancedSelectedText));
      }

      const editableDiv = document.getElementById("enhancedOutput");
      setOutput(editableDiv.innerText.trim());
    } catch (err) {
      console.error("Enhance selection failed:", err);
      alert("Enhance failed: " + err.message);
    }
  };

  const generateThumbnail = async () => {
    if (!output.trim()) {
      alert("You need an enhanced output before generating an image.");
      return;
    }

    setIsGeneratingImage(true);
    setThumbnailUrl(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not authenticated");

      // First ask DALL·E to create the image
      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: output.slice(0, 200) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unknown error");

      const openaiImageUrl = data.imageUrl;

      // Now send that imageUrl to our backend to upload it to our storage
      const saveRes = await fetch("/api/enhancer/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: openaiImageUrl }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData?.error || "Failed to upload thumbnail");

      setThumbnailUrl(saveData.publicUrl);

    } catch (err) {
      console.error("Thumbnail generation error:", err);
      alert(`Thumbnail failed: ${err.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    const formData = new FormData();
    formData.append("rawText", rawText);
    formData.append("output", output);
    formData.append("tone", selectedTone);
    formData.append("format", selectedFormat);
    formData.append("style", selectedStyle);
    formData.append("category", category);
    formData.append("is_public", isPublic);
    if (imageFile) formData.append("image", imageFile);
    if (thumbnailUrl) formData.append("thumbnail_url", thumbnailUrl);
    if (user) formData.append("auth_users_id", user.id);

    const res = await fetch("/api/enhancer/save", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) alert("Saved to your Enhancer Board!");
    else alert("Failed to save: " + (result.error || "Unknown error"));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Enhancer Engine</h1>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste raw content here..."
        className="w-full h-40 p-4 border border-gray-300 rounded"
      />

      <div className="grid grid-cols-4 gap-4 my-4">
        <select onChange={(e) => setSelectedTone(e.target.value)} className="p-2 border rounded">
          <option value="">Tone</option>
          {toneOptions.map((t) => <option key={t.name}>{t.name}</option>)}
        </select>
        <select onChange={(e) => setSelectedFormat(e.target.value)} className="p-2 border rounded">
          <option value="">Format</option>
          {formatOptions.map((f) => <option key={f.name}>{f.name}</option>)}
        </select>
        <select onChange={(e) => setSelectedStyle(e.target.value)} className="p-2 border rounded">
          <option value="">Style</option>
          {styleOptions.map((s) => <option key={s.name}>{s.name}</option>)}
        </select>
        <select onChange={(e) => setSelectedTargetAudience(e.target.value)} className="p-2 border rounded">
          <option value="">Target Audience</option>
          {targetAudienceOptions.map((a) => <option key={a.name}>{a.name}</option>)}
        </select>
      </div>

      <button
        onClick={handleEnhance}
        disabled={isGenerating || !rawText || !selectedTone || !selectedFormat || !selectedStyle}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isGenerating ? "Enhancing..." : "Enhance"}
      </button>

      {output && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Enhanced Result</h2>

          <div
            id="enhancedOutput"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setOutput(e.currentTarget.innerText)}
            className="w-full h-60 p-4 border border-gray-300 rounded overflow-y-auto whitespace-pre-wrap bg-white"
          >
            {output}
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
              <img src={thumbnailUrl} alt="Thumbnail" className="w-48 h-48 object-cover rounded border mb-2" />
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
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            <span>Make Public</span>
          </label>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
          >
            Save to My Enhancer Board
          </button>
        </div>
      )}
    </div>
  );
}
