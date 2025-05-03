// app/api/export-brandbook/route.js

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get("id");

  if (!draftId) {
    return NextResponse.json({ error: "Missing draft ID" }, { status: 400 });
  }

  const url = `https://nuveuu.com/export-template?id=${draftId}`;

  const response = await fetch("https://mordeshook--pdf-generator.modal.run/generate_pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Modal PDF generation failed" }, { status: 500 });
  }

  const pdfBuffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=BrandBook.pdf",
    },
  });
}
