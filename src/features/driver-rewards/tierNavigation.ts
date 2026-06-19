export const TIER_TAB_KEYS = ['overview', 'configuration', 'benefits'] as const

export type TierTabKey = (typeof TIER_TAB_KEYS)[number]

export const TIER_TAB_LABELS: Record<TierTabKey, string> = {
  overview: 'Overview',
  configuration: 'Tier Configuration',
  benefits: 'Tier Benefits',
}

export const DEFAULT_TIER_TAB: TierTabKey = 'overview'

export function tierTabPath(tab: TierTabKey) {
  return `/drivers/tiers?tab=${tab}`
}
