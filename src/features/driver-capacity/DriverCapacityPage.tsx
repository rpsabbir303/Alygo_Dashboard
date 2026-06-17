import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AutoRulesSettings } from '@/features/driver-capacity/components/AutoRulesSettings'
import { CapacityOverviewCards } from '@/features/driver-capacity/components/CapacityOverviewCards'
import { DriverCapSettingsTable } from '@/features/driver-capacity/components/DriverCapSettingsTable'
import { WaitlistManagementTable } from '@/features/driver-capacity/components/WaitlistManagementTable'
import { useDriverCapacityRealtime } from '@/features/driver-capacity/hooks/useDriverCapacityRealtime'

export default function DriverCapacityPage() {
  useDocumentTitle('Driver Capacity & Waitlist')
  useDriverCapacityRealtime()

  return (
    <PageShell
      title="Driver Capacity & Waitlist Management"
      description="Control how many drivers can operate in each city or state. Manage waitlists, approvals, and auto-processing rules."
    >
      <CapacityOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="waitlist"
          items={[
            { key: 'waitlist', label: 'Waitlist Management', children: <WaitlistManagementTable /> },
            { key: 'caps', label: 'Driver Cap Settings', children: <DriverCapSettingsTable /> },
            { key: 'auto-rules', label: 'Auto Rules', children: <AutoRulesSettings /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
