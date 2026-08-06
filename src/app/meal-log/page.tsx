import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/app-shell/AppShell";
import { NutritionWorkspace } from "@/components/dashboard/NutritionWorkspace";
export default function MealLogPage(){return <ProtectedPage><AppShell><NutritionWorkspace/></AppShell></ProtectedPage>}
