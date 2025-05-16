//app\api\promptdirector\save\route.jsx

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();

    const rawText = formData.get("rawText");
    const output = formData.get("output");
    const engine = formData.get("engine");
    const subject_type = formData.get("subject_type");
    const style = formData.get("style");
    const mood = formData.get("mood");
    const perspective = formData.get("perspective");
    const category = formData.get("category");
    const isPublic = formData.get("is_public") === "true";
    const thumbnailUrl = formData.get("thumbnail_url");
    const imageFile = formData.get("image");
    const auth_users_id = formData.get("auth_users_id");

    if (!auth_users_id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing auth_users_id." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `promptdirector-assets/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('promptdirector-assets')
        .upload(fileName, arrayBuffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('promptdirector-assets')
        .getPublicUrl(fileName);

      imageUrl = data?.publicUrl || null;
    }

    const { error: insertError } = await supabase
      .from('promptdirector_content')
      .insert({
        auth_users_id,
        raw_input: rawText,
        generated_prompt: output,
        engine,
        subject_type,
        style,
        mood,
        perspective,
        category,
        is_public: isPublic,
        image_url: imageUrl || thumbnailUrl || null,
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error("Save API Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
