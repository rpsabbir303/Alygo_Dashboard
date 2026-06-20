export const TIER_TAB_KEYS = ['overview', 'configuration'] as const

export type TierTabKey = (typeof TIER_TAB_KEYS)[number]

export const TIER_TAB_LABELS: Record<TierTabKey, string> = {
  overview: 'Overview',
  configuration: 'Tier Configuration',
}

export const DEFAULT_TIER_TAB: TierTabKey = 'overview'

export function resolveTierTab(tab: string | null): TierTabKey {
  if (!tab) return DEFAULT_TIER_TAB
  if (TIER_TAB_KEYS.includes(tab as TierTabKey)) return tab as TierTabKey
  if (tab === 'benefits') return 'configuration'
  return DEFAULT_TIER_TAB
}

export function tierTabPath(tab: TierTabKey) {
  return `/drivers/tiers?tab=${tab}`
}
