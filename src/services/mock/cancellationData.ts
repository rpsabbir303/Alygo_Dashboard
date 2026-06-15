import type {
  CancellationAnalyticsSummary,
  CancellationFee,
  CancellationReason,
  CancellationReasonStat,
  CancellationTrendPoint,
  CityCancellationPolicy,
  NoShowPolicy,
  PassengerWarningMessage,
} from '@/types/cancellation'
import type { RideCategory } from '@/types'

const now = () => new Date().toISOString()

export let mockPassengerCancellationReasons: CancellationReason[] = [
  { id: 'pcr-1', name: 'Changed My Mind', description: 'Passenger decided not to travel', status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'pcr-2', name: 'Found Another Ride', description: 'Passenger booked with another service', status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'pcr-3', name: 'Driver Taking Too Long', description: 'ETA exceeded passenger tolerance', status: 'active', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'pcr-4', name: 'Pickup Location Incorrect', description: 'Wrong pickup pin or address', status: 'active', createdAt: '2026-01-17T10:00:00Z' },
  { id: 'pcr-5', name: 'Emergency', description: 'Personal or family emergency', status: 'active', createdAt: '2026-01-18T10:00:00Z' },
  { id: 'pcr-6', name: 'Price Too High', description: 'Fare higher than expected', status: 'active', createdAt: '2026-01-19T10:00:00Z' },
  { id: 'pcr-7', name: 'Other', description: 'Custom reason provided by passenger', status: 'active', createdAt: '2026-01-20T10:00:00Z' },
]

export let mockDriverCancellationReasons: CancellationReason[] = [
  { id: 'dcr-1', name: 'Vehicle Issue', description: 'Mechanical or vehicle-related problem', status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'dcr-2', name: 'Emergency', description: 'Personal or family emergency', status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'dcr-3', name: 'Passenger Unreachable', description: 'Unable to contact passenger at pickup', status: 'active', createdAt: '2026-01-16T10:00:00Z' },
  { id: 'dcr-4', name: 'Safety Concern', description: 'Safety issue at pickup or during trip', status: 'active', createdAt: '2026-01-17T10:00:00Z' },
  { id: 'dcr-5', name: 'Incorrect Rider Information', description: 'Passenger details do not match booking', status: 'active', createdAt: '2026-01-18T10:00:00Z' },
  { id: 'dcr-6', name: 'Passenger Requested Cancellation', description: 'Passenger asked driver to cancel', status: 'active', createdAt: '2026-01-19T10:00:00Z' },
  { id: 'dcr-7', name: 'Other', description: 'Custom reason provided by driver', status: 'active', createdAt: '2026-01-20T10:00:00Z' },
]

const feeDefaults: Array<{ category: RideCategory; fee: number; compensation: number }> = [
  { category: 'standard', fee: 5, compensation: 3 },
  { category: 'comfort', fee: 7, compensation: 4 },
  { category: 'xl', fee: 10, compensation: 6 },
  { category: 'priority', fee: 8, compensation: 5 },
  { category: 'pet', fee: 6, compensation: 4 },
  { category: 'black', fee: 15, compensation: 10 },
  { category: 'black_suv', fee: 20, compensation: 12 },
]

export let mockCancellationFees: CancellationFee[] = feeDefaults.map((item, index) => ({
  id: `cf-${index + 1}`,
  rideCategory: item.category,
  fee: item.fee,
  driverCompensation: item.compensation,
  warningMessage: 'A cancellation fee may apply if you cancel this ride now.',
  status: 'active' as const,
}))

const noShowDefaults: Array<{ category: RideCategory; wait: number; fee: number; compensation: number }> = [
  { category: 'standard', wait: 5, fee: 5, compensation: 3 },
  { category: 'comfort', wait: 5, fee: 7, compensation: 4 },
  { category: 'xl', wait: 7, fee: 10, compensation: 6 },
  { category: 'priority', wait: 5, fee: 8, compensation: 5 },
  { category: 'pet', wait: 5, fee: 6, compensation: 4 },
  { category: 'black', wait: 10, fee: 15, compensation: 10 },
  { category: 'black_suv', wait: 10, fee: 20, compensation: 12 },
]

export let mockNoShowPolicies: NoShowPolicy[] = noShowDefaults.map((item, index) => ({
  id: `nsp-${index + 1}`,
  rideCategory: item.category,
  waitTimeMinutes: item.wait,
  noShowFee: item.fee,
  driverCompensation: item.compensation,
  status: 'active' as const,
}))

export let mockCityPolicies: CityCancellationPolicy[] = [
  { id: 'cp-1', state: 'California', city: 'Los Angeles', rideCategory: 'standard', cancellationFee: 5, noShowFee: 5, waitTime: 5, status: 'active' },
  { id: 'cp-2', state: 'New York', city: 'New York City', rideCategory: 'standard', cancellationFee: 8, noShowFee: 8, waitTime: 5, status: 'active' },
  { id: 'cp-3', state: 'Texas', city: 'Austin', rideCategory: 'standard', cancellationFee: 4, noShowFee: 4, waitTime: 5, status: 'active' },
  { id: 'cp-4', state: 'California', city: 'San Francisco', rideCategory: 'black', cancellationFee: 15, noShowFee: 15, waitTime: 10, status: 'active' },
  { id: 'cp-5', state: 'Florida', city: 'Miami', rideCategory: 'comfort', cancellationFee: 7, noShowFee: 7, waitTime: 5, status: 'active' },
]

export let mockWarningMessages: PassengerWarningMessage[] = feeDefaults.map((item, index) => ({
  id: `pwm-${index + 1}`,
  message: 'A cancellation fee may apply if you cancel this ride now.',
  rideCategory: item.category,
  status: 'active' as const,
}))

export const mockCancellationAnalyticsSummary: CancellationAnalyticsSummary = {
  totalToday: 142,
  passengerCancellations: 98,
  driverCancellations: 31,
  noShowCases: 13,
  feesCollected: 1840,
  driverCompensationPaid: 920,
}

export const mockCancellationTrend: CancellationTrendPoint[] = [
  { label: 'Mon', value: 118, secondary: 92 },
  { label: 'Tue', value: 132, secondary: 104 },
  { label: 'Wed', value: 125, secondary: 98 },
  { label: 'Thu', value: 148, secondary: 115 },
  { label: 'Fri', value: 165, secondary: 128 },
  { label: 'Sat', value: 189, secondary: 142 },
  { label: 'Sun', value: 142, secondary: 110 },
]

export const mockTopCancellationReasons: CancellationReasonStat[] = [
  { label: 'Changed My Mind', value: 42 },
  { label: 'Driver Taking Too Long', value: 28 },
  { label: 'Found Another Ride', value: 18 },
  { label: 'Emergency', value: 12 },
  { label: 'Price Too High', value: 9 },
]

export const mockCancellationByCity: CancellationReasonStat[] = [
  { label: 'Los Angeles', value: 38 },
  { label: 'New York City', value: 34 },
  { label: 'Austin', value: 22 },
  { label: 'San Francisco', value: 19 },
  { label: 'Miami', value: 15 },
]

export const mockCancellationByCategory: CancellationReasonStat[] = [
  { label: 'Standard', value: 52 },
  { label: 'Comfort', value: 28 },
  { label: 'Black', value: 18 },
  { label: 'XL', value: 14 },
  { label: 'Black SUV', value: 11 },
]

export function generateReasonId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

export function touchReasonCreatedAt() {
  return now()
}
