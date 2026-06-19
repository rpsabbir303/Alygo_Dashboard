import { Navigate, useLocation } from 'react-router-dom'
import { resolveCommunicationTab } from '@/features/communication/communicationNavigation'

const LEGACY_PATH_TAB: Record<string, string> = {
  '/communication/conversations': 'all-messages',
  '/communication/active-trip-chats': 'all-messages',
  '/communication/driver-support': 'drivers',
  '/communication/passenger-support': 'passengers',
  '/communication/safety': 'safety',
  '/communication/broadcast': 'broadcasts',
  '/communication/templates': 'templates',
  '/communication/analytics': 'all-messages',
  '/communication/internal-notes': 'all-messages',
}

export function LegacyCommunicationRedirect() {
  const location = useLocation()
  const tab = resolveCommunicationTab(
    LEGACY_PATH_TAB[location.pathname] ?? new URLSearchParams(location.search).get('tab'),
  )
  return <Navigate to={`/communication?tab=${tab}`} replace />
}
