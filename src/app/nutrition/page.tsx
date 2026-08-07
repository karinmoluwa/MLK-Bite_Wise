export default function NutritionPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Nutrition</span>
          <h1>Your nutrition</h1>
          <p>Review calories, protein, carbohydrates, fat, fibre and nutrition progress.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>Nutrition summary</h2>
        <p>Your nutrition information will update as you log meals.</p>
      </section>
    </div>
  );
}