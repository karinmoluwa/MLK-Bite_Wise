import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/app-shell/AppShell";
import { Part2Workspace } from "@/components/part2/Part2Workspace";
export default function SettingsPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Settings</h1>
          <p>Manage your Bite Wise preferences and account settings.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>Account preferences</h2>
        <p>Your profile, privacy and notification settings will appear here.</p>
      </section>
    </div>
  );
}