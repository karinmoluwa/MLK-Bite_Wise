import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/app-shell/AppShell";
import { NutritionWorkspace } from "@/components/dashboard/NutritionWorkspace(2)";
export default function DashboardPage(){return <ProtectedPage><AppShell><NutritionWorkspace/></AppShell></ProtectedPage>}
