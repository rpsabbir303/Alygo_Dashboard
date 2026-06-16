export type DrivingHoursDriverStatus = 'active' | 'near_limit' | 'over_limit' | 'on_reset'

export interface DrivingHoursGlobalPolicy {
  id: string
  maxDrivingHours: number
  requiredResetHours: number
  warningThresholdHours: number
  status: 'active' | 'inactive'
}

export interface StateDrivingRule {
  id: string
  state: string
  maxDrivingHours: number
  requiredResetHours: number
  warningThresholdHours: number
  status: 'active' | 'inactive'
}

export interface CityDrivingRule {
  id: string
  city: string
  state: string
  maxDrivingHours: number
  requiredResetHours: number
  warningThresholdHours: number
  status: 'active' | 'inactive'
}

export interface DriverHoursRecord {
  id: string
  driverId: string
  driverName: string
  city: string
  state: string
  hoursDrivenToday: number
  hoursDrivenThisWeek: number
  maxAllowedHours: number
  resetHoursRemaining: number
  status: DrivingHoursDriverStatus
  lastTripEndedAt: string
  violations: number
}

export interface DrivingHoursOverview {
  driversNearLimit: number
  driversOverLimit: number
  activeDrivers: number
  drivingHourViolations: number
}

export interface DrivingHoursAnalytics {
  violationTrend: Array<{ label: string; value: number }>
  hoursByCity: Array<{ label: string; value: number }>
  complianceRate: Array<{ label: string; value: number }>
}
