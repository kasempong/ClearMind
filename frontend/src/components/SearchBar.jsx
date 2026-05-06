export default function SearchBar({ value, onChange, placeholder = 'Search tickers, notes…' }) {
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--color-text-muted)', fontSize: 14, pointerEvents: 'none',
      }}>⌕</span>
      <input
        className="input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ paddingLeft: 32, marginBottom: 0 }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--color-text-muted)',
            cursor: 'pointer', fontSize: 14, padding: 4,
          }}
        >✕</button>
      )}
    </div>
  )
}
