import { useMemo } from 'react'

function generateInsight(stats, entries) {
  if (!stats || !entries?.length) return 'Add your first trade to start seeing insights.'

  const { win_rate, fomo_count, avg_confidence, bias_pct = {}, emotion_win_rate = {} } = stats

  const insights = []

  if (win_rate >= 60) insights.push(`Strong run — ${win_rate}% win rate. Your process is working.`)
  else if (win_rate > 0 && win_rate < 40) insights.push(`Win rate at ${win_rate}%. Review recent losses for common patterns.`)

  if (fomo_count >= 2) insights.push(`${fomo_count} FOMO trades logged. Consider adding a 24h rule before entering on impulse.`)

  const topBias = Object.entries(bias_pct).sort((a, b) => b[1] - a[1])[0]
  if (topBias) insights.push(`Most frequent bias: ${topBias[0].replace('_', ' ')} (${topBias[1]}% of flagged trades).`)

  const calmWR = emotion_win_rate['calm']
  const fomoWR = emotion_win_rate['FOMO']
  if (calmWR && fomoWR && calmWR > fomoWR) {
    insights.push(`Calm trades win at ${calmWR}% vs FOMO at ${fomoWR}%. Your best edge is patience.`)
  }

  if (avg_confidence >= 4) insights.push(`Average confidence ${avg_confidence}/5. High conviction is tracking well.`)

  return insights[Math.floor(Math.random() * insights.length)] || 'Keep journaling — patterns emerge over time.'
}

export default function InsightBanner({ stats, entries }) {
  const text = useMemo(() => generateInsight(stats, entries), [stats, entries])

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(168,197,160,0.12), rgba(196,176,232,0.10))',
      border: '1px solid rgba(168,197,160,0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--color-sage)',
        marginBottom: 6,
      }}>✦ Insight</div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)' }}>{text}</p>
    </div>
  )
}
