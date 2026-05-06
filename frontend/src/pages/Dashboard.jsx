import { useState } from 'react'
import KPICard from '../components/KPICard.jsx'
import InsightBanner from '../components/InsightBanner.jsx'
import BiasTracker from '../components/BiasTracker.jsx'
import ConfidenceSparkline from '../components/ConfidenceSparkline.jsx'
import EntryRow from '../components/EntryRow.jsx'
import EntryCard from '../components/EntryCard.jsx'
import AddEntryForm from '../components/AddEntryForm.jsx'
import { sortByDateDesc } from '../constants.js'

export default function Dashboard({ stats, entries, loading, onAddEntry, onUpdateEntry, onDeleteEntry }) {
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)

  const recent = sortByDateDesc(entries).slice(0, 5)

  const hasData = entries.length > 0

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading…
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>

      {/* Header */}
      <div style={{ padding: '20px 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            ClearMind
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300, marginTop: 2 }}>
            Dashboard
          </h1>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowAdd(true)}
          style={{ fontSize: 12, padding: '8px 16px' }}
        >
          + Log Trade
        </button>
      </div>

      {/* Insight */}
      <InsightBanner stats={stats} entries={entries} />

      {/* KPI row */}
      {hasData && stats && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <KPICard
            label="Win Rate"
            value={`${stats.win_rate ?? 0}%`}
            sub={`${stats.outcomes?.win ?? 0}W / ${stats.outcomes?.loss ?? 0}L`}
            accent="--color-sage"
          />
          <KPICard
            label="Avg Confidence"
            value={`${stats.avg_confidence ?? 0}`}
            sub="out of 5"
            accent="--color-peach"
          />
          <KPICard
            label="FOMO Trades"
            value={stats.fomo_count ?? 0}
            sub="total"
            accent="--color-rose"
          />
        </div>
      )}

      {/* Confidence sparkline */}
      {entries.length >= 3 && <ConfidenceSparkline entries={entries} />}

      {/* Bias tracker */}
      {hasData && <BiasTracker stats={stats} />}

      {/* Emotion win rates */}
      {hasData && stats?.emotion_win_rate && Object.keys(stats.emotion_win_rate).length > 0 && (
        <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-text-muted)',
            marginBottom: 14,
          }}>Win Rate by Emotion</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(stats.emotion_win_rate)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, wr]) => (
                <div key={emotion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{emotion}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 80, height: 4, borderRadius: 2,
                      background: 'rgba(244,239,230,0.08)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${wr}%`,
                        background: wr >= 50 ? 'var(--color-sage)' : 'var(--color-rose)',
                        borderRadius: 2,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 600,
                      color: wr >= 50 ? 'var(--color-sage)' : 'var(--color-rose)',
                      minWidth: 36, textAlign: 'right',
                    }}>{wr}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent trades */}
      {recent.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-text-muted)',
            marginBottom: 10, paddingLeft: 2,
          }}>Recent Trades</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(e => (
              <EntryRow key={e.id} entry={e} onClick={() => setSelected(e)} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasData && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            No trades logged yet.<br />Tap <strong style={{ color: 'var(--color-peach)' }}>+ Log Trade</strong> to start tracking your psychology.
          </p>
        </div>
      )}

      {/* Entry detail sheet */}
      {selected && (
        <EntryCard
          entry={selected}
          onClose={() => setSelected(null)}
          onDelete={async () => {
            await onDeleteEntry(selected.id)
            setSelected(null)
          }}
        />
      )}

      {/* Add entry form */}
      {showAdd && (
        <AddEntryForm
          onClose={() => setShowAdd(false)}
          onSave={onAddEntry}
        />
      )}
    </div>
  )
}
