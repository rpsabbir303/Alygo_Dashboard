import type { ChartPoint } from '@/types'

export interface DemandOverviewMetrics {
  currentActiveRequests: number
  forecastedRequests24h: number
  highDemandZones: number
  activeSurgeZones: number
  upcomingEvents: number
  revenueImpact: string
  averageEta: string
  availableDrivers: number
}

export interface DemandEvent {
  id: string
  eventName: string
  location: string
  date: string
  expectedAttendance: number
  predictedDemandImpact: string
  recommendedSurge: string
  estimatedRevenueImpact: number
  status: 'upcoming' | 'active' | 'completed'
}

export interface TopDemandZone {
  id: string
  zone: string
  activeRequests: number
  availableDrivers: number
  demandRatio: number
  averageEta: string
}

export const DEMAND_OVERVIEW: DemandOverviewMetrics = {
  currentActiveRequests: 4892,
  forecastedRequests24h: 6120,
  highDemandZones: 12,
  activeSurgeZones: 5,
  upcomingEvents: 7,
  revenueImpact: '+18%',
  averageEta: '6.2 min',
  availableDrivers: 3982,
}

export const FORECAST_RANGES = ['today', '24h', '7d', '30d'] as const
export type ForecastRange = (typeof FORECAST_RANGES)[number]

export const FORECAST_RANGE_LABELS: Record<ForecastRange, string> = {
  today: 'Today',
  '24h': '24 Hours',
  '7d': '7 Days',
  '30d': '30 Days',
}

export const FORECAST_DATA: Record<ForecastRange, ChartPoint[]> = {
  today: [
    { label: '6AM', value: 820, secondary: 780 },
    { label: '9AM', value: 1420, secondary: 1380 },
    { label: '12PM', value: 1180, secondary: 1250 },
    { label: '3PM', value: 1340, secondary: 1410 },
    { label: '6PM', value: 2890, secondary: 3120 },
    { label: '9PM', value: 2100, secondary: 2280 },
    { label: '12AM', value: 980, secondary: 920 },
  ],
  '24h': [
    { label: 'Now', value: 4892, secondary: 6120 },
    { label: '+4h', value: 4200, secondary: 5100 },
    { label: '+8h', value: 3800, secondary: 4600 },
    { label: '+12h', value: 2900, secondary: 3400 },
    { label: '+16h', value: 3200, secondary: 3900 },
    { label: '+20h', value: 4100, secondary: 4800 },
    { label: '+24h', value: 4500, secondary: 5400 },
  ],
  '7d': [
    { label: 'Mon', value: 42000, secondary: 44500 },
    { label: 'Tue', value: 39800, secondary: 41200 },
    { label: 'Wed', value: 44100, secondary: 46800 },
    { label: 'Thu', value: 46200, secondary: 49100 },
    { label: 'Fri', value: 52400, secondary: 55800 },
    { label: 'Sat', value: 61200, secondary: 64800 },
    { label: 'Sun', value: 48900, secondary: 51200 },
  ],
  '30d': [
    { label: 'W1', value: 285000, secondary: 298000 },
    { label: 'W2', value: 302000, secondary: 318000 },
    { label: 'W3', value: 318000, secondary: 335000 },
    { label: 'W4', value: 331000, secondary: 352000 },
  ],
}

export const DEMAND_EVENTS: DemandEvent[] = [
  {
    id: 'EV-1',
    eventName: 'NBA Finals Game 7',
    location: 'Downtown Arena',
    date: '2026-06-15',
    expectedAttendance: 22000,
    predictedDemandImpact: 'Very High',
    recommendedSurge: '2.8x',
    estimatedRevenueImpact: 42000,
    status: 'upcoming',
  },
  {
    id: 'EV-2',
    eventName: 'SF Tech Conference',
    location: 'Moscone Center',
    date: '2026-06-14',
    expectedAttendance: 12000,
    predictedDemandImpact: 'High',
    recommendedSurge: '2.2x',
    estimatedRevenueImpact: 48000,
    status: 'active',
  },
  {
    id: 'EV-3',
    eventName: 'Music Festival',
    location: 'Golden Gate Park',
    date: '2026-06-16',
    expectedAttendance: 45000,
    predictedDemandImpact: 'Critical',
    recommendedSurge: '4.1x',
    estimatedRevenueImpact: 128000,
    status: 'upcoming',
  },
  {
    id: 'EV-4',
    eventName: 'Lakers vs Warriors',
    location: 'Crypto.com Arena',
    date: '2026-06-13',
    expectedAttendance: 18500,
    predictedDemandImpact: 'Very High',
    recommendedSurge: '3.2x',
    estimatedRevenueImpact: 62000,
    status: 'completed',
  },
]

export const DRIVER_EARNINGS_IMPACT = {
  currentAvgEarnings: 28.4,
  forecastAvgEarnings: 34.2,
  revenueIncrease: '+20.4%',
  bestPerformingMarket: 'San Francisco',
  highestSurgeZone: 'Downtown SF (2.4x)',
}

export const TOP_DEMAND_ZONES: TopDemandZone[] = [
  { id: 'TZ-1', zone: 'SFO Airport', activeRequests: 342, availableDrivers: 89, demandRatio: 3.84, averageEta: '8.4 min' },
  { id: 'TZ-2', zone: 'Downtown SF', activeRequests: 289, availableDrivers: 124, demandRatio: 2.33, averageEta: '5.1 min' },
  { id: 'TZ-3', zone: 'LAX Terminal', activeRequests: 412, availableDrivers: 156, demandRatio: 2.64, averageEta: '7.2 min' },
  { id: 'TZ-4', zone: 'Midtown Manhattan', activeRequests: 378, availableDrivers: 98, demandRatio: 3.86, averageEta: '9.1 min' },
  { id: 'TZ-5', zone: 'Convention Center', activeRequests: 198, availableDrivers: 72, demandRatio: 2.75, averageEta: '6.8 min' },
]

export const MAP_FILTER_OPTIONS = [
  'Drivers',
  'Passengers',
  'Heatmap',
  'Surge',
  'Events',
  'Reservations',
  'Airports',
] as const

export type MapFilter = (typeof MAP_FILTER_OPTIONS)[number]

export const LEGACY_DEMAND_PATHS = [
  '/demand/trends',
  '/demand/forecasting',
  '/demand/heat-maps',
  '/demand/earnings-forecasts',
  '/demand/event-intelligence',
] as const
