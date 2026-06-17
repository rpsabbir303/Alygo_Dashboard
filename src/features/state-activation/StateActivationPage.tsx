import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { StateActivationOverviewCards } from '@/features/state-activation/components/StateActivationOverviewCards'
import { StateAuditLogTable } from '@/features/state-activation/components/StateAuditLogTable'
import { StateConfigurationTable } from '@/features/state-activation/components/StateConfigurationTable'
import { useStateActivationRealtime } from '@/features/state-activation/hooks/useStateActivationRealtime'

export default function StateActivationPage() {
  useDocumentTitle('State Activation Control')
  useStateActivationRealtime()

  return (
    <PageShell
      title="State Activation Control"
      description="Control platform availability per state, city, and region. Configure feature toggles, registration, and operational settings."
    >
      <StateActivationOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="states"
          items={[
            { key: 'states', label: 'State Configuration', children: <StateConfigurationTable /> },
            { key: 'audit', label: 'Audit Logs', children: <StateAuditLogTable /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
