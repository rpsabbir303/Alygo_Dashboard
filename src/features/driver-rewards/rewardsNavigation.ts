export const REWARDS_TAB_KEYS = [
  'points-rules',
  'performance-rules',
  'penalty-rules',
  'bonus-campaigns',
  'rewards-wallet',
  'driver-rankings',
  'incentive-programs',
  'achievements',
  'rules-analytics',
  'tier-analytics',
] as const

export type RewardsTabKey = (typeof REWARDS_TAB_KEYS)[number]

export const REWARDS_TAB_LABELS: Record<RewardsTabKey, string> = {
  'points-rules': 'Points Rules Engine',
  'performance-rules': 'Performance Rules',
  'penalty-rules': 'Penalty Rules',
  'bonus-campaigns': 'Bonus Campaigns',
  'rewards-wallet': 'Rewards Wallet',
  'driver-rankings': 'Driver Rankings',
  'incentive-programs': 'Incentive Programs',
  achievements: 'Driver Achievements',
  'rules-analytics': 'Rules Analytics',
  'tier-analytics': 'Tier Analytics',
}

export const DEFAULT_REWARDS_TAB: RewardsTabKey = 'points-rules'

export function rewardsTabPath(tab: RewardsTabKey) {
  return `/drivers/rewards?tab=${tab}`
}

/** Legacy tier tabs consolidated into /drivers/tiers */
export const LEGACY_TIER_REWARDS_TABS = ['tier-management', 'tier-benefits', 'qualification-rules'] as const

export function isLegacyTierRewardsTab(tab: string | null) {
  return LEGACY_TIER_REWARDS_TABS.includes(tab as (typeof LEGACY_TIER_REWARDS_TABS)[number])
}
