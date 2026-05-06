export default function KPICard({ label, value, sub, accent = '--color-peach' }) {
  return (
    <div className="card" style={{ padding: '16px', flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-text-muted)',
        marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 30,
        fontWeight: 300,
        color: `var(${accent})`,
        lineHeight: 1,
        marginBottom: 4,
      }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{sub}</div>}
    </div>
  )
}
