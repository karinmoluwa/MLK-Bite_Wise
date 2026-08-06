export function MetricCard({ label, value, detail, progress }: { label: string; value: string; detail: string; progress?: number }) {
  return (
    <article className="dashboard-card metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <span className="metric-detail">{detail}</span>
      {typeof progress === "number" && <div className="progress" aria-label={`${progress} percent complete`}><span style={{ width: `${progress}%` }} /></div>}
    </article>
  );
}
