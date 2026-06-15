import { Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getPassengerActionItems,
  handlePassengerAction,
  openPassengerDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetPassengersQuery } from '@/services/api'
import type { Passenger } from '@/types'

export default function ActivePassengersPage() {
  useDocumentTitle('Active Passengers')
  const adminActions = useAdminActions()
  const { data, isLoading } = useGetPassengersQuery({ page: 1, pageSize: 20 })

  const activePassengers = data?.data.filter((p) => p.status === 'active') ?? []

  return (
    <PageShell title="Active Passengers" description="Passengers with recent activity on the platform.">
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={activePassengers}
          {...createTableRowProps<Passenger>((record) => openPassengerDetails(record, adminActions))}
          columns={[
            { title: 'Passenger', dataIndex: 'name' },
            { title: 'ID', dataIndex: 'id' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Trips', dataIndex: 'completedTrips' },
            { title: 'Rating', dataIndex: 'rating' },
            { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
            createActionsColumn<Passenger>(
              () => getPassengerActionItems(),
              (key, record) => handlePassengerAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
