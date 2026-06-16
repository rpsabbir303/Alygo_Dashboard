import type {
  DestinationFilterAnalytics,
  DestinationFilterOverview,
  TierFilterSettings,
} from '@/types/destinationFilter'

export let mockTierFilterSettings: TierFilterSettings[] = [
  { id: 'df-journey', tier: 'journey', tierLabel: 'Journey', numberOfFilters: 1, dailyLimit: 2, weeklyLimit: 8, expirationHours: 4, expirationRule: 'Filters expire 4 hours after activation', status: 'active' },
  { id: 'df-pro-go', tier: 'pro_go', tierLabel: 'Pro Go', numberOfFilters: 2, dailyLimit: 4, weeklyLimit: 16, expirationHours: 6, expirationRule: 'Filters expire 6 hours after activation', status: 'active' },
  { id: 'df-elite', tier: 'elite', tierLabel: 'Elite', numberOfFilters: 3, dailyLimit: 6, weeklyLimit: 24, expirationHours: 8, expirationRule: 'Filters expire 8 hours after activation', status: 'active' },
  { id: 'df-platinum', tier: 'platinum', tierLabel: 'Platinum', numberOfFilters: 4, dailyLimit: 8, weeklyLimit: 32, expirationHours: 12, expirationRule: 'Filters expire 12 hours after activation', status: 'active' },
  { id: 'df-diamond', tier: 'diamond', tierLabel: 'Diamond', numberOfFilters: 5, dailyLimit: 10, weeklyLimit: 40, expirationHours: 24, expirationRule: 'Filters expire 24 hours after activation', status: 'active' },
]

export function computeDestinationFilterOverview(): DestinationFilterOverview {
  return {
    totalActiveFilters: 2840,
    filtersUsedToday: 412,
    averageAcceptanceRate: 78.5,
    averageProductivity: 4.2,
  }
}

export const mockDestinationFilterAnalytics: DestinationFilterAnalytics = {
  filterUsage: [
    { label: 'Mon', value: 380 },
    { label: 'Tue', value: 420 },
    { label: 'Wed', value: 395 },
    { label: 'Thu', value: 440 },
    { label: 'Fri', value: 510 },
    { label: 'Sat', value: 580 },
    { label: 'Sun', value: 490 },
  ],
  acceptanceRate: [
    { label: 'Journey', value: 62 },
    { label: 'Pro Go', value: 71 },
    { label: 'Elite', value: 78 },
    { label: 'Platinum', value: 84 },
    { label: 'Diamond', value: 91 },
  ],
  driverProductivity: [
    { label: 'Journey', value: 3.2 },
    { label: 'Pro Go', value: 3.8 },
    { label: 'Elite', value: 4.2 },
    { label: 'Platinum', value: 4.6 },
    { label: 'Diamond', value: 5.1 },
  ],
  usageByTier: [
    { label: 'Journey', value: 820 },
    { label: 'Pro Go', value: 640 },
    { label: 'Elite', value: 520 },
    { label: 'Platinum', value: 380 },
    { label: 'Diamond', value: 220 },
  ],
}
