import { ArrowUp, CheckCircle, Eye, Star, XCircle } from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { WaitlistDriver } from '@/types/driverCapacity'
import { WAITLIST_STATUS_LABELS } from '@/services/driverCapacityApi'

export function getWaitlistActionItems(record: WaitlistDriver): ActionMenuItem[] {
  if (record.status === 'approved' || record.status === 'rejected') {
    return [{ key: 'view', label: 'View', icon: Eye }]
  }
  return [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'approve', label: 'Approve', icon: CheckCircle, group: 1 },
    { key: 'priority-approve', label: 'Priority Approval', icon: Star, group: 1 },
    { key: 'move', label: 'Move Position', icon: ArrowUp, group: 2 },
    { key: 'reject', label: 'Reject', icon: XCircle, danger: true, group: 3 },
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
    { label: 'Priority', value: record.priority ? 'Yes' : 'No' },
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
