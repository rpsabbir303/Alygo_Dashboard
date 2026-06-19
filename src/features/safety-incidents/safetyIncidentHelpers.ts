import { CheckCircle, Eye, MessageSquare, UserPlus, XCircle } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'
import type { SafetyIncident } from '@/types/safetyIncident'
import { PRIORITY_LABELS, STATUS_LABELS, TYPE_LABELS } from '@/services/safetyIncidentApi'

export function getIncidentActionItems(record: SafetyIncident): ActionMenuItem[] {
  const items: ActionMenuItem[] = [
    { key: 'view', label: 'View Details', icon: Eye },
  ]

  if (record.status !== 'resolved' && record.status !== 'closed') {
    items.push(
      { key: 'assign', label: 'Assign Case', icon: UserPlus, group: 1 },
      { key: 'note', label: 'Add Internal Notes', icon: MessageSquare, group: 1 },
      { key: 'resolve', label: 'Resolve Case', icon: CheckCircle, group: 2 },
    )
  }

  if (record.status === 'resolved') {
    items.push({ key: 'close', label: 'Close Case', icon: XCircle, group: 2 })
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
  if (status === 'resolved' || status === 'closed') return 'success'
  if (status === 'in_review') return 'warning'
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

export function severityLabel(level: string) {
  return PRIORITY_LABELS[level] ?? level
}
