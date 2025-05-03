// app/export-print/page.jsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ExportPrintPage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get("id");
    if (!draftId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("id", draftId)
        .single();

      if (error) {
        console.error("❌ Failed to fetch brand profile", error);
        return;
      }

      setProfile(data);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setTimeout(() => window.print(), 500); // auto-trigger print
    }
  }, [profile]);

  if (!profile) return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: 28, color: "#e5007d" }}>
        📘 Brand Book: {profile.brand_name}
      </h1>
      {render("Mission Statement", profile.mission_statement)}
      {render("Brand Soul", profile.brand_soul)}
      {render("Core Values", profile.brand_core_values)}
      {render("Music Styles", profile.brand_music_styles)}
      {render("Sound Effects", profile.brand_sound_effects)}
      {render("Party Behavior", profile.brand_party_behaviors)}
      {render("Party Style", profile.brand_party_styles)}
      {render("Cultural Flavors", profile.brand_cultural_flavors)}
      {render("World Visions", profile.brand_world_visions)}
      {render("The Echo", profile.brand_legacy_belief)}
      {render("The Ripple", profile.brand_legacy_behavior)}
      {render("The Legend", profile.brand_legacy_story)}
      {render("The Inheritance", profile.brand_legacy_openwork)}
      {render("The Letter", profile.brand_legacy_letter)}
      {render("Audience Mastery – Desire", profile.Chapter6question1)}
      {render("Audience Mastery – Truth", profile.Chapter6question2)}
      {render("Audience Mastery – Rebellion", profile.Chapter6question3)}
      {render("Audience Mastery – Transformation", profile.Chapter6question4)}
      {render("Audience Mastery – Belief", profile.Chapter6question5)}
    </div>
  );
}

function render(title, text) {
  if (!text) return null;
  return (
    <>
      <h2 style={{ fontSize: 18, marginTop: 30, color: "#e5007d" }}>{title}</h2>
      <p style={{ marginBottom: 20, whiteSpace: "pre-line", lineHeight: 1.6 }}>{text}</p>
    </>
  );
}
