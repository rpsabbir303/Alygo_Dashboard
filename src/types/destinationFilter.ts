export type DriverTierName = 'journey' | 'pro_go' | 'elite' | 'platinum' | 'diamond'

export interface TierFilterSettings {
  id: string
  tier: DriverTierName
  tierLabel: string
  numberOfFilters: number
  dailyLimit: number
  weeklyLimit: number
  expirationHours: number
  expirationRule: string
  status: 'active' | 'inactive'
}

export interface DestinationFilterOverview {
  totalActiveFilters: number
  filtersUsedToday: number
  averageAcceptanceRate: number
  averageProductivity: number
}

export interface DestinationFilterAnalytics {
  filterUsage: Array<{ label: string; value: number }>
  acceptanceRate: Array<{ label: string; value: number }>
  driverProductivity: Array<{ label: string; value: number }>
  usageByTier: Array<{ label: string; value: number }>
}
