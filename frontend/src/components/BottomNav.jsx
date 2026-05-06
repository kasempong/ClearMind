const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'journal',   label: 'Journal',   icon: '✦' },
]

export default function BottomNav({ page, onNav, onTheme }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      flexShrink: 0,
    }}>
      {NAV.map(n => (
        <button
          key={n.id}
          aria-label={n.label}
          onClick={() => onNav(n.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '12px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: page === n.id ? 'var(--color-peach)' : 'var(--color-text-muted)',
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'color 0.15s',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontSize: 20 }}>{n.icon}</span>
          {n.label}
        </button>
      ))}

      {/* Theme palette button */}
      <button
        aria-label="Customize theme"
        onClick={onTheme}
        title="Customize theme"
        style={{
          width: 52,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '12px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-sans)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{ fontSize: 20 }}>⬡</span>
        Theme
      </button>
    </nav>
  )
}
