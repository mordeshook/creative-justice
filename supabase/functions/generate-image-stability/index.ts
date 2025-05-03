import { serve } from "https://deno.land/x/std/http/server.ts";

// Function to generate an image via Stability AI API
serve(async (req) => {
  // Define allowed origin for CORS
  const allowedOrigin = "https://nuveuu.com";

  const headers = new Headers();
  const origin = req.headers.get("Origin");

  // Check if the request is coming from the allowed origin
  if (origin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Handle OPTIONS preflight request
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
  }

  // If the method is not OPTIONS, continue processing the request
  const body = await req.json();
  const { prompt, output_format = "png" } = body;

  // Stability AI API URL and API Key (make sure you replace with your actual API key)
  const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
  const endpoint = "https://api.stability.ai/v2beta/stable-image/generate/ultra";

  // Prepare the request body for Stability AI
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("output_format", output_format);

  // Make the API call to Stability AI
  const stabilityResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STABILITY_API_KEY}`,
      "Accept": "image/*", // Or "application/json" for base64
    },
    body: formData,
  });

  // Check if the response is OK
  if (!stabilityResponse.ok) {
    const error = await stabilityResponse.json();
    return new Response(JSON.stringify({ error: error.message || "No image returned" }), { status: 500, headers });
  }

  // If the request is successful, return the image URL (or base64 data if JSON)
  const imageBlob = await stabilityResponse.blob();
  const imageUrl = await blobToBase64(imageBlob);  // Optional: Base64 encoding for image
  return new Response(JSON.stringify({ imageUrl }), { status: 200, headers });
});

// Helper function to convert Blob to base64 (optional)
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
