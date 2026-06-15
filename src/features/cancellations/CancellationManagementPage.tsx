import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CancellationAnalytics } from '@/features/cancellations/components/CancellationAnalytics'
import { CancellationFeeTable } from '@/features/cancellations/components/CancellationFeeTable'
import { CancellationReasonTable } from '@/features/cancellations/components/CancellationReasonTable'
import { CityPolicyTable } from '@/features/cancellations/components/CityPolicyTable'
import { NoShowPolicyTable } from '@/features/cancellations/components/NoShowPolicyTable'
import { WarningMessageTable } from '@/features/cancellations/components/WarningMessageTable'

export default function CancellationManagementPage() {
  useDocumentTitle('Cancellation Management')

  return (
    <PageShell
      title="Cancellation Management"
      description="Configure cancellation reasons, fees, no-show policies, location overrides, passenger warnings, and analytics."
    >
      <div className="glass-card p-4">
        <Tabs
          defaultActiveKey="passenger-reasons"
          items={[
            {
              key: 'passenger-reasons',
              label: 'Passenger Reasons',
              children: <CancellationReasonTable type="passenger" typeLabel="Passenger" />,
            },
            {
              key: 'driver-reasons',
              label: 'Driver Reasons',
              children: <CancellationReasonTable type="driver" typeLabel="Driver" />,
            },
            {
              key: 'fees',
              label: 'Cancellation Fees',
              children: <CancellationFeeTable />,
            },
            {
              key: 'no-show',
              label: 'No Show Policies',
              children: <NoShowPolicyTable />,
            },
            {
              key: 'city-policies',
              label: 'City / State Policies',
              children: <CityPolicyTable />,
            },
            {
              key: 'warnings',
              label: 'Passenger Warnings',
              children: <WarningMessageTable />,
            },
            {
              key: 'analytics',
              label: 'Analytics',
              children: <CancellationAnalytics />,
            },
          ]}
        />
      </div>
    </PageShell>
  )
}
