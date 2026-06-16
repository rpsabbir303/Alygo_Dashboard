import type {
  CityDrivingRule,
  DriverHoursRecord,
  DrivingHoursAnalytics,
  DrivingHoursGlobalPolicy,
  DrivingHoursOverview,
  StateDrivingRule,
} from '@/types/drivingHours'

export let mockDrivingHoursPolicy: DrivingHoursGlobalPolicy = {
  id: 'dhp-global',
  maxDrivingHours: 12,
  requiredResetHours: 8,
  warningThresholdHours: 10,
  status: 'active',
}

export let mockStateDrivingRules: StateDrivingRule[] = [
  { id: 'sd-ca', state: 'California', maxDrivingHours: 12, requiredResetHours: 8, warningThresholdHours: 10, status: 'active' },
  { id: 'sd-ny', state: 'New York', maxDrivingHours: 10, requiredResetHours: 10, warningThresholdHours: 8, status: 'active' },
  { id: 'sd-tx', state: 'Texas', maxDrivingHours: 14, requiredResetHours: 6, warningThresholdHours: 12, status: 'active' },
  { id: 'sd-fl', state: 'Florida', maxDrivingHours: 12, requiredResetHours: 8, warningThresholdHours: 10, status: 'active' },
]

export let mockCityDrivingRules: CityDrivingRule[] = [
  { id: 'cd-sf', city: 'San Francisco', state: 'California', maxDrivingHours: 10, requiredResetHours: 8, warningThresholdHours: 8, status: 'active' },
  { id: 'cd-la', city: 'Los Angeles', state: 'California', maxDrivingHours: 12, requiredResetHours: 8, warningThresholdHours: 10, status: 'active' },
  { id: 'cd-nyc', city: 'New York City', state: 'New York', maxDrivingHours: 10, requiredResetHours: 10, warningThresholdHours: 8, status: 'active' },
  { id: 'cd-mia', city: 'Miami', state: 'Florida', maxDrivingHours: 12, requiredResetHours: 8, warningThresholdHours: 10, status: 'active' },
]

export let mockDriverHoursRecords: DriverHoursRecord[] = [
  { id: 'dh-1', driverId: 'd-204', driverName: 'Marcus Johnson', city: 'San Francisco', state: 'California', hoursDrivenToday: 9.5, hoursDrivenThisWeek: 42, maxAllowedHours: 10, resetHoursRemaining: 0, status: 'near_limit', lastTripEndedAt: '2026-06-12T14:30:00Z', violations: 0 },
  { id: 'dh-2', driverId: 'd-089', driverName: 'Lisa Martinez', city: 'San Francisco', state: 'California', hoursDrivenToday: 6.2, hoursDrivenThisWeek: 38, maxAllowedHours: 10, resetHoursRemaining: 0, status: 'active', lastTripEndedAt: '2026-06-12T13:45:00Z', violations: 0 },
  { id: 'dh-3', driverId: 'd-118', driverName: 'David Kim', city: 'Los Angeles', state: 'California', hoursDrivenToday: 11.8, hoursDrivenThisWeek: 52, maxAllowedHours: 12, resetHoursRemaining: 0, status: 'near_limit', lastTripEndedAt: '2026-06-12T15:00:00Z', violations: 1 },
  { id: 'dh-4', driverId: 'd-302', driverName: 'Elena Rodriguez', city: 'New York City', state: 'New York', hoursDrivenToday: 10.5, hoursDrivenThisWeek: 48, maxAllowedHours: 10, resetHoursRemaining: 0, status: 'over_limit', lastTripEndedAt: '2026-06-12T14:55:00Z', violations: 2 },
  { id: 'dh-5', driverId: 'd-441', driverName: 'James Wilson', city: 'Miami', state: 'Florida', hoursDrivenToday: 4.0, hoursDrivenThisWeek: 28, maxAllowedHours: 12, resetHoursRemaining: 0, status: 'active', lastTripEndedAt: '2026-06-12T12:00:00Z', violations: 0 },
  { id: 'dh-6', driverId: 'd-512', driverName: 'Jennifer Park', city: 'San Francisco', state: 'California', hoursDrivenToday: 0, hoursDrivenThisWeek: 22, maxAllowedHours: 10, resetHoursRemaining: 6.5, status: 'on_reset', lastTripEndedAt: '2026-06-12T06:00:00Z', violations: 0 },
]

export function computeDrivingHoursOverview(): DrivingHoursOverview {
  return {
    driversNearLimit: mockDriverHoursRecords.filter((d) => d.status === 'near_limit').length,
    driversOverLimit: mockDriverHoursRecords.filter((d) => d.status === 'over_limit').length,
    activeDrivers: mockDriverHoursRecords.filter((d) => d.status === 'active').length,
    drivingHourViolations: mockDriverHoursRecords.reduce((sum, d) => sum + d.violations, 0),
  }
}

export const mockDrivingHoursAnalytics: DrivingHoursAnalytics = {
  violationTrend: [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 10 },
    { label: 'Mar', value: 14 },
    { label: 'Apr', value: 8 },
    { label: 'May', value: 11 },
    { label: 'Jun', value: 9 },
  ],
  hoursByCity: [
    { label: 'San Francisco', value: 420 },
    { label: 'Los Angeles', value: 580 },
    { label: 'New York City', value: 510 },
    { label: 'Miami', value: 320 },
  ],
  complianceRate: [
    { label: 'Jan', value: 94 },
    { label: 'Feb', value: 95 },
    { label: 'Mar', value: 93 },
    { label: 'Apr', value: 96 },
    { label: 'May', value: 97 },
    { label: 'Jun', value: 96 },
  ],
}
