import type {
  DestinationFilterAnalytics,
  DestinationFilterOverview,
} from '@/types/destinationFilter'

/** Tier filter limits are derived from mockDriverLevels via Tier Management — no duplicate store. */

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
