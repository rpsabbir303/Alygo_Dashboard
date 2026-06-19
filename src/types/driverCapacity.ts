export type WaitlistDriverStatus = 'pending' | 'approved' | 'rejected' | 'priority'

export type CapacityRuleAdminStatus = 'active' | 'inactive'

export type CapacityRuleDisplayStatus = 'available' | 'full' | 'near_capacity' | 'inactive'

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
  notes?: string
  status: CapacityRuleAdminStatus
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

export interface DriverCapacityListParams {
  page?: number
  pageSize?: number
  search?: string
  state?: string
  city?: string
  status?: string
}

export interface DriverCapacityListResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface CapacityRuleFormValues {
  state: string
  city: string
  maxDrivers: number
  notes?: string
  status: CapacityRuleAdminStatus
}
