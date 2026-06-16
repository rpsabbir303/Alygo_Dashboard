import { Pencil } from 'lucide-react'
import type { ActionMenuItem } from '@/components/admin/types'

export function getTierFilterActionItems(): ActionMenuItem[] {
  return [{ key: 'edit', label: 'Edit Settings', icon: Pencil }]
}

export const TIER_LABELS: Record<string, string> = {
  journey: 'Journey',
  pro_go: 'Pro Go',
  elite: 'Elite',
  platinum: 'Platinum',
  diamond: 'Diamond',
}
