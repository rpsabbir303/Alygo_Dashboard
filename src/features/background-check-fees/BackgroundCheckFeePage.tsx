import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { FeeAuditLogTable } from '@/features/background-check-fees/components/FeeAuditLogTable'
import { FeeConfigurationTable } from '@/features/background-check-fees/components/FeeConfigurationTable'
import { FeeOverviewCards } from '@/features/background-check-fees/components/FeeOverviewCards'
import { PaymentRulesSettings } from '@/features/background-check-fees/components/PaymentRulesSettings'
import { useBackgroundCheckFeeRealtime } from '@/features/background-check-fees/hooks/useBackgroundCheckFeeRealtime'

export default function BackgroundCheckFeePage() {
  useDocumentTitle('Background Check Fee Management')
  useBackgroundCheckFeeRealtime()

  return (
    <PageShell
      title="Background Check Fee Management"
      description="Manage background check fees, payment responsibility rules, refund policies, and audit all configuration changes."
    >
      <FeeOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="fees"
          items={[
            { key: 'fees', label: 'Fee Configuration', children: <FeeConfigurationTable /> },
            { key: 'payment-rules', label: 'Payment Rules', children: <PaymentRulesSettings /> },
            { key: 'audit', label: 'Audit Logs', children: <FeeAuditLogTable /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
