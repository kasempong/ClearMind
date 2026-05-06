import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Journal from './pages/Journal.jsx'
import BottomNav from './components/BottomNav.jsx'
import ThemeCustomizer from './components/ThemeCustomizer.jsx'
import { THEME_DEFAULTS } from './constants.js'

const API = import.meta.env.VITE_API_URL ?? ''
const API_KEY = import.meta.env.VITE_API_KEY ?? ''

function applyTheme(theme) {
  Object.entries(theme).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v)
  })
}

const saved = localStorage.getItem('clearmind-theme')
if (saved) {
  try {
    applyTheme(JSON.parse(saved))
  } catch {
    localStorage.removeItem('clearmind-theme')
  }
}

function buildHeaders() {
  return API_KEY ? { 'X-API-Key': API_KEY } : {}
}

export default function App() {
  const [page, setPage]           = useState('dashboard')
  const [showTheme, setShowTheme] = useState(false)
  const [entries, setEntries]     = useState([])
  const [stats, setStats]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  async function fetchAll() {
    try {
      const [eRes, sRes] = await Promise.all([
        fetch(`${API}/entries`, { headers: buildHeaders() }),
        fetch(`${API}/stats`, { headers: buildHeaders() }),
      ])
      if (!eRes.ok || !sRes.ok) throw new Error('Server error')
      const entriesData = await eRes.json()
      setEntries(entriesData.entries || entriesData)
      setStats(await sRes.json())
      setError(null)
    } catch {
      setError('Could not connect to the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  async function addEntry(data) {
    const res = await fetch(`${API}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildHeaders() },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Save failed')
    await fetchAll()
  }

  async function updateEntry(id, data) {
    const res = await fetch(`${API}/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...buildHeaders() },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Update failed')
    await fetchAll()
  }

  async function deleteEntry(id) {
    const res = await fetch(`${API}/entries/${id}`, { 
      method: 'DELETE',
      headers: buildHeaders(),
    })
    if (!res.ok) throw new Error('Delete failed')
    await fetchAll()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {error && (
        <div style={{
          background: 'rgba(232,160,176,0.15)',
          borderBottom: '1px solid rgba(232,160,176,0.3)',
          color: 'var(--color-rose)',
          fontSize: 13,
          padding: '10px 16px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}
      {page === 'dashboard'
        ? <Dashboard
            entries={entries} stats={stats} loading={loading}
            onAddEntry={addEntry} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry}
          />
        : <Journal
            entries={entries} loading={loading}
            onAddEntry={addEntry} onUpdateEntry={updateEntry} onDeleteEntry={deleteEntry}
          />
      }
      <BottomNav page={page} onNav={setPage} onTheme={() => setShowTheme(true)} />
      {showTheme && (
        <ThemeCustomizer
          onClose={() => setShowTheme(false)}
          onApply={applyTheme}
        />
      )}
    </div>
  )
}
