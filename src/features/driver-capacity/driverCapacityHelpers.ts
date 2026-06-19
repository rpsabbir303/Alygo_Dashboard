import { CheckCircle, Eye, Pencil, Star, Trash2, XCircle } from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { DriverCapSetting, WaitlistDriver } from '@/types/driverCapacity'
import { WAITLIST_STATUS_LABELS } from '@/services/driverCapacityApi'

export function getWaitlistActionItems(record: WaitlistDriver): ActionMenuItem[] {
  const items: ActionMenuItem[] = [{ key: 'view', label: 'View Details', icon: Eye }]
  if (record.status === 'approved' || record.status === 'rejected') {
    items.push({ key: 'remove', label: 'Remove From Waitlist', icon: Trash2, danger: true, group: 2 })
    return items
  }
  return [
    ...items,
    { key: 'approve', label: 'Approve', icon: CheckCircle, group: 1 },
    { key: 'reject', label: 'Reject', icon: XCircle, danger: true, group: 1 },
    { key: 'priority', label: 'Move To Priority', icon: Star, group: 2 },
    { key: 'remove', label: 'Remove From Waitlist', icon: Trash2, danger: true, group: 3 },
  ]
}

export function buildWaitlistDetailFields(record: WaitlistDriver): DetailField[] {
  return [
    { label: 'Driver Name', value: record.driverName },
    { label: 'Driver ID', value: record.driverId },
    { label: 'Application Date', value: new Date(record.applicationDate).toLocaleString() },
    { label: 'Position', value: record.position },
    { label: 'City', value: record.city },
    { label: 'State', value: record.state },
    { label: 'Status', value: WAITLIST_STATUS_LABELS[record.status] },
  ]
}

export function waitlistStatusColor(status: string) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'priority') return 'gold'
  return 'processing'
}

export function capacityUtilization(current: number, max: number) {
  return max > 0 ? Math.round((current / max) * 100) : 0
}

export function getCapacityDisplayStatus(setting: DriverCapSetting) {
  if (setting.status === 'inactive') return 'inactive' as const
  if (setting.remainingSlots === 0) return 'full' as const
  if (capacityUtilization(setting.currentDrivers, setting.maxDrivers) >= 85) {
    return 'near_capacity' as const
  }
  return 'available' as const
}

export const CAPACITY_DISPLAY_STATUS_LABELS = {
  available: 'Available',
  full: 'Full',
  near_capacity: 'Near Capacity',
  inactive: 'Inactive',
} as const

export function capacityDisplayStatusColor(status: ReturnType<typeof getCapacityDisplayStatus>) {
  switch (status) {
    case 'full':
      return 'error'
    case 'near_capacity':
      return 'warning'
    case 'inactive':
      return 'default'
    default:
      return 'success'
  }
}

export function getCapacityRuleActionItems(): ActionMenuItem[] {
  return [
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
}

export function buildCapacityRuleDetailFields(record: DriverCapSetting): DetailField[] {
  const displayStatus = getCapacityDisplayStatus(record)
  return [
    { label: 'State', value: record.state },
    { label: 'City', value: record.city },
    { label: 'Max Drivers', value: record.maxDrivers },
    { label: 'Current Drivers', value: record.currentDrivers },
    { label: 'Available Slots', value: record.remainingSlots },
    { label: 'Capacity Status', value: CAPACITY_DISPLAY_STATUS_LABELS[displayStatus] },
    { label: 'Rule Status', value: record.status === 'active' ? 'Active' : 'Inactive' },
    { label: 'Notes', value: record.notes || '—' },
  ]
}
