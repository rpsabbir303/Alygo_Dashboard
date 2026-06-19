import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CentralTierLimitsTable } from '@/features/destination-filters/components/CentralTierLimitsTable'
import { DestinationFilterAnalytics } from '@/features/destination-filters/components/DestinationFilterAnalytics'
import { DestinationFilterOverviewCards } from '@/features/destination-filters/components/DestinationFilterOverviewCards'
import { useDestinationFilterRealtime } from '@/features/destination-filters/hooks/useDestinationFilterRealtime'

export default function DestinationFilterManagementPage() {
  useDocumentTitle('Destination Filter Usage & Analytics')
  useDestinationFilterRealtime()

  return (
    <PageShell
      title="Destination Filter Usage & Analytics"
      description="Monitor filter adoption, utilization, acceptance rates, and usage trends. Tier filter limits are read from Tier Management."
    >
      <DestinationFilterOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="analytics"
          items={[
            { key: 'analytics', label: 'Analytics', children: <DestinationFilterAnalytics /> },
            { key: 'tier-limits', label: 'Tier Limits (Read-Only)', children: <CentralTierLimitsTable /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
