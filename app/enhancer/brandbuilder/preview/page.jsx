// app/enhancer/brandbuilder/preview/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";

export default function BrandBookPreview() {
  const { user } = useUser();
  const router = useRouter();
  const [draftId, setDraftId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDraftId(params.get("id"));
    }
  }, []);

  useEffect(() => {
    if (!draftId) return;

    const fetchDraft = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session?.user?.id) {
        console.error("❌ No active session found.");
        return;
      }

      const { data, error } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("id", draftId)
        .eq("auth_users_id", session.user.id)
        .single();

      if (error) {
        console.error("❌ Supabase fetch error:", error);
        return;
      }

      setProfile(data);
    };

    fetchDraft();
  }, [draftId]);

  const handleExportPDF = async () => {
    if (!draftId || isExporting) return;

    setIsExporting(true);
    const exportUrl = `https://nuveuu.com/export-print?id=${draftId}`;
    const modalEndpoint = "https://mordeshook--pdf-generator-generate-pdf.modal.run/";

    console.log("📤 Sending POST to Modal:", modalEndpoint);
    console.log("📦 Payload:", { url: exportUrl });

    const formBody = new FormData();
    formBody.append("url", exportUrl);

    try {
      const response = await fetch(modalEndpoint, {
        method: "POST",
        body: formBody,
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ PDF generation failed:", errText);
        alert("PDF generation failed.");
        return;
      }

      const blob = await response.blob();
      console.log("✅ PDF blob received, size:", blob.size);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `BrandBook-${draftId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log("🎉 Download triggered successfully");
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("PDF generation failed.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!profile) return <p className="p-6 text-gray-500">Loading brand book.</p>;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`bg-black text-white px-6 py-2 rounded hover:bg-gray-800 ${
            isExporting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isExporting ? "Generating PDF..." : "Export as PDF"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-3xl font-bold text-center text-[#e5007d] mb-6">
          📘 Brand Book: {profile.brand_name}
        </h1>

        {renderSection("Mission Statement", profile.mission_statement)}
        {renderSection("Brand Soul", profile.brand_soul)}
        {renderSection("Core Values", profile.brand_core_values)}
        {renderSection("Music Styles", profile.brand_music_styles)}
        {renderSection("Sound Effects", profile.brand_sound_effects)}
        {renderSection("Party Behavior", profile.brand_party_behaviors)}
        {renderSection("Party Style", profile.brand_party_styles)}
        {renderSection("Cultural Flavors", profile.brand_cultural_flavors)}
        {renderSection("World Visions", profile.brand_world_visions)}
        {renderSection("The Echo", profile.brand_legacy_belief)}
        {renderSection("The Ripple", profile.brand_legacy_behavior)}
        {renderSection("The Legend", profile.brand_legacy_story)}
        {renderSection("The Inheritance", profile.brand_legacy_openwork)}
        {renderSection("The Letter", profile.brand_legacy_letter)}
        {renderSection("Audience Mastery - Desire", profile.Chapter6question1)}
        {renderSection("Audience Mastery - Truth", profile.Chapter6question2)}
        {renderSection("Audience Mastery - Rebellion", profile.Chapter6question3)}
        {renderSection("Audience Mastery - Transformation", profile.Chapter6question4)}
        {renderSection("Audience Mastery - Belief", profile.Chapter6question5)}
      </div>
    </div>
  );
}

function renderSection(title, text) {
  if (!text) return null;
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-[#e5007d] mb-2">{title}</h2>
      <p className="text-gray-800 whitespace-pre-line">{text}</p>
    </div>
  );
}
