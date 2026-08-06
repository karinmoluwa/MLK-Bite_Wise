export type Cuisine = "Nigerian Cuisine" | "International Cuisine";
export type MacroKey = "Protein" | "Carbohydrates" | "Fat";
export type MealSource = "image" | "text" | "voice" | "favourite";

export interface Nutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fibre: number;
}

export interface MealCandidate {
  id: string;
  name: string;
  confidence: number;
  serving: string;
  nutrients: Nutrients;
  estimated: boolean;
  allergens: string[];
  intolerances: string[];
}

export interface SavedMeal extends MealCandidate {
  source: MealSource;
  savedAt: string;
  pinned?: boolean;
}
