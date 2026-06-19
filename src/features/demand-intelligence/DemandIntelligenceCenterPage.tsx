import { PageShell } from '@/components/common/PageShell'
import { LiveDemandMap } from '@/features/demand-intelligence/components/LiveDemandMap'
import {
  DemandForecastSection,
  DemandOverviewCards,
  DriverEarningsSection,
  EventImpactSection,
  OperationalSnapshotSection,
  TopDemandZonesSection,
} from '@/features/demand-intelligence/components/DemandIntelligenceSections'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function DemandIntelligenceCenterPage() {
  useDocumentTitle('Demand Intelligence Center')

  return (
    <PageShell
      title="Demand Intelligence Center"
      description="Unified demand visibility, forecasting, event impact, and operational intelligence."
    >
      <div className="space-y-6">
        <DemandOverviewCards />
        <LiveDemandMap />
        <DemandForecastSection />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <EventImpactSection />
          <DriverEarningsSection />
        </div>

        <TopDemandZonesSection />
        <OperationalSnapshotSection />
      </div>
    </PageShell>
  )
}
