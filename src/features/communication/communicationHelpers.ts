import { AlertTriangle, ArrowUp, CheckCircle, Eye, MessageSquare, Shield, UserPlus } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'
import type { Conversation, SafetyCommunication } from '@/types/communication'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/services/communicationApi'

export function priorityColor(priority: string) {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  if (priority === 'medium') return 'processing'
  return 'default'
}

export function statusColor(status: string) {
  if (status === 'resolved' || status === 'closed') return 'success'
  if (status === 'escalated') return 'error'
  if (status === 'in_progress' || status === 'investigating') return 'processing'
  if (status === 'waiting_user') return 'warning'
  return 'default'
}

export function priorityLabel(priority: string) {
  return PRIORITY_LABELS[priority] ?? priority
}

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status.replace(/_/g, ' ')
}

export function getConversationActionItems(record: Conversation): ActionMenuItem[] {
  if (['resolved', 'closed'].includes(record.status)) {
    return [{ key: 'view', label: 'View', icon: Eye }]
  }
  return [
    { key: 'view', label: 'Open Chat', icon: MessageSquare },
    { key: 'assign', label: 'Assign Agent', icon: UserPlus, group: 1 },
    { key: 'resolve', label: 'Resolve', icon: CheckCircle, group: 1 },
    { key: 'escalate', label: 'Escalate', icon: ArrowUp, danger: true, group: 2 },
  ]
}

export function getSafetyActionItems(): ActionMenuItem[] {
  return [
    { key: 'contact-driver', label: 'Contact Driver', icon: MessageSquare, group: 1 },
    { key: 'contact-passenger', label: 'Contact Passenger', icon: MessageSquare, group: 1 },
    { key: 'escalate', label: 'Escalate Incident', icon: ArrowUp, group: 2 },
    { key: 'investigate', label: 'Create Investigation', icon: Shield, group: 2 },
    { key: 'suspend', label: 'Suspend Account', icon: AlertTriangle, danger: true, group: 3 },
    { key: 'report', label: 'Generate Report', icon: Eye, group: 3 },
  ]
}

export function getSafetyRecordActionItems(_record: SafetyCommunication): ActionMenuItem[] {
  return getSafetyActionItems()
}
