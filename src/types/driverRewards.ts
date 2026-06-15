export type DriverRewardsEntityStatus = 'active' | 'inactive'

export type DriverLevelName = 'journey' | 'pro_go' | 'elite' | 'platinum' | 'diamond' | string

export type PointsRuleType = 'earn' | 'deduct' | 'neutral'

export type PromotionType =
  | 'weekend_bonus'
  | 'airport_bonus'
  | 'event_bonus'
  | 'peak_hour_bonus'
  | 'diamond_bonus'
  | 'black_driver_bonus'
  | 'black_suv_bonus'
  | 'referral_bonus'
  | 'diamond_driver_bonus'

export type PromotionStatus = 'active' | 'paused' | 'scheduled' | 'ended'

export type DriverPerformanceStatus = 'active' | 'at_risk' | 'inactive' | 'suspended'

export type NotificationCategory =
  | 'level_up'
  | 'points_earned'
  | 'bonus_unlocked'
  | 'achievement_earned'
  | 'promotion_activated'

export interface DriverLevel {
  id: string
  name: DriverLevelName
  label: string
  description: string
  requiredPoints: number
  requiredRating: number
  requiredTrips: number
  requiredOnlineHours: number
  requiredAcceptanceRate: number
  requiredCompletionRate: number
  tierColor: string
  tierBadge: string
  benefitsCount: number
  status: DriverRewardsEntityStatus
}

export interface PointsRule {
  id: string
  ruleName: string
  action: string
  actionType: string
  points: number
  type: PointsRuleType
  status: DriverRewardsEntityStatus
}

export interface LevelBenefit {
  id: string
  level: DriverLevelName
  name: string
  description: string
  status: DriverRewardsEntityStatus
}

export interface BonusRule {
  id: string
  name: string
  type: string
  amount: number
  description: string
  status: DriverRewardsEntityStatus
}

export interface DriverPerformanceRecord {
  id: string
  driverId: string
  driverName: string
  currentLevel: DriverLevelName
  currentPoints: number
  driverRating: number
  totalTrips: number
  onlineHours: number
  totalMileage: number
  weeklyEarnings: number
  acceptanceRate: number
  completionRate: number
  nextTierProgress: number
  rewardsSuspended: boolean
  status: DriverPerformanceStatus
  levelHistory: Array<{ level: DriverLevelName; date: string }>
  pointsHistory: Array<{ action: string; points: number; date: string }>
  bonusHistory: Array<{ name: string; amount: number; date: string }>
  achievementHistory: Array<{ name: string; date: string }>
  earningsHistory: Array<{ period: string; amount: number }>
  ratingHistory: Array<{ period: string; rating: number }>
}

export interface Promotion {
  id: string
  name: string
  type: PromotionType
  amount: number
  startDate: string
  endDate: string
  status: PromotionStatus
}

export interface Achievement {
  id: string
  name: string
  reward: string
  pointsAwarded: number
  status: DriverRewardsEntityStatus
}

export interface ProgressionRule {
  id: string
  level: DriverLevelName
  requiredPoints: number
  requiredRating: number
  requiredTrips: number
  requiredOnlineHours: number
  requiredAcceptanceRate: number
  requiredCompletionRate: number
}

export interface RewardNotificationTemplate {
  id: string
  name: string
  template: string
  category: NotificationCategory
  status: DriverRewardsEntityStatus
}

export interface DriverRewardsOverview {
  totalDriversEnrolled: number
  totalActiveDrivers: number
  totalPointsIssued: number
  totalBonusesPaid: number
  driversNearPromotion: number
  driversAtRiskOfDemotion: number
  averageDriverRating: number
  averageWeeklyEarnings: number
  journeyDrivers: number
  proGoDrivers: number
  eliteDrivers: number
  platinumDrivers: number
  diamondDrivers: number
}

export interface DriverRewardsStatPoint {
  label: string
  value: number
  secondary?: number
}

export interface EarningsAnalyticsData {
  totalDriverEarnings: number
  totalBonusesPaid: number
  totalTipsEarned: number
  totalPromotionsPaid: number
  averageEarningsPerDriver: number
  weeklyEarnings: number
  monthlyEarnings: number
  earningsTrend: DriverRewardsStatPoint[]
  bonusTrend: DriverRewardsStatPoint[]
  tipsTrend: DriverRewardsStatPoint[]
  promotionTrend: DriverRewardsStatPoint[]
  weeklyDriverIncome: DriverRewardsStatPoint[]
  topEarningDrivers: DriverRewardsStatPoint[]
}

export interface LevelAnalyticsData {
  driversPromotedThisMonth: number
  driversDemotedThisMonth: number
  driversNearNextLevel: number
  driversNearDemotion: number
  averagePointsPerDriver: number
  averageDriverRating: number
  levelDistribution: DriverRewardsStatPoint[]
  promotionRate: DriverRewardsStatPoint[]
  demotionRate: DriverRewardsStatPoint[]
  pointsGrowthTrend: DriverRewardsStatPoint[]
  driverRetention: DriverRewardsStatPoint[]
  leaderboardPoints: DriverRewardsStatPoint[]
  leaderboardTrips: DriverRewardsStatPoint[]
  leaderboardEarnings: DriverRewardsStatPoint[]
  leaderboardRating: DriverRewardsStatPoint[]
}

export interface DriverRewardsOverviewCharts {
  levelDistribution: DriverRewardsStatPoint[]
  monthlyPointsIssued: DriverRewardsStatPoint[]
  driverProgressTrend: DriverRewardsStatPoint[]
  weeklyEarningsTrend: DriverRewardsStatPoint[]
}

export type EarningsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface RewardsSearchResult {
  type: 'driver' | 'tier' | 'achievement' | 'promotion' | 'points'
  id: string
  label: string
  meta: string
}
