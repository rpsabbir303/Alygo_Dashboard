export const SAFETY_TAB_KEYS = ['cases', 'categories', 'settings'] as const

export type SafetyTabKey = (typeof SAFETY_TAB_KEYS)[number]

export const SAFETY_TAB_LABELS: Record<SafetyTabKey, string> = {
  cases: 'Cases',
  categories: 'Categories',
  settings: 'Settings',
}

export const DEFAULT_SAFETY_TAB: SafetyTabKey = 'cases'

export function resolveSafetyTab(tab: string | null): SafetyTabKey {
  if (!tab) return DEFAULT_SAFETY_TAB
  if (SAFETY_TAB_KEYS.includes(tab as SafetyTabKey)) return tab as SafetyTabKey
  if (tab === 'incidents') return 'cases'
  return DEFAULT_SAFETY_TAB
}
