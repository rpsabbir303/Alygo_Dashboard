import { Pencil, Power, PowerOff, Trash2 } from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { DriverRewardsAuditFields, DriverRewardsEntityStatus } from '@/types/driverRewards'
import { formatDateTime } from '@/utils/format'

export const REWARDS_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

export function getRewardsConfigActionItems(
  status: DriverRewardsEntityStatus,
): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
  if (status === 'active') {
    items.push({ key: 'disable', label: 'Disable', icon: PowerOff, danger: true, group: 3 })
  } else {
    items.push({ key: 'enable', label: 'Enable', icon: Power, group: 3 })
  }
  return items
}

export function buildAuditDetailFields(record: DriverRewardsAuditFields): DetailField[] {
  return [
    { label: 'Created By', value: record.createdBy ?? '—' },
    { label: 'Updated By', value: record.updatedBy ?? '—' },
    { label: 'Created At', value: record.createdAt ? formatDateTime(record.createdAt) : '—' },
    { label: 'Updated At', value: record.updatedAt ? formatDateTime(record.updatedAt) : '—' },
  ]
}
