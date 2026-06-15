import type { DriverLevel, PointsRule } from '@/types/driverRewards'

export const DEFAULT_TIER_COLORS: Record<string, string> = {
  journey: '#64748b',
  pro_go: '#6366f1',
  elite: '#22d3ee',
  platinum: '#a855f7',
  diamond: '#f59e0b',
}

export const DEFAULT_TIER_BADGES: Record<string, string> = {
  journey: 'J',
  pro_go: 'PG',
  elite: 'E',
  platinum: 'PL',
  diamond: 'D',
}

export function createDefaultLevel(
  id: string,
  name: string,
  label: string,
  description: string,
  requiredPoints: number,
  requiredRating: number,
  requiredTrips: number,
  requiredOnlineHours: number,
  requiredAcceptanceRate: number,
  requiredCompletionRate: number,
  benefitsCount: number,
): DriverLevel {
  return {
    id,
    name,
    label,
    description,
    requiredPoints,
    requiredRating,
    requiredTrips,
    requiredOnlineHours,
    requiredAcceptanceRate,
    requiredCompletionRate,
    tierColor: DEFAULT_TIER_COLORS[name] ?? '#6366f1',
    tierBadge: DEFAULT_TIER_BADGES[name] ?? label.slice(0, 2).toUpperCase(),
    benefitsCount,
    status: 'active',
  }
}

export function createPointsRule(
  id: string,
  ruleName: string,
  actionType: string,
  points: number,
): PointsRule {
  const type = points > 0 ? 'earn' : points < 0 ? 'deduct' : 'neutral'
  return {
    id,
    ruleName,
    action: ruleName,
    actionType,
    points,
    type,
    status: 'active',
  }
}
