import { useId } from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { sortByDateDesc } from '../constants.js'

export default function ConfidenceSparkline({ entries }) {
  const gradId = useId()

  const data = sortByDateDesc(entries)
    .reverse()
    .slice(-20)
    .map(e => ({ name: e.ticker, confidence: e.confidence }))

  return (
    <div className="card" style={{ padding: '16px', marginBottom: 12 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-text-muted)',
        marginBottom: 12,
      }}>Confidence Over Time</div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-peach)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-peach)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(244,239,230,0.08)',
              borderRadius: 8, fontSize: 12, color: 'var(--color-text)',
            }}
            formatter={v => [`${v}/5`, 'Confidence']}
          />
          <Area
            type="monotone" dataKey="confidence"
            stroke="var(--color-peach)" strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
