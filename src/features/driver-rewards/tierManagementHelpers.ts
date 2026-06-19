import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { DriverLevel, LevelBenefit } from '@/types/driverRewards'
import { LEVEL_LABELS } from '@/services/driverRewardsApi'

export function getTierManagementActionItems(): ActionMenuItem[] {
  return [
    { key: 'view', label: 'View', icon: Eye, group: 1 },
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
}

export function getTierBenefitActionItems(): ActionMenuItem[] {
  return [
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
}

export function buildTierDetailFields(record: DriverLevel): DetailField[] {
  return [
    { label: 'Tier Name', value: record.label },
    { label: 'Minimum Points', value: record.requiredPoints },
    { label: 'Minimum Completed Trips', value: record.requiredTrips },
    { label: 'Minimum Rating', value: record.requiredRating },
    { label: 'Minimum Acceptance Rate', value: `${record.requiredAcceptanceRate}%` },
    { label: 'Minimum Completion Rate', value: `${record.requiredCompletionRate}%` },
    { label: 'Benefits Count', value: record.benefitsCount },
    { label: 'Driver Count', value: record.driverCount },
    { label: 'Status', value: record.status === 'active' ? 'Active' : 'Inactive' },
    { label: 'Notes', value: record.description || '—' },
  ]
}

export function formatAssignedTiers(tiers: string[]) {
  return tiers.map((tier) => LEVEL_LABELS[tier] ?? tier).join(', ')
}

export function buildBenefitDetailFields(record: LevelBenefit): DetailField[] {
  return [
    { label: 'Benefit Name', value: record.name },
    { label: 'Description', value: record.description },
    { label: 'Assigned Tiers', value: formatAssignedTiers(record.assignedTiers) },
    { label: 'Status', value: record.status === 'active' ? 'Active' : 'Inactive' },
  ]
}
