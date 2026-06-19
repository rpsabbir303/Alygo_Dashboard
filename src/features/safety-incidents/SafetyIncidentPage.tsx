import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import { IncidentCategoriesTable } from '@/features/safety-incidents/components/IncidentCategoriesTable'
import { IncidentTable } from '@/features/safety-incidents/components/IncidentTable'
import { SafetyOverviewCards } from '@/features/safety-incidents/components/SafetyOverviewCards'
import { SafetySettingsPanel } from '@/features/safety-incidents/components/SafetySettingsPanel'
import { useSafetyIncidentRealtime } from '@/features/safety-incidents/hooks/useSafetyIncidentRealtime'
import {
  DEFAULT_SAFETY_TAB,
  resolveSafetyTab,
  SAFETY_TAB_LABELS,
  type SafetyTabKey,
} from '@/features/safety-incidents/safetyNavigation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

function renderTabContent(tab: SafetyTabKey) {
  switch (tab) {
    case 'cases':
      return (
        <>
          <SafetyOverviewCards />
          <IncidentTable />
        </>
      )
    case 'categories':
      return <IncidentCategoriesTable />
    case 'settings':
      return <SafetySettingsPanel />
    default:
      return null
  }
}

export default function SafetyIncidentPage() {
  useDocumentTitle('Safety & Incident Management')
  useSafetyIncidentRealtime()
  const [searchParams, setSearchParams] = useSearchParams()
  const validTab = resolveSafetyTab(searchParams.get('tab'))

  const tabs = (Object.keys(SAFETY_TAB_LABELS) as SafetyTabKey[]).map((key) => ({
    key,
    label: SAFETY_TAB_LABELS[key],
    children: renderTabContent(key),
  }))

  return (
    <PageShell
      title="Safety & Incident Management"
      description="Investigate incidents, manage safety cases, track complaints, and resolve emergencies."
    >
      <div className="glass-card p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          defaultActiveKey={DEFAULT_SAFETY_TAB}
          items={tabs}
        />
      </div>
    </PageShell>
  )
}
