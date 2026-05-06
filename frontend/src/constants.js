// Shared constants and utilities used across components

export const THEME_DEFAULTS = {
  '--color-bg':       '#191714',
  '--color-surface':  '#211e1a',
  '--color-text':     '#f4efe6',
  '--color-sage':     '#a8c5a0',
  '--color-peach':    '#f0c4a0',
  '--color-rose':     '#e8a0b0',
  '--color-lavender': '#c4b0e8',
  '--color-sky':      '#a0c8e8',
}

export const BIAS_LABELS = {
  overconfident:  'Overconfident',
  revenge_trade:  'Revenge Trade',
  herd_following: 'Herd Following',
  anchoring:      'Anchoring',
}

export const BIAS_COLORS = {
  overconfident:  'var(--color-rose)',
  revenge_trade:  'var(--color-peach)',
  herd_following: 'var(--color-lavender)',
  anchoring:      'var(--color-sky)',
}

export const BIASES = [
  { key: 'overconfident',  label: 'Overconfident' },
  { key: 'revenge_trade',  label: 'Revenge Trade' },
  { key: 'herd_following', label: 'Herd Following' },
  { key: 'anchoring',      label: 'Anchoring' },
]

export const EMOTIONS   = ['calm', 'confident', 'anxious', 'FOMO', 'revenge', 'neutral']
export const DIRECTIONS = ['long', 'short']
export const OUTCOMES   = ['win', 'loss', 'open']

/** Sort entries newest-first without mutating the original array */
export function sortByDateDesc(entries) {
  return [...entries].sort((a, b) => b.created_at.localeCompare(a.created_at))
}
