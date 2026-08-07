export default function NutritionPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Nutrition</span>
          <h1>Your nutrition</h1>
          <p>Track your calories and macronutrients from your logged meals.</p>
        </div>
      </div>

      <div className="dashboard-primary-grid">
        <section className="dashboard-card">
          <span className="card-kicker">Daily nutrition</span>
          <h2>Nutrition summary</h2>
          <p>Your calorie, protein, carbohydrate and fat totals will appear here as you log meals.</p>
        </section>

        <section className="dashboard-card">
          <span className="card-kicker">Macronutrients</span>
          <h2>Daily targets</h2>
          <p>Protein, carbohydrates and fat are tracked against your daily goals.</p>
        </section>
      </div>
    </div>
  );
}