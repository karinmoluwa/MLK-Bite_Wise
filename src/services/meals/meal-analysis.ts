import type { Cuisine, MealCandidate } from "@/domain/nutrition/models";

const nigerian: MealCandidate[] = [
  { id: "jollof-chicken", name: "Jollof Rice with Grilled Chicken", confidence: 94, serving: "1 plate (420 g)", nutrients: { calories: 680, protein: 38, carbohydrates: 82, fat: 21, fibre: 6 }, estimated: true, allergens: [], intolerances: [] },
  { id: "rice-stew", name: "Rice with Tomato Stew and Chicken", confidence: 81, serving: "1 plate (400 g)", nutrients: { calories: 640, protein: 35, carbohydrates: 78, fat: 20, fibre: 5 }, estimated: true, allergens: [], intolerances: [] },
  { id: "fried-rice", name: "Nigerian Fried Rice with Chicken", confidence: 72, serving: "1 plate (410 g)", nutrients: { calories: 710, protein: 34, carbohydrates: 85, fat: 25, fibre: 7 }, estimated: true, allergens: ["Soy"], intolerances: [] },
];

const international: MealCandidate[] = [
  { id: "chicken-bowl", name: "Grilled Chicken Grain Bowl", confidence: 92, serving: "1 bowl (390 g)", nutrients: { calories: 590, protein: 43, carbohydrates: 62, fat: 18, fibre: 9 }, estimated: false, allergens: [], intolerances: [] },
  { id: "chicken-salad", name: "Chicken and Avocado Salad", confidence: 84, serving: "1 bowl (340 g)", nutrients: { calories: 510, protein: 39, carbohydrates: 24, fat: 29, fibre: 10 }, estimated: false, allergens: [], intolerances: [] },
  { id: "pasta-chicken", name: "Chicken Vegetable Pasta", confidence: 73, serving: "1 plate (400 g)", nutrients: { calories: 650, protein: 36, carbohydrates: 79, fat: 20, fibre: 8 }, estimated: false, allergens: ["Wheat"], intolerances: ["Gluten"] },
];

export function analyseMeal(cuisine: Cuisine): MealCandidate[] {
  return cuisine === "Nigerian Cuisine" ? nigerian : international;
}

export const commonMeals = [
  ...nigerian,
  { id: "moi-moi", name: "Moi-moi with Pap", confidence: 100, serving: "1 portion", nutrients: { calories: 430, protein: 20, carbohydrates: 58, fat: 13, fibre: 9 }, estimated: true, allergens: [], intolerances: [] },
  { id: "egusi", name: "Egusi Soup with Pounded Yam", confidence: 100, serving: "1 plate", nutrients: { calories: 780, protein: 31, carbohydrates: 75, fat: 39, fibre: 8 }, estimated: true, allergens: [], intolerances: [] },
  ...international,
];
