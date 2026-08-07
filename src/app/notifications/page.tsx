export default function NotificationsPage() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Notifications</span>
          <h1>Notifications</h1>
          <p>View meal reminders, updates and nutrition alerts.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h2>Recent notifications</h2>
        <p>You have no new notifications.</p>
      </section>
    </div>
  );
}