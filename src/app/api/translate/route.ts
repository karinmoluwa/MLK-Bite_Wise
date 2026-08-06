import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const { text, target, source = "auto" } = await request.json();
  if (!text || !target) return NextResponse.json({ error: "Text and target language are required." }, { status: 400 });
  const endpoint = process.env.LIBRETRANSLATE_URL;
  if (!endpoint) return NextResponse.json({ error: "Translation service is not configured." }, { status: 503 });
  const response = await fetch(endpoint.replace(/\/$/, "") + "/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: text, source, target, format: "text", api_key: process.env.LIBRETRANSLATE_API_KEY || undefined }) });
  if (!response.ok) return NextResponse.json({ error: "Translation service is temporarily unavailable." }, { status: 502 });
  return NextResponse.json(await response.json());
}
