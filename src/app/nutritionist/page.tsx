import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/app-shell/AppShell";
import { Part2Workspace } from "@/components/part2/Part2Workspace";
export default function NutritionistPage(){return <ProtectedPage><AppShell><Part2Workspace/></AppShell></ProtectedPage>}
