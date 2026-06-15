import { Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getEligibilityActionItems,
  handleGenericAction,
  openEligibilityRecordDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { mockDrivers } from '@/services/mock/data'

export default function CategoryAssignmentsPage() {
  useDocumentTitle('Category Assignments')
  const adminActions = useAdminActions()

  const data = mockDrivers.slice(0, 15).map((d) => ({
    key: d.id,
    driver: d.name,
    vehicle: d.vehicle,
    eligible: d.categories.map((c) => RIDE_CATEGORY_LABELS[c]).join(', '),
    removed: d.rating < 4.5 ? 'Black' : '—',
    alerts: d.complianceStatus !== 'approved' ? 'Compliance review' : '—',
  }))

  return (
    <PageShell title="Category Assignments" description="View eligible and removed categories per driver.">
      <div className="glass-card p-4">
        <Table
          dataSource={data}
          rowKey="key"
          {...createTableRowProps<{ key: string; driver: string; vehicle: string; eligible: string; removed: string; alerts: string }>((record) => openEligibilityRecordDetails(record as Record<string, unknown>, adminActions, `Eligibility — ${record.driver}`))}
          columns={[
            { title: 'Driver', dataIndex: 'driver' },
            { title: 'Vehicle', dataIndex: 'vehicle' },
            { title: 'Eligible Categories', dataIndex: 'eligible' },
            { title: 'Removed', dataIndex: 'removed', render: (v: string) => v !== '—' ? <Tag color="red">{v}</Tag> : v },
            { title: 'Alerts', dataIndex: 'alerts' },
            createActionsColumn<{ key: string; driver: string; vehicle: string; eligible: string; removed: string; alerts: string }>(
              () => getEligibilityActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.driver),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
