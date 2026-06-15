import { Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getTripActionItems,
  handleTripAction,
  openTripDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetTripsQuery } from '@/services/api'
import { formatCurrency } from '@/utils/format'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import type { Trip } from '@/types'

export default function LiveTripsPage() {
  useDocumentTitle('Live Trips')
  const adminActions = useAdminActions()
  const { data: trips = [], isLoading } = useGetTripsQuery()

  return (
    <PageShell title="Live Trips" description="Real-time view of all active and recent trip requests.">
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          rowKey="id"
          dataSource={trips}
          scroll={{ x: 1200 }}
          {...createTableRowProps<Trip>((record) => openTripDetails(record, adminActions))}
          columns={[
            { title: 'Trip ID', dataIndex: 'id' },
            { title: 'Driver', dataIndex: 'driverName' },
            { title: 'Passenger', dataIndex: 'passengerName' },
            { title: 'Category', dataIndex: 'category', render: (c: keyof typeof RIDE_CATEGORY_LABELS) => <Tag>{RIDE_CATEGORY_LABELS[c]}</Tag> },
            { title: 'Pickup', dataIndex: 'pickup', ellipsis: true },
            { title: 'Dropoff', dataIndex: 'dropoff', ellipsis: true },
            { title: 'City', dataIndex: 'city' },
            { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
            { title: 'Fare', dataIndex: 'fare', render: (f: number) => formatCurrency(f) },
            createActionsColumn<Trip>(
              () => getTripActionItems(),
              (key, record) => handleTripAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
