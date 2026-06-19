export const REWARDS_TAB_KEYS = [
  'overview',
  'reward-rules',
  'performance-rewards',
  'bonus-programs',
  'penalty-rules',
] as const

export type RewardsTabKey = (typeof REWARDS_TAB_KEYS)[number]

export const REWARDS_TAB_LABELS: Record<RewardsTabKey, string> = {
  overview: 'Overview',
  'reward-rules': 'Reward Rules',
  'performance-rewards': 'Performance Rewards',
  'bonus-programs': 'Bonus Programs',
  'penalty-rules': 'Penalty Rules',
}

export const DEFAULT_REWARDS_TAB: RewardsTabKey = 'overview'

export function rewardsTabPath(tab: RewardsTabKey) {
  return `/driver-rewards?tab=${tab}`
}

const LEGACY_TAB_MAP: Record<string, RewardsTabKey> = {
  'points-rules': 'reward-rules',
  'performance-rules': 'performance-rewards',
  'bonus-campaigns': 'bonus-programs',
  'penalty-rules': 'penalty-rules',
  overview: 'overview',
}

export function resolveRewardsTab(tab: string | null): RewardsTabKey {
  if (!tab) return DEFAULT_REWARDS_TAB
  if (REWARDS_TAB_KEYS.includes(tab as RewardsTabKey)) return tab as RewardsTabKey
  return LEGACY_TAB_MAP[tab] ?? DEFAULT_REWARDS_TAB
}

/** Legacy tier tabs consolidated into /drivers/tiers */
export const LEGACY_TIER_REWARDS_TABS = ['tier-management', 'tier-benefits', 'qualification-rules'] as const

export function isLegacyTierRewardsTab(tab: string | null) {
  return LEGACY_TIER_REWARDS_TABS.includes(tab as (typeof LEGACY_TIER_REWARDS_TABS)[number])
}
