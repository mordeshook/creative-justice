// /app/api/enhancer/save/route.js

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
    const tone = formData.get("tone");
    const format = formData.get("format");
    const style = formData.get("style");
    const category = formData.get("category");
    const isPublic = formData.get("is_public") === "true";
    const generateImage = formData.get("generate_image") === "true";
    const thumbnailUrl = formData.get("thumbnail_url");
    const imageFile = formData.get("image");
    const auth_users_id = formData.get("auth_users_id"); // ✅ correct spelling

    if (!auth_users_id) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing auth_users_id." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let imageUrl = null;

    // 🔥 Correct file upload logic
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`; // 🔥 no folder prefix

      const { error: uploadError } = await supabase.storage
        .from('enhancer-assets')
        .upload(fileName, arrayBuffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('enhancer-assets')
        .getPublicUrl(fileName);

      imageUrl = data?.publicUrl || null;
    }

    const { error: insertError } = await supabase
      .from('enhanced_content')
      .insert({
        auth_users_id, // ✅ correct field
        raw_input: rawText,
        enhanced_output: output,
        tone,
        format,
        style,
        enhancer_category: category,
        is_public: isPublic,
        generate_image: generateImage,
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
