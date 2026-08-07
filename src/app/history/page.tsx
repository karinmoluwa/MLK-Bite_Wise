export default function HistoryPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">History</span>
          <h1>Meal history</h1>
          <p>Review meals you have previously logged.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>Your logged meals</h2>
        <p>Your saved meal history will appear here.</p>
      </section>
    </div>
  );
}