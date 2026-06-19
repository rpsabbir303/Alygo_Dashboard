import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import { CommunicationCenterKpiCards } from '@/features/communication/components/CommunicationCenterKpiCards'
import { CommunicationInboxTab } from '@/features/communication/components/CommunicationInboxTab'
import { BroadcastsTab, TemplatesTab } from '@/features/communication/components/CommunicationTabPanels'
import {
  COMMUNICATION_TAB_LABELS,
  isInboxTab,
  resolveCommunicationTab,
  type CommunicationTabKey,
} from '@/features/communication/communicationNavigation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

function renderTabContent(tab: CommunicationTabKey) {
  if (isInboxTab(tab)) return <CommunicationInboxTab tabKey={tab} />
  if (tab === 'broadcasts') return <BroadcastsTab />
  if (tab === 'templates') return <TemplatesTab />
  return <CommunicationInboxTab tabKey="all-messages" />
}

export default function CommunicationCenterPage() {
  useDocumentTitle('Communication Center')
  const [searchParams, setSearchParams] = useSearchParams()
  const validTab = resolveCommunicationTab(searchParams.get('tab'))

  const tabs = (Object.keys(COMMUNICATION_TAB_LABELS) as CommunicationTabKey[]).map((key) => ({
    key,
    label: COMMUNICATION_TAB_LABELS[key],
    children: renderTabContent(key),
  }))

  return (
    <PageShell
      title="Communication Center"
      description="Central inbox for all platform communications — messages, support, safety, broadcasts, and templates."
    >
      <CommunicationCenterKpiCards />
      <div className="glass-card p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={tabs}
        />
      </div>
    </PageShell>
  )
}
