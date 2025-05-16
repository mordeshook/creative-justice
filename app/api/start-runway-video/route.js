// app/api/start-runway-video/route.js

import { NextResponse } from "next/server";
import Runway from "@runwayml/sdk";

const runway = new Runway({
  apiKey: process.env.RUNWAY_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, image_url, duration = 4 } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    const inputs = {
      prompt,
      duration,
      output_format: "mp4",
    };

    if (image_url) {
      if (!image_url.startsWith("https://")) {
        return NextResponse.json({ error: "Image URL must be HTTPS" }, { status: 400 });
      }
      inputs.promptImage = [{ uri: image_url, position: "first" }];
    }

    const result = await runway.inference.create({
      model: "image-to-video",
      inputs,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Runway API error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
