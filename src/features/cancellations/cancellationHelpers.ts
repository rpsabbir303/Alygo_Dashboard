import { Eye, Pencil, Power, PowerOff, Trash2 } from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { useAdminActions } from '@/hooks/useAdminActions'

type AdminActions = ReturnType<typeof useAdminActions>
import type {
  CancellationFee,
  CancellationReason,
  CityCancellationPolicy,
  NoShowPolicy,
  PassengerWarningMessage,
} from '@/types/cancellation'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { formatCurrency } from '@/utils/format'
import type { RideCategory } from '@/types'

export function getReasonActionItems(record: CancellationReason): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Deactivate', icon: PowerOff, group: 2 })
  } else {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 2 })
  }
  items.push({ key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 3 })
  return items
}

export function getFeeActionItems(record: CancellationFee): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit Fee', icon: Pencil, group: 1 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Disable', icon: PowerOff, group: 2 })
  } else {
    items.push({ key: 'activate', label: 'Enable', icon: Power, group: 2 })
  }
  return items
}

export function getNoShowActionItems(record: NoShowPolicy): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Deactivate', icon: PowerOff, group: 2 })
  } else {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 2 })
  }
  return items
}

export function getCityPolicyActionItems(): ActionMenuItem[] {
  return [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit Policy', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete Policy', icon: Trash2, danger: true, group: 2 },
  ]
}

export function getWarningActionItems(record: PassengerWarningMessage): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Deactivate', icon: PowerOff, group: 2 })
  } else {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 2 })
  }
  return items
}

function categoryLabel(category: RideCategory) {
  return RIDE_CATEGORY_LABELS[category]
}

function statusLabel(status: string) {
  return status === 'active' ? 'Active' : 'Inactive'
}

export function buildReasonDetailFields(record: CancellationReason, typeLabel: string): DetailField[] {
  return [
    { label: 'Type', value: typeLabel },
    { label: 'Reason Name', value: record.name },
    { label: 'Description', value: record.description },
    { label: 'Status', value: statusLabel(record.status) },
    { label: 'Created Date', value: new Date(record.createdAt).toLocaleString() },
  ]
}

export function buildFeeDetailFields(record: CancellationFee): DetailField[] {
  return [
    { label: 'Ride Category', value: categoryLabel(record.rideCategory) },
    { label: 'Cancellation Fee', value: formatCurrency(record.fee) },
    { label: 'Driver Compensation', value: formatCurrency(record.driverCompensation) },
    { label: 'Passenger Warning Message', value: record.warningMessage },
    { label: 'Status', value: statusLabel(record.status) },
  ]
}

export function buildNoShowDetailFields(record: NoShowPolicy): DetailField[] {
  return [
    { label: 'Ride Category', value: categoryLabel(record.rideCategory) },
    { label: 'Wait Time', value: `${record.waitTimeMinutes} minutes` },
    { label: 'No Show Fee', value: formatCurrency(record.noShowFee) },
    { label: 'Driver Compensation', value: formatCurrency(record.driverCompensation) },
    { label: 'Status', value: statusLabel(record.status) },
  ]
}

export function buildCityPolicyDetailFields(record: CityCancellationPolicy): DetailField[] {
  return [
    { label: 'Country', value: 'United States' },
    { label: 'State', value: record.state },
    { label: 'City', value: record.city },
    { label: 'Ride Category', value: categoryLabel(record.rideCategory) },
    { label: 'Cancellation Fee', value: formatCurrency(record.cancellationFee) },
    { label: 'No Show Fee', value: formatCurrency(record.noShowFee) },
    { label: 'Wait Time', value: `${record.waitTime} minutes` },
    { label: 'Status', value: statusLabel(record.status) },
  ]
}

export function buildWarningDetailFields(record: PassengerWarningMessage): DetailField[] {
  return [
    { label: 'Ride Category', value: categoryLabel(record.rideCategory) },
    { label: 'Message', value: record.message },
    { label: 'Status', value: statusLabel(record.status) },
  ]
}

export function openPolicyDrawer(
  title: string,
  fields: DetailField[],
  adminActions: AdminActions,
) {
  adminActions.openDrawer(title, fields)
}
