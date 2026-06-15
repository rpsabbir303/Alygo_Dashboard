import type { RideCategory } from '@/types'

export type CancellationEntityStatus = 'active' | 'inactive'

export interface CancellationReason {
  id: string
  name: string
  description: string
  status: CancellationEntityStatus
  createdAt: string
}

export interface CancellationFee {
  id: string
  rideCategory: RideCategory
  fee: number
  driverCompensation: number
  warningMessage: string
  status: CancellationEntityStatus
}

export interface NoShowPolicy {
  id: string
  rideCategory: RideCategory
  waitTimeMinutes: number
  noShowFee: number
  driverCompensation: number
  status: CancellationEntityStatus
}

export interface CityCancellationPolicy {
  id: string
  state: string
  city: string
  rideCategory: RideCategory
  cancellationFee: number
  noShowFee: number
  waitTime: number
  status: CancellationEntityStatus
}

export interface PassengerWarningMessage {
  id: string
  message: string
  rideCategory: RideCategory
  status: CancellationEntityStatus
}

export interface CancellationAnalyticsSummary {
  totalToday: number
  passengerCancellations: number
  driverCancellations: number
  noShowCases: number
  feesCollected: number
  driverCompensationPaid: number
}

export interface CancellationTrendPoint {
  label: string
  value: number
  secondary?: number
}

export interface CancellationReasonStat {
  label: string
  value: number
}

export type CancellationReasonType = 'passenger' | 'driver'
