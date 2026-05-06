import BottomSheet from './BottomSheet.jsx'
import { BIAS_LABELS } from '../constants.js'

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: color || 'var(--color-text)' }}>{value}</span>
    </div>
  )
}

export default function EntryCard({ entry, onClose, onEdit, onDelete }) {
  const {
    ticker, direction, emotion, outcome, confidence,
    setup, notes, biases = [], created_at,
  } = entry

  const date = new Date(created_at).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const outcomeColor = outcome === 'win' ? 'var(--color-sage)' : outcome === 'loss' ? 'var(--color-rose)' : 'var(--color-peach)'

  return (
    <BottomSheet title={`${ticker} · ${direction}`} onClose={onClose}>
      <div style={{ paddingBottom: 8 }}>

        {/* Outcome badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            padding: '6px 20px',
            borderRadius: 20,
            background: `color-mix(in srgb, ${outcomeColor} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${outcomeColor} 35%, transparent)`,
            color: outcomeColor,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: 12,
          }}>{outcome}</div>
        </div>

        {/* Key stats */}
        <div className="card" style={{ padding: '14px 16px', marginBottom: 14 }}>
          <Row label="Emotion" value={emotion} />
          <Row label="Outcome" value={outcome} color={outcomeColor} />
          <Row
            label="Confidence"
            value={
              <span>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ color: i < confidence ? 'var(--color-peach)' : 'rgba(244,239,230,0.15)', fontSize: 16 }}>●</span>
                ))}
              </span>
            }
          />
          <div style={{ marginBottom: 0 }}>
            <Row label="Date" value={date} />
          </div>
        </div>

        {/* Setup */}
        {setup && (
          <div className="card" style={{ padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>
              Setup
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)', margin: 0 }}>{setup}</p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="card" style={{ padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>
              Notes
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)', margin: 0 }}>{notes}</p>
          </div>
        )}

        {/* Biases */}
        {biases.length > 0 && (
          <div className="card" style={{ padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10 }}>
              Biases Flagged
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {biases.map(b => (
                <span key={b} className="pill" style={{
                  background: 'rgba(220,100,100,0.12)',
                  color: 'var(--color-rose)',
                  border: '1px solid rgba(220,100,100,0.25)',
                }}>
                  {BIAS_LABELS[b] || b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {onEdit && (
            <button
              className="btn-primary"
              onClick={onEdit}
              style={{ flex: 1 }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: onEdit ? '0 0 auto' : 1,
                padding: '10px 20px',
                background: 'rgba(232,160,176,0.12)',
                border: '1px solid rgba(232,160,176,0.3)',
                color: 'var(--color-rose)',
                borderRadius: 'var(--radius-md)',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
