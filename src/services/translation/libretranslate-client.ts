import { env } from "@/config/env";

export async function translateText(text: string, target: string, source = "auto") {
  const response = await fetch(`${env.libreTranslateUrl}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source, target, format: "text" }),
  });
  if (!response.ok) throw new Error("Translation is temporarily unavailable.");
  const data = (await response.json()) as { translatedText: string };
  return data.translatedText;
}
