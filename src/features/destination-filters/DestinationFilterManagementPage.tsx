import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { DestinationFilterAnalytics } from '@/features/destination-filters/components/DestinationFilterAnalytics'
import { DestinationFilterOverviewCards } from '@/features/destination-filters/components/DestinationFilterOverviewCards'
import { TierFilterSettingsTable } from '@/features/destination-filters/components/TierFilterSettingsTable'
import { useDestinationFilterRealtime } from '@/features/destination-filters/hooks/useDestinationFilterRealtime'

export default function DestinationFilterManagementPage() {
  useDocumentTitle('Destination Filter Management')
  useDestinationFilterRealtime()

  return (
    <PageShell
      title="Destination Filter Management"
      description="Configure tier-based destination filter limits, expiration rules, and monitor filter usage analytics."
    >
      <DestinationFilterOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="settings"
          items={[
            { key: 'settings', label: 'Tier Settings', children: <TierFilterSettingsTable /> },
            { key: 'analytics', label: 'Analytics', children: <DestinationFilterAnalytics /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
