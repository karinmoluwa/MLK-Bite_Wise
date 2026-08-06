import type { SharingPreferences, UserRole } from "@/domain/collaboration/models";

export function canAccessSharedField(role: UserRole, field: keyof SharingPreferences, preferences: SharingPreferences): boolean {
  return role === "user" || preferences[field] === true;
}

export function requireExplicitConnectionApproval(approved: boolean): void {
  if (!approved) throw new Error("The user must explicitly approve this nutritionist connection.");
}
