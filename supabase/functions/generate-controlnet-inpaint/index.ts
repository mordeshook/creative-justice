import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const allowedOrigin = "https://nuveuu.com"; // ✅ Your frontend domain

serve(async (req) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const {
      prompt,
      imageUrl,
      maskUrl,
      controlImageUrl,
      controlnetModel,
      controlnetType,
      controlnetConditioningScale = 1.0,
      width = 1024,
      height = 1024,
      steps = 60,
      strength = 0.75,
      guidanceScale = 8,
      seed = null,
      negativePrompt,
    } = await req.json();

    const payload: Record<string, unknown> = {
      init_image: imageUrl,
      prompt,
      strength,
      steps,
      width,
      height,
      cfg_scale: guidanceScale,
      samples: 1,
    };

    if (maskUrl) payload.mask_image = maskUrl;
    if (negativePrompt) payload.negative_prompt = negativePrompt;
    if (seed !== null) payload.seed = seed;

    if (controlImageUrl && controlnetModel && controlnetType) {
      payload.control_image = controlImageUrl;
      payload.controlnet_model = controlnetModel;
      payload.controlnet_type = controlnetType;
      payload.controlnet_conditioning_scale = controlnetConditioningScale;
    }

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/image-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('STABILITY_API_KEY')}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: result.error || "Unknown error" }),
        { status: response.status, headers }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl: result.artifacts?.[0]?.url ?? null }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error('❌ Internal Error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers }
    );
  }
});
