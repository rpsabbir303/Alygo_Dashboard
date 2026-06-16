import { Pencil } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'
import type { OperationsPolicyRule } from '@/types/operationsPolicy'
import { CATEGORY_LABELS } from '@/services/operationsPolicyApi'

export function getPolicyActionItems(): ActionMenuItem[] {
  return [{ key: 'edit', label: 'Edit Policy', icon: Pencil }]
}

export function buildPolicyFields(record: OperationsPolicyRule) {
  return [
    { label: 'Policy Name', value: record.name },
    { label: 'Category', value: CATEGORY_LABELS[record.category] },
    { label: 'Description', value: record.description },
    { label: 'Value', value: record.value },
    { label: 'Status', value: record.status },
    { label: 'Last Updated', value: new Date(record.lastUpdated).toLocaleString() },
    { label: 'Updated By', value: record.updatedBy },
  ]
}
