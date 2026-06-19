export const CAPACITY_TAB_KEYS = ['waitlist', 'capacity-rules'] as const

export type CapacityTabKey = (typeof CAPACITY_TAB_KEYS)[number]

export const CAPACITY_TAB_LABELS: Record<CapacityTabKey, string> = {
  waitlist: 'Waitlist Management',
  'capacity-rules': 'Capacity Rules',
}

export const DEFAULT_CAPACITY_TAB: CapacityTabKey = 'waitlist'

const LEGACY_TAB_MAP: Record<string, CapacityTabKey> = {
  caps: 'capacity-rules',
  'auto-rules': 'waitlist',
}

export function resolveCapacityTab(tab: string | null): CapacityTabKey {
  if (!tab) return DEFAULT_CAPACITY_TAB
  if (CAPACITY_TAB_KEYS.includes(tab as CapacityTabKey)) return tab as CapacityTabKey
  return LEGACY_TAB_MAP[tab] ?? DEFAULT_CAPACITY_TAB
}
