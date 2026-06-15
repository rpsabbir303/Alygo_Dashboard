import {
  Ban,
  Copy,
  Eye,
  Pencil,
  Power,
  PowerOff,
  RefreshCw,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type { ActionMenuItem, DetailField } from '@/components/admin/types'
import type { useAdminActions } from '@/hooks/useAdminActions'
import type {
  DriverLevel,
  DriverPerformanceRecord,
  LevelBenefit,
  PointsRule,
  Promotion,
} from '@/types/driverRewards'
import { LEVEL_LABELS } from '@/services/driverRewardsApi'
import { formatCurrency } from '@/utils/format'

type AdminActions = ReturnType<typeof useAdminActions>

export function openRewardsDrawer(title: string, fields: DetailField[], adminActions: AdminActions) {
  adminActions.openDrawer(title, fields)
}

export function getTierActionItems(record: DriverLevel): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'duplicate', label: 'Duplicate', icon: Copy, group: 1 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Deactivate', icon: PowerOff, group: 2 })
  } else {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 2 })
  }
  return items
}

export const getLevelActionItems = getTierActionItems

export function getPointsRuleActionItems(record: PointsRule): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'disable', label: 'Disable', icon: PowerOff, group: 3 })
  } else {
    items.push({ key: 'enable', label: 'Enable', icon: Power, group: 3 })
  }
  return items
}

export function getBenefitActionItems(record: LevelBenefit): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'edit', label: 'Edit Benefit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Remove Benefit', icon: Trash2, danger: true, group: 2 },
  ]
  if (record.status === 'active') {
    items.push({ key: 'deactivate', label: 'Deactivate', icon: PowerOff, group: 3 })
  } else {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 3 })
  }
  return items
}

export function getDriverControlActionItems(record: DriverPerformanceRecord): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View Profile', icon: Eye },
    { key: 'adjust-points', label: 'Adjust Points', icon: Pencil, group: 1 },
    { key: 'promote', label: 'Promote Tier', icon: TrendingUp, group: 2 },
    { key: 'demote', label: 'Demote Tier', icon: TrendingDown, group: 2 },
    { key: 'reset', label: 'Reset Tier', icon: RefreshCw, group: 3 },
    { key: 'suspend', label: record.rewardsSuspended ? 'Resume Rewards' : 'Suspend Rewards', icon: Ban, group: 3 },
    { key: 'history', label: 'View History', icon: Eye, group: 4 },
  ]
  if (record.currentLevel === 'diamond') return items.filter((i) => i.key !== 'promote')
  if (record.currentLevel === 'journey') return items.filter((i) => i.key !== 'demote')
  return items
}

export const getDriverPerformanceActionItems = getDriverControlActionItems

export function getPromotionActionItems(record: Promotion): ActionMenuItem[] {
  const items: ActionMenuItem[] = [{ key: 'edit', label: 'Edit Promotion', icon: Pencil, group: 1 }]
  if (record.status === 'active') {
    items.push({ key: 'pause', label: 'Pause Promotion', icon: PowerOff, group: 2 })
  } else if (record.status === 'paused') {
    items.push({ key: 'activate', label: 'Activate', icon: Power, group: 2 })
  }
  items.push({ key: 'delete', label: 'Delete Promotion', icon: Trash2, danger: true, group: 3 })
  return items
}

export function getAchievementActionItems(): ActionMenuItem[] {
  return [
    { key: 'edit', label: 'Edit', icon: Pencil, group: 1 },
    { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
  ]
}

export function buildLevelDetailFields(record: DriverLevel): DetailField[] {
  return [
    { label: 'Tier Name', value: record.label },
    { label: 'Description', value: record.description },
    { label: 'Required Points', value: record.requiredPoints },
    { label: 'Required Rating', value: record.requiredRating },
    { label: 'Required Trips', value: record.requiredTrips },
    { label: 'Required Online Hours', value: record.requiredOnlineHours },
    { label: 'Acceptance Rate', value: `${record.requiredAcceptanceRate}%` },
    { label: 'Completion Rate', value: `${record.requiredCompletionRate}%` },
    { label: 'Tier Color', value: record.tierColor },
    { label: 'Tier Badge', value: record.tierBadge },
    { label: 'Benefits Count', value: record.benefitsCount },
    { label: 'Status', value: record.status === 'active' ? 'Active' : 'Inactive' },
  ]
}

export function buildPromotionDetailFields(record: Promotion): DetailField[] {
  return [
    { label: 'Promotion Name', value: record.name },
    { label: 'Type', value: record.type.replace(/_/g, ' ') },
    { label: 'Bonus Amount', value: formatCurrency(record.amount) },
    { label: 'Start Date', value: new Date(record.startDate).toLocaleString() },
    { label: 'End Date', value: new Date(record.endDate).toLocaleString() },
    { label: 'Status', value: record.status },
  ]
}

export function levelLabel(level: string) {
  return LEVEL_LABELS[level as keyof typeof LEVEL_LABELS] ?? level
}
