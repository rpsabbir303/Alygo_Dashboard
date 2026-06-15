import { Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getActiveDriverActionItems,
  handleDriverAction,
  openDriverDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetDriversQuery } from '@/services/api'
import type { Driver } from '@/types'

export default function ActiveDriversPage() {
  useDocumentTitle('Active Drivers')
  const adminActions = useAdminActions()
  const { data, isLoading } = useGetDriversQuery({ page: 1, pageSize: 20 })

  const activeDrivers = data?.data.filter((d) => d.status === 'active') ?? []

  return (
    <PageShell title="Active Drivers" description="Drivers currently online and available for trips.">
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={activeDrivers}
          {...createTableRowProps<Driver>((record) => openDriverDetails(record, adminActions))}
          columns={[
            { title: 'Driver', dataIndex: 'name' },
            { title: 'ID', dataIndex: 'id' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Vehicle', dataIndex: 'vehicle' },
            { title: 'Rating', dataIndex: 'rating' },
            { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
            createActionsColumn<Driver>(
              () => getActiveDriverActionItems(),
              (key, record) => handleDriverAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
