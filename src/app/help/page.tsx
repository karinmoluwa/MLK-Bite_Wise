export default function HelpPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Help & support</span>
          <h1>How can we help?</h1>
          <p>Find help with meal logging, nutrition tracking and your account.</p>
        </div>
      </div>

      <div className="dashboard-primary-grid">
        <section className="dashboard-card">
          <h2>Logging meals</h2>
          <p>Use Log meal to search for a food, select the closest match, adjust the portion and confirm it.</p>
        </section>

        <section className="dashboard-card">
          <h2>Nutrition estimates</h2>
          <p>Bite Wise nutrition values are estimates and may vary depending on ingredients and preparation.</p>
        </section>
      </div>
    </div>
  );
}