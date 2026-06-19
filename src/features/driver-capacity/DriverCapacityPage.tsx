import { Tabs } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/common/PageShell'
import { CapacityOverviewCards } from '@/features/driver-capacity/components/CapacityOverviewCards'
import { DriverCapSettingsTable } from '@/features/driver-capacity/components/DriverCapSettingsTable'
import { WaitlistManagementTable } from '@/features/driver-capacity/components/WaitlistManagementTable'
import {
  CAPACITY_TAB_LABELS,
  resolveCapacityTab,
} from '@/features/driver-capacity/capacityNavigation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const CAPACITY_TABS = [
  { key: 'waitlist', label: CAPACITY_TAB_LABELS.waitlist, children: <WaitlistManagementTable /> },
  { key: 'capacity-rules', label: CAPACITY_TAB_LABELS['capacity-rules'], children: <DriverCapSettingsTable /> },
] as const

export default function DriverCapacityPage() {
  useDocumentTitle('Driver Capacity Management')
  const [searchParams, setSearchParams] = useSearchParams()
  const validTab = resolveCapacityTab(searchParams.get('tab'))

  return (
    <PageShell
      title="Driver Capacity Management"
      description="Manage driver waitlists and city/state capacity limits with manual admin control."
    >
      <CapacityOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          activeKey={validTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={[...CAPACITY_TABS]}
        />
      </div>
    </PageShell>
  )
}
