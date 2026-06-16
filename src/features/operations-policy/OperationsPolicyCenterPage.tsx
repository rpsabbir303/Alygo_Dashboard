import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { OperationsPolicyOverviewCards } from '@/features/operations-policy/components/OperationsPolicyOverviewCards'
import { PolicyRulesTable } from '@/features/operations-policy/components/PolicyRulesTable'
import { useOperationsPolicyRealtime } from '@/features/operations-policy/hooks/useOperationsPolicyRealtime'

export default function OperationsPolicyCenterPage() {
  useDocumentTitle('Operations Policy Center')
  useOperationsPolicyRealtime()

  return (
    <PageShell
      title="Operations Policy Center"
      description="Central configuration for driving hour policies, destination filters, fare adjustments, refunds, and driver penalties."
    >
      <OperationsPolicyOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="driving_hours"
          items={[
            { key: 'driving_hours', label: 'Driving Hour Policies', children: <PolicyRulesTable category="driving_hours" /> },
            { key: 'destination_filter', label: 'Destination Filter Policies', children: <PolicyRulesTable category="destination_filter" /> },
            { key: 'fare_adjustment', label: 'Fare Adjustment Rules', children: <PolicyRulesTable category="fare_adjustment" /> },
            { key: 'refund', label: 'Refund Rules', children: <PolicyRulesTable category="refund" /> },
            { key: 'driver_penalty', label: 'Driver Penalty Rules', children: <PolicyRulesTable category="driver_penalty" /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
