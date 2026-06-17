export type WaitlistDriverStatus = 'pending' | 'approved' | 'rejected' | 'priority'

export interface CapacityOverview {
  activeDrivers: number
  availableCapacity: number
  waitlistedDrivers: number
  pendingApprovals: number
}

export interface DriverCapSetting {
  id: string
  state: string
  city: string
  maxDrivers: number
  currentDrivers: number
  remainingSlots: number
}

export interface WaitlistDriver {
  id: string
  driverName: string
  driverId: string
  applicationDate: string
  position: number
  city: string
  state: string
  status: WaitlistDriverStatus
  priority: boolean
}

export interface CapacityAutoRules {
  autoApproveWaitlist: boolean
  manualApproval: boolean
  priorityDriversEnabled: boolean
  marketCapacityThreshold: number
}
