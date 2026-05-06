import { useState } from 'react'
import BottomSheet from './BottomSheet.jsx'

const EMOTIONS   = ['calm', 'confident', 'anxious', 'FOMO', 'revenge', 'neutral']
const DIRECTIONS = ['long', 'short']
const OUTCOMES   = ['win', 'loss', 'open']
const BIASES     = [
  { key: 'overconfident',  label: 'Overconfident' },
  { key: 'revenge_trade',  label: 'Revenge Trade' },
  { key: 'herd_following', label: 'Herd Following' },
  { key: 'anchoring',      label: 'Anchoring' },
]

const EMPTY = {
  ticker: '',
  direction: 'long',
  emotion: 'calm',
  outcome: 'open',
  confidence: 3,
  setup: '',
  notes: '',
  biases: [],
}

const labelStyle = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--color-text-muted)',
  marginBottom: 8, display: 'block',
}

function PillGroup({ options, value, onChange, multi = false }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
      {options.map(opt => {
        const key   = typeof opt === 'string' ? opt : opt.key
        const label = typeof opt === 'string' ? opt : opt.label
        const active = multi ? value.includes(key) : value === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="pill"
            style={{
              cursor: 'pointer',
              border: `1px solid ${active ? 'var(--color-peach)' : 'var(--color-border)'}`,
              background: active ? 'rgba(240,196,160,0.15)' : 'transparent',
              color: active ? 'var(--color-peach)' : 'var(--color-text-muted)',
              transition: 'all 0.15s',
            }}
          >{label}</button>
        )
      })}
    </div>
  )
}

export default function AddEntryForm({ onClose, onSave, initial = null }) {
  const [form, setForm]   = useState(initial ? { ...EMPTY, ...initial, biases: initial.biases ?? [] } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleBias = (key) => {
    setForm(f => ({
      ...f,
      biases: f.biases.includes(key) ? f.biases.filter(b => b !== key) : [...f.biases, key],
    }))
  }

  const handleSave = async () => {
    if (!form.ticker.trim()) { setError('Ticker is required'); return }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch {
      setError('Failed to save. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <BottomSheet
      title={initial ? 'Edit Trade' : 'Log a Trade'}
      onClose={onClose}
      fullHeight
    >
      <div style={{ paddingBottom: 16 }}>

        {/* Ticker */}
        <label style={labelStyle}>Ticker</label>
        <input
          className="input"
          placeholder="e.g. TSLA"
          value={form.ticker}
          onChange={e => set('ticker', e.target.value.toUpperCase())}
          style={{ marginBottom: 18, textTransform: 'uppercase' }}
          autoFocus
        />

        {/* Direction */}
        <label style={labelStyle}>Direction</label>
        <PillGroup options={DIRECTIONS} value={form.direction} onChange={v => set('direction', v)} />

        {/* Emotion */}
        <label style={labelStyle}>Emotion at Entry</label>
        <PillGroup options={EMOTIONS} value={form.emotion} onChange={v => set('emotion', v)} />

        {/* Outcome */}
        <label style={labelStyle}>Outcome</label>
        <PillGroup options={OUTCOMES} value={form.outcome} onChange={v => set('outcome', v)} />

        {/* Confidence */}
        <label style={labelStyle}>Confidence · {form.confidence}/5</label>
        <input
          type="range" min={1} max={5} step={1}
          value={form.confidence}
          onChange={e => set('confidence', Number(e.target.value))}
          className="slider"
          style={{ marginBottom: 18 }}
        />

        {/* Biases */}
        <label style={labelStyle}>Cognitive Biases (optional)</label>
        <PillGroup options={BIASES} value={form.biases} onChange={toggleBias} multi />

        {/* Setup */}
        <label style={labelStyle}>Setup / Thesis</label>
        <textarea
          className="input"
          placeholder="What was your reason for entering?"
          value={form.setup}
          onChange={e => set('setup', e.target.value)}
          style={{ minHeight: 80, marginBottom: 18, resize: 'none' }}
        />

        {/* Notes */}
        <label style={labelStyle}>Notes / Reflection</label>
        <textarea
          className="input"
          placeholder="Post-trade thoughts, lessons learned…"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          style={{ minHeight: 80, marginBottom: 18, resize: 'none' }}
        />

        {error && (
          <p style={{ color: 'var(--color-rose)', fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving…' : initial ? 'Update Trade' : 'Log Trade'}
        </button>
      </div>
    </BottomSheet>
  )
}
