import { useState, useMemo } from 'react'
import SearchBar from '../components/SearchBar.jsx'
import EntryRow from '../components/EntryRow.jsx'
import EntryCard from '../components/EntryCard.jsx'
import AddEntryForm from '../components/AddEntryForm.jsx'
import { sortByDateDesc } from '../constants.js'

const FILTERS         = ['all', 'win', 'loss', 'open']
const EMOTION_FILTERS = ['all', 'calm', 'confident', 'anxious', 'FOMO', 'revenge', 'neutral']

function PillFilter({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="pill"
          style={{
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            border: `1px solid ${value === opt ? 'var(--color-peach)' : 'var(--color-border)'}`,
            background: value === opt ? 'rgba(240,196,160,0.15)' : 'transparent',
            color: value === opt ? 'var(--color-peach)' : 'var(--color-text-muted)',
            transition: 'all 0.15s',
            textTransform: 'capitalize',
          }}
        >{opt}</button>
      ))}
    </div>
  )
}

export default function Journal({ entries, loading, onAddEntry, onUpdateEntry, onDeleteEntry }) {
  const [search, setSearch]         = useState('')
  const [outcomeFilter, setOutcome] = useState('all')
  const [emotionFilter, setEmotion] = useState('all')
  const [selected, setSelected]     = useState(null)
  const [showAdd, setShowAdd]       = useState(false)
  const [editing, setEditing]       = useState(null)

  const filtered = useMemo(() => {
    return sortByDateDesc(entries)
      .filter(e => {
        if (outcomeFilter !== 'all' && e.outcome !== outcomeFilter) return false
        if (emotionFilter !== 'all' && e.emotion !== emotionFilter) return false
        if (search) {
          const q = search.toLowerCase()
          return (
            e.ticker.toLowerCase().includes(q) ||
            (e.setup  || '').toLowerCase().includes(q) ||
            (e.notes  || '').toLowerCase().includes(q) ||
            e.emotion.toLowerCase().includes(q)
          )
        }
        return true
      })
  }, [entries, search, outcomeFilter, emotionFilter])

  const handleEdit = () => {
    setEditing(selected)
    setSelected(null)
  }

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
            Journal
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

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Outcome filter */}
      <PillFilter options={FILTERS} value={outcomeFilter} onChange={setOutcome} />

      {/* Emotion filter */}
      <PillFilter options={EMOTION_FILTERS} value={emotionFilter} onChange={setEmotion} />

      {/* Count */}
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>
        {filtered.length} {filtered.length === 1 ? 'trade' : 'trades'}
        {(search || outcomeFilter !== 'all' || emotionFilter !== 'all') ? ' matching filters' : ' total'}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(e => (
            <EntryRow key={e.id} entry={e} onClick={() => setSelected(e)} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            {entries.length === 0
              ? 'No trades yet. Tap + Log Trade to begin.'
              : 'No trades match your filters.'}
          </p>
        </div>
      )}

      {/* Entry detail sheet */}
      {selected && (
        <EntryCard
          entry={selected}
          onClose={() => setSelected(null)}
          onEdit={handleEdit}
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

      {/* Edit entry form */}
      {editing && (
        <AddEntryForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async (form) => {
            await onUpdateEntry(editing.id, form)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
