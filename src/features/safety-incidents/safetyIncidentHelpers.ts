import { ArrowUp, CheckCircle, Eye, UserPlus } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'
import type { SafetyIncident } from '@/types/safetyIncident'
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '@/services/safetyIncidentApi'

export function getIncidentActionItems(record: SafetyIncident): ActionMenuItem[] {
  if (record.status === 'resolved') {
    return [{ key: 'view', label: 'View', icon: Eye }]
  }
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View', icon: Eye },
    { key: 'assign', label: 'Assign', icon: UserPlus, group: 1 },
    { key: 'resolve', label: 'Resolve', icon: CheckCircle, group: 1 },
    { key: 'escalate', label: 'Escalate', icon: ArrowUp, danger: true, group: 2 },
  ]
  if (record.status === 'escalated') {
    return items.filter((i) => i.key !== 'escalate')
  }
  return items
}

export function priorityColor(priority: string) {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  if (priority === 'medium') return 'processing'
  return 'default'
}

export function statusColor(status: string) {
  if (status === 'resolved') return 'success'
  if (status === 'escalated') return 'error'
  if (status === 'assigned') return 'processing'
  return 'default'
}

export function typeLabel(type: string) {
  return TYPE_LABELS[type] ?? type
}

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status
}

export function priorityLabel(priority: string) {
  return PRIORITY_LABELS[priority] ?? priority
}
