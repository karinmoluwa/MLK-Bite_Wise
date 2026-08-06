import { env } from "@/config/env";

export type FoodSearchResult = {
  fdcId: number;
  description: string;
  dataType?: string;
};

export async function searchFoods(query: string): Promise<FoodSearchResult[]> {
  const response = await fetch("https://api.nal.usda.gov/fdc/v1/foods/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, api_key: env.usdaApiKey, pageSize: 10 }),
  });
  if (!response.ok) throw new Error("Nutrition data is temporarily unavailable.");
  const data = (await response.json()) as { foods?: FoodSearchResult[] };
  return data.foods ?? [];
}
