import { useState } from 'react'
import BottomSheet from './BottomSheet.jsx'
import { THEME_DEFAULTS } from '../constants.js'

const FIELDS = [
  { key: '--color-bg',       label: 'Background' },
  { key: '--color-surface',  label: 'Surface / Cards' },
  { key: '--color-text',     label: 'Text' },
  { key: '--color-sage',     label: 'Accent — Sage' },
  { key: '--color-peach',    label: 'Accent — Peach' },
  { key: '--color-rose',     label: 'Accent — Rose' },
  { key: '--color-lavender', label: 'Accent — Lavender' },
  { key: '--color-sky',      label: 'Accent — Sky' },
]

export default function ThemeCustomizer({ onClose, onApply }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('clearmind-theme')
    try { return saved ? { ...THEME_DEFAULTS, ...JSON.parse(saved) } : { ...THEME_DEFAULTS } }
    catch { return { ...THEME_DEFAULTS } }
  })

  function handleChange(key, val) {
    const next = { ...theme, [key]: val }
    setTheme(next)
    onApply(next)
  }

  function save() {
    localStorage.setItem('clearmind-theme', JSON.stringify(theme))
    onApply(theme)
    onClose()
  }

  function reset() {
    setTheme({ ...THEME_DEFAULTS })
    onApply(THEME_DEFAULTS)
    localStorage.removeItem('clearmind-theme')
  }

  return (
    <BottomSheet title="Theme Customizer" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {FIELDS.map(f => (
          <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input
                type="color"
                value={theme[f.key] || THEME_DEFAULTS[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                style={{
                  width: 44, height: 44,
                  padding: 3,
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface2)',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{f.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {theme[f.key] || THEME_DEFAULTS[f.key]}
              </div>
            </div>
          </div>
        ))}

        <div className="divider" style={{ margin: '8px 0' }} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={reset}>
            Reset Defaults
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={save}>
            Save Theme
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
