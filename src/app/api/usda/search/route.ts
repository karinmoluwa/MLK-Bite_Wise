import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ error: "A food search query is required." }, { status: 400 });
  const apiKey = process.env.USDA_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "USDA_API_KEY is not configured." }, { status: 503 });
  const response = await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + encodeURIComponent(apiKey), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query, pageSize: 12 }), next: { revalidate: 3600 }
  });
  if (!response.ok) return NextResponse.json({ error: "The USDA nutrition service is temporarily unavailable." }, { status: 502 });
  return NextResponse.json(await response.json());
}
