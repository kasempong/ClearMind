import { BIAS_LABELS, BIAS_COLORS } from '../constants.js'

export default function BiasTracker({ stats }) {
  if (!stats) return null
  const { bias_pct = {}, biases = {} } = stats
  const total = Object.values(biases).reduce((a, b) => a + b, 0)

  return (
    <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-text-muted)',
        marginBottom: 14,
      }}>Cognitive Bias Tracker</div>

      {total === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No biases flagged yet — great start!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(BIAS_LABELS).map(([key, label]) => {
            const pct = bias_pct[key] || 0
            const count = biases[key] || 0
            if (!count) return null
            const color = BIAS_COLORS[key]
            return (
              <div key={key}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: 13 }}>{label}</span>
                  <span style={{ fontSize: 13, color, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: 'rgba(244,239,230,0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: color,
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
