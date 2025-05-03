// app/export-template/page.jsx
import { supabase } from "@/lib/supabaseAdminClient";

export const dynamic = "force-dynamic"; // required for SSR in Vercel

export default async function ExportTemplatePage({ searchParams }) {
  const draftId = searchParams?.id;
  if (!draftId) {
    return <p style={{ padding: "40px" }}>Missing draft ID.</p>;
  }

  const { data: profile, error } = await supabase
    .from("brand_profiles_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (error || !profile) {
    console.error("❌ Supabase fetch error:", error);
    return <p style={{ padding: "40px" }}>Failed to load brand book.</p>;
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "40px",
        background: "#ffffff",
        color: "#000000",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#e5007d", textAlign: "center", fontSize: "28px", marginBottom: "20px" }}>
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
      <h2
        style={{
          color: "#e5007d",
          marginTop: "30px",
          fontSize: "18px",
          marginBottom: "8px",
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0 0 20px", whiteSpace: "pre-line", lineHeight: "1.6" }}>{text}</p>
    </>
  );
}
