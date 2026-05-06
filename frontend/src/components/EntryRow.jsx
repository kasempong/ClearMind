const EMOTION_COLORS = {
  calm:       'var(--color-sage)',
  confident:  'var(--color-peach)',
  anxious:    'var(--color-lavender)',
  FOMO:       'var(--color-rose)',
  revenge:    'var(--color-rose)',
  neutral:    'var(--color-text-muted)',
}
const OUTCOME_COLORS = {
  win:  'var(--color-sage)',
  loss: 'var(--color-rose)',
  open: 'var(--color-peach)',
}

export default function EntryRow({ entry, onClick }) {
  const { ticker, direction, emotion, outcome, confidence, created_at } = entry
  const date = new Date(created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const emotionColor = EMOTION_COLORS[emotion] || 'var(--color-text-muted)'
  const outcomeColor = OUTCOME_COLORS[outcome] || 'var(--color-text-muted)'

  return (
    <div
      onClick={onClick}
      className="card"
      style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {/* Ticker + direction */}
      <div style={{ flex: '0 0 auto', minWidth: 64 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 300 }}>{ticker}</div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {direction}
        </div>
      </div>

      {/* Emotion pill */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <span className="pill" style={{
          background: `color-mix(in srgb, ${emotionColor} 18%, transparent)`,
          color: emotionColor,
          border: `1px solid color-mix(in srgb, ${emotionColor} 30%, transparent)`,
        }}>{emotion}</span>
      </div>

      {/* Right side: confidence + outcome + date */}
      <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: outcomeColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {outcome}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < confidence ? 'var(--color-peach)' : 'rgba(244,239,230,0.15)' }}>●</span>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>{date}</div>
      </div>
    </div>
  )
}
