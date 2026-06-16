import { Pencil } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'
import type { CityDrivingRule, StateDrivingRule } from '@/types/drivingHours'

export function getStateRuleActionItems(): ActionMenuItem[] {
  return [{ key: 'edit', label: 'Edit Rule', icon: Pencil }]
}

export function getCityRuleActionItems(): ActionMenuItem[] {
  return [{ key: 'edit', label: 'Edit Rule', icon: Pencil }]
}

export const DRIVER_HOURS_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  near_limit: 'Near Limit',
  over_limit: 'Over Limit',
  on_reset: 'On Reset',
}

export function buildStateRuleFields(record: StateDrivingRule) {
  return [
    { label: 'State', value: record.state },
    { label: 'Max Driving Hours', value: record.maxDrivingHours },
    { label: 'Required Reset Hours', value: record.requiredResetHours },
    { label: 'Warning Threshold', value: record.warningThresholdHours },
    { label: 'Status', value: record.status },
  ]
}

export function buildCityRuleFields(record: CityDrivingRule) {
  return [
    { label: 'City', value: record.city },
    { label: 'State', value: record.state },
    { label: 'Max Driving Hours', value: record.maxDrivingHours },
    { label: 'Required Reset Hours', value: record.requiredResetHours },
    { label: 'Warning Threshold', value: record.warningThresholdHours },
    { label: 'Status', value: record.status },
  ]
}
