// app/api/export-brandbook/route.js

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get("id");

  if (!draftId) {
    return NextResponse.json({ error: "Missing draft ID" }, { status: 400 });
  }

  const exportUrl = `https://nuveuu.com/export-template?id=${draftId}`;
  const modalEndpoint = "https://mordeshook--pdf-generator-generate-pdf.modal.run/generate_pdf";

  try {
    const formBody = new URLSearchParams({ url: exportUrl });

    const response = await fetch(modalEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "Modal PDF generation failed", detail: errText },
        { status: 500 }
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=BrandBook-${draftId}.pdf`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unhandled server error", message: err.message },
      { status: 500 }
    );
  }
}
