import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { OperationsPolicyOverviewCards } from '@/features/operations-policy/components/OperationsPolicyOverviewCards'
import { PolicyModuleReferencePanel } from '@/features/operations-policy/components/PolicyModuleReferencePanel'
import { PolicyRulesTable } from '@/features/operations-policy/components/PolicyRulesTable'
import { TIER_MANAGEMENT_PATH } from '@/features/driver-rewards/utils/tierDefaults'
import { useOperationsPolicyRealtime } from '@/features/operations-policy/hooks/useOperationsPolicyRealtime'

export default function OperationsPolicyCenterPage() {
  useDocumentTitle('Operations Policy Center')
  useOperationsPolicyRealtime()

  return (
    <PageShell
      title="Operations Policy Center"
      description="Global operational policies for fare adjustments, refunds, and driver penalties. Tier benefits and driving hour limits are configured in their dedicated modules."
    >
      <OperationsPolicyOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="fare_adjustment"
          items={[
            {
              key: 'driving_hours',
              label: 'Driving Hours',
              children: (
                <PolicyModuleReferencePanel
                  title="Driving Hours — Configured Elsewhere"
                  description="Maximum driving hours, reset requirements, state/city rules, and driver monitoring are managed in Driving Hours Management. This policy center does not duplicate those settings."
                  path="/operations/driving-hours"
                  linkLabel="Open Driving Hours Management"
                />
              ),
            },
            {
              key: 'destination_filter',
              label: 'Destination Filters',
              children: (
                <>
                  <PolicyModuleReferencePanel
                    title="Tier Filter Limits — Tier Management"
                    description="Per-tier destination filter counts, daily/weekly limits, and expiration hours are configured in Tier Management only. This section holds global platform defaults."
                    path={TIER_MANAGEMENT_PATH}
                    linkLabel="Open Tier Management"
                  />
                  <div className="mt-6 border-t border-white/5 pt-6">
                    <PolicyRulesTable category="destination_filter" readOnly />
                  </div>
                </>
              ),
            },
            { key: 'fare_adjustment', label: 'Fare Adjustment Rules', children: <PolicyRulesTable category="fare_adjustment" /> },
            { key: 'refund', label: 'Refund Rules', children: <PolicyRulesTable category="refund" /> },
            { key: 'driver_penalty', label: 'Driver Penalty Rules', children: <PolicyRulesTable category="driver_penalty" /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
