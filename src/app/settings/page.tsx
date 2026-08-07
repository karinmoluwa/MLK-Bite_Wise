export default function SettingsPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Account settings</h1>
          <p>Manage your Bite Wise preferences.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <span className="card-kicker">Preferences</span>
        <h2>Your account</h2>
        <p>Profile, nutrition goals, privacy and notification preferences will be managed here.</p>
      </section>
    </div>
  );
}