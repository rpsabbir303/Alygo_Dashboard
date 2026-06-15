import { Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getEligibilityActionItems,
  handleGenericAction,
  openEligibilityRecordDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const premiumVehicles = [
  { make: 'Mercedes-Benz', model: 'E-Class', years: '2019+', lists: 'Black, Black SUV' },
  { make: 'BMW', model: '5 Series', years: '2019+', lists: 'Black' },
  { make: 'Cadillac', model: 'Escalade', years: '2020+', lists: 'Black SUV' },
  { make: 'Tesla', model: 'Model S', years: '2018+', lists: 'Black, Comfort' },
]

export default function PremiumVehiclesPage() {
  useDocumentTitle('Premium Vehicle Lists')
  const adminActions = useAdminActions()

  return (
    <PageShell title="Premium Vehicle Lists" description="Manage luxury and premium vehicle whitelist for Black categories.">
      <div className="glass-card p-4">
        <Table
          rowKey="model"
          dataSource={premiumVehicles}
          {...createTableRowProps<{ make: string; model: string; years: string; lists: string }>((record) => openEligibilityRecordDetails(record as Record<string, unknown>, adminActions, `${record.make} ${record.model}`))}
          columns={[
            { title: 'Make', dataIndex: 'make' },
            { title: 'Model', dataIndex: 'model' },
            { title: 'Eligible Years', dataIndex: 'years' },
            { title: 'Categories', dataIndex: 'lists' },
            createActionsColumn<{ make: string; model: string; years: string; lists: string }>(
              () => getEligibilityActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, `${record.make} ${record.model}`),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
