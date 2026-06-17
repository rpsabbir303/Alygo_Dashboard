import type {
  CapacityAutoRules,
  CapacityOverview,
  DriverCapSetting,
  WaitlistDriver,
} from '@/types/driverCapacity'

function cap(
  id: string,
  state: string,
  city: string,
  max: number,
  current: number,
): DriverCapSetting {
  return { id, state, city, maxDrivers: max, currentDrivers: current, remainingSlots: Math.max(0, max - current) }
}

export let mockDriverCapSettings: DriverCapSetting[] = [
  cap('cap-1', 'California', 'San Francisco', 2000, 1420),
  cap('cap-2', 'California', 'Los Angeles', 3500, 2100),
  cap('cap-3', 'New York', 'New York City', 4000, 3200),
  cap('cap-4', 'Texas', 'Austin', 1200, 860),
  cap('cap-5', 'Texas', 'Dallas', 1800, 1240),
  cap('cap-6', 'Florida', 'Miami', 1500, 980),
  cap('cap-7', 'Washington', 'Seattle', 1000, 620),
]

export let mockWaitlistDrivers: WaitlistDriver[] = [
  { id: 'wl-1', driverName: 'James Rivera', driverId: 'd-wl-101', applicationDate: '2026-06-10T08:00:00Z', position: 1, city: 'San Francisco', state: 'California', status: 'pending', priority: false },
  { id: 'wl-2', driverName: 'Sarah Thompson', driverId: 'd-wl-102', applicationDate: '2026-06-09T14:30:00Z', position: 2, city: 'San Francisco', state: 'California', status: 'pending', priority: false },
  { id: 'wl-3', driverName: 'Michael Chen', driverId: 'd-wl-103', applicationDate: '2026-06-08T11:15:00Z', position: 3, city: 'Los Angeles', state: 'California', status: 'priority', priority: true },
  { id: 'wl-4', driverName: 'Emily Davis', driverId: 'd-wl-104', applicationDate: '2026-06-07T16:45:00Z', position: 4, city: 'New York City', state: 'New York', status: 'pending', priority: false },
  { id: 'wl-5', driverName: 'Robert Wilson', driverId: 'd-wl-105', applicationDate: '2026-06-06T09:20:00Z', position: 5, city: 'Austin', state: 'Texas', status: 'pending', priority: false },
  { id: 'wl-6', driverName: 'Lisa Anderson', driverId: 'd-wl-106', applicationDate: '2026-06-05T13:00:00Z', position: 6, city: 'Miami', state: 'Florida', status: 'pending', priority: false },
  { id: 'wl-7', driverName: 'David Park', driverId: 'd-wl-107', applicationDate: '2026-06-04T10:30:00Z', position: 7, city: 'Seattle', state: 'Washington', status: 'rejected', priority: false },
  { id: 'wl-8', driverName: 'Jennifer Lee', driverId: 'd-wl-108', applicationDate: '2026-06-03T15:00:00Z', position: 8, city: 'Dallas', state: 'Texas', status: 'approved', priority: false },
]

export let mockCapacityAutoRules: CapacityAutoRules = {
  autoApproveWaitlist: false,
  manualApproval: true,
  priorityDriversEnabled: true,
  marketCapacityThreshold: 85,
}

export function computeCapacityOverview(): CapacityOverview {
  const totalMax = mockDriverCapSettings.reduce((s, c) => s + c.maxDrivers, 0)
  const totalCurrent = mockDriverCapSettings.reduce((s, c) => s + c.currentDrivers, 0)
  const pending = mockWaitlistDrivers.filter((d) => d.status === 'pending' || d.status === 'priority').length
  return {
    activeDrivers: totalCurrent,
    availableCapacity: totalMax - totalCurrent,
    waitlistedDrivers: mockWaitlistDrivers.filter((d) => d.status === 'pending' || d.status === 'priority').length,
    pendingApprovals: pending,
  }
}

export function recalcCapSlots(setting: DriverCapSetting) {
  setting.remainingSlots = Math.max(0, setting.maxDrivers - setting.currentDrivers)
}

export function reorderWaitlistPositions() {
  const active = mockWaitlistDrivers
    .filter((d) => d.status === 'pending' || d.status === 'priority')
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1
      return a.position - b.position
    })
  active.forEach((d, i) => { d.position = i + 1 })
}
