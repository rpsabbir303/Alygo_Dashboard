import type { DriverLevel, TierBenefitsConfig } from '@/types/driverRewards'
import type { TierFilterSettings } from '@/types/destinationFilter'

const RESERVATION_ACCESS_LABELS: Record<string, string> = {
  none: 'No Access',
  standard: 'Standard Access',
  priority: 'Priority Access',
  exclusive: 'Exclusive Priority Access',
}

export function formatReservationAccess(access: TierBenefitsConfig['reservationAccess']) {
  return RESERVATION_ACCESS_LABELS[access] ?? access
}

export function syncBenefitFlags(benefits: Omit<TierBenefitsConfig, 'flags'> & { flags?: TierBenefitsConfig['flags'] }): TierBenefitsConfig {
  const flags: TierBenefitsConfig['flags'] = {
    priorityDispatch: benefits.dispatchPriorityLevel >= 2,
    priorityMatching: benefits.rideMatchingPriority >= 2,
    premiumRideAccess: benefits.preferredRideAllocation,
    airportQueuePriority: benefits.dispatchPriorityLevel >= 3,
    eventQueuePriority: benefits.dispatchPriorityLevel >= 4,
    vipRideAccess: benefits.vipSupportAccess,
    luxuryRideAccess: benefits.reservationAccess === 'exclusive',
    bonusMultiplier: benefits.bonusMultiplier,
    surgeMultiplier: benefits.peakHourMultiplier,
    dedicatedSupport: benefits.customerSupportLevel !== 'standard',
    reducedPlatformFees: benefits.dispatchPriorityLevel >= 4 ? 6 : benefits.dispatchPriorityLevel >= 2 ? 2 : 0,
    reservationPriority: benefits.reservationAccess !== 'none',
    earlyFeatureAccess: benefits.promotionEligibility,
    ...benefits.flags,
  }
  return { ...benefits, flags } as TierBenefitsConfig
}

export function driverLevelToTierFilterSettings(level: DriverLevel): TierFilterSettings {
  const tierKey = level.name === 'pro' ? 'pro_go' : level.name
  return {
    id: `df-${level.id}`,
    tier: tierKey as TierFilterSettings['tier'],
    tierLabel: level.label,
    numberOfFilters: level.benefits.destinationFilters,
    dailyLimit: level.benefits.dailyUsageLimit,
    weeklyLimit: level.benefits.weeklyUsageLimit,
    expirationHours: level.benefits.filterExpirationHours,
    expirationRule: level.benefits.filterCooldownRule,
    status: level.status,
  }
}

export function deriveTierFilterSettingsFromLevels(levels: DriverLevel[]): TierFilterSettings[] {
  return levels
    .filter((l) => l.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(driverLevelToTierFilterSettings)
}

export function deriveActiveBenefitLabels(level: DriverLevel): string[] {
  const b = level.benefits
  const labels: string[] = []
  if (b.destinationFilters > 0) labels.push(`${b.destinationFilters} Destination Filters`)
  if (b.reservationAccess !== 'none') labels.push(formatReservationAccess(b.reservationAccess))
  if (b.dispatchPriorityLevel >= 2) labels.push('Priority Dispatch')
  if (b.airportRideBonusEnabled) labels.push('Airport Ride Bonus')
  if (b.bonusMultiplier > 1) labels.push(`${b.bonusMultiplier}x Bonus Multiplier`)
  if (b.cancellationProtection) labels.push('Cancellation Protection')
  if (b.vipSupportAccess) labels.push('VIP Support')
  if (b.campaignAccess) labels.push('Campaign Access')
  return labels
}

export function deriveLockedBenefitLabels(current: DriverLevel, next?: DriverLevel): string[] {
  if (!next) return []
  const currentLabels = new Set(deriveActiveBenefitLabels(current))
  return deriveActiveBenefitLabels(next).filter((label) => !currentLabels.has(label))
}

export function applyTierFilterSettingsToLevel(
  level: DriverLevel,
  settings: Partial<TierFilterSettings>,
): DriverLevel {
  return {
    ...level,
    benefits: syncBenefitFlags({
      ...level.benefits,
      destinationFilters: settings.numberOfFilters ?? level.benefits.destinationFilters,
      dailyUsageLimit: settings.dailyLimit ?? level.benefits.dailyUsageLimit,
      weeklyUsageLimit: settings.weeklyLimit ?? level.benefits.weeklyUsageLimit,
      filterExpirationHours: settings.expirationHours ?? level.benefits.filterExpirationHours,
      filterCooldownRule: settings.expirationRule ?? level.benefits.filterCooldownRule,
    }),
  }
}
