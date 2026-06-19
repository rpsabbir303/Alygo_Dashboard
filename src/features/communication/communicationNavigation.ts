export const COMMUNICATION_TAB_KEYS = [
  'all-messages',
  'drivers',
  'passengers',
  'support',
  'safety',
  'broadcasts',
  'templates',
] as const

export type CommunicationTabKey = (typeof COMMUNICATION_TAB_KEYS)[number]

export const COMMUNICATION_TAB_LABELS: Record<CommunicationTabKey, string> = {
  'all-messages': 'All Messages',
  drivers: 'Drivers',
  passengers: 'Passengers',
  support: 'Support',
  safety: 'Safety',
  broadcasts: 'Broadcasts',
  templates: 'Templates',
}

export const DEFAULT_COMMUNICATION_TAB: CommunicationTabKey = 'all-messages'

/** Maps inbox tabs to communication type filter */
export const INBOX_TAB_TYPE_MAP: Partial<Record<CommunicationTabKey, string>> = {
  drivers: 'driver',
  passengers: 'passenger',
  support: 'support',
  safety: 'safety',
}

const LEGACY_TAB_MAP: Record<string, CommunicationTabKey> = {
  'support-tickets': 'all-messages',
  'broadcast-messages': 'broadcasts',
  'notification-templates': 'templates',
  conversations: 'all-messages',
  'active-trip-chats': 'all-messages',
  'driver-support': 'drivers',
  'passenger-support': 'passengers',
  'safety-comms': 'safety',
  safety: 'safety',
  broadcast: 'broadcasts',
  templates: 'templates',
  analytics: 'all-messages',
  'comm-analytics': 'all-messages',
}

export function resolveCommunicationTab(tab: string | null): CommunicationTabKey {
  if (!tab) return DEFAULT_COMMUNICATION_TAB
  if (COMMUNICATION_TAB_KEYS.includes(tab as CommunicationTabKey)) return tab as CommunicationTabKey
  return LEGACY_TAB_MAP[tab] ?? DEFAULT_COMMUNICATION_TAB
}

export function isInboxTab(tab: CommunicationTabKey) {
  return tab === 'all-messages' || tab in INBOX_TAB_TYPE_MAP
}
