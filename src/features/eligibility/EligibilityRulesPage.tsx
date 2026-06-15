import { Button, Switch, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getEligibilityActionItems,
  handleEligibilityRuleAction,
  openEligibilityDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetEligibilityRulesQuery } from '@/services/api'
import type { EligibilityRule } from '@/types'

export default function EligibilityRulesPage() {
  useDocumentTitle('Eligibility Rules')
  const adminActions = useAdminActions()
  const { data: rules = [], isLoading } = useGetEligibilityRulesQuery()

  return (
    <PageShell
      title="Eligibility Rules"
      description="Configure vehicle and driver eligibility by state, city, airport, and ride category."
      actions={<Button type="primary">Create Rule</Button>}
    >
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={rules}
          scroll={{ x: 1300 }}
          {...createTableRowProps<EligibilityRule>((record) => openEligibilityDetails(record, adminActions))}
          columns={[
            { title: 'Rule Name', dataIndex: 'name' },
            { title: 'Scope', dataIndex: 'scope', render: (s: string) => <Tag>{s}</Tag> },
            { title: 'Scope Value', dataIndex: 'scopeValue' },
            { title: 'Category', dataIndex: 'category', render: (c: keyof typeof RIDE_CATEGORY_LABELS) => RIDE_CATEGORY_LABELS[c] },
            { title: 'Min Year', dataIndex: 'minVehicleYear' },
            { title: 'Max Age', dataIndex: 'maxVehicleAge' },
            { title: 'Min Rating', dataIndex: 'minRating' },
            { title: 'Min Trips', dataIndex: 'minTrips' },
            { title: 'Seats', dataIndex: 'seatCount' },
            { title: 'Active', dataIndex: 'active', render: (v: boolean) => <Switch checked={v} size="small" /> },
            createActionsColumn<EligibilityRule>(
              () => getEligibilityActionItems(),
              (key, record) => handleEligibilityRuleAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
