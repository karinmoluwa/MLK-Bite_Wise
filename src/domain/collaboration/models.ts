export type UserRole = "user" | "nutritionist";
export type AllergySeverity = "Mild" | "Moderate" | "Severe";
export type NutritionistConnectionMethod = "Invitation Code" | "Email Invitation" | "Secure Link";

export interface SharingPreferences {
  mealHistory: boolean;
  nutritionProgress: boolean;
  weightHistory: boolean;
  allergies: boolean;
  foodIntolerances: boolean;
  dietaryRequirements: boolean;
  waterIntake: boolean;
  activitySummary: boolean;
}

export interface NotificationPreferences {
  mealReminders: boolean;
  dailyNutritionSummaries: boolean;
  nutritionistNotifications: boolean;
  recommendationAlerts: boolean;
  weeklyProgressUpdates: boolean;
}
