import { Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getReservationActionItems,
  handleReservationAction,
  openReservationDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetReservationsQuery } from '@/services/api'
import { formatDateTime } from '@/utils/format'
import type { Reservation, RideCategory } from '@/types'

function ReservationsTable({ type }: { type?: string }) {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetReservationsQuery(type ? { type } : undefined)

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1200 }}
        {...createTableRowProps<Reservation>((record) => openReservationDetails(record, adminActions))}
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Passenger', dataIndex: 'passengerName' },
          { title: 'Type', dataIndex: 'type', render: (t: string) => <Tag>{t}</Tag> },
          { title: 'Pickup', dataIndex: 'pickup', ellipsis: true },
          { title: 'Dropoff', dataIndex: 'dropoff', ellipsis: true },
          { title: 'Scheduled', dataIndex: 'scheduledAt', render: (d: string) => formatDateTime(d) },
          { title: 'Category', dataIndex: 'category', render: (c: RideCategory) => RIDE_CATEGORY_LABELS[c] },
          { title: 'Driver', dataIndex: 'driverName', render: (d?: string) => d ?? 'Unassigned' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<Reservation>(
            () => getReservationActionItems(),
            (key, record) => handleReservationAction(key, record, adminActions),
          ),
        ]}
      />
      <AdminActionHost actions={adminActions} />
    </>
  )
}

export function ScheduledRidesPage() {
  useDocumentTitle('Scheduled Rides')
  return (
    <PageShell title="Scheduled Rides" description="Manage advance bookings and driver assignments.">
      <div className="glass-card p-4"><ReservationsTable type="scheduled" /></div>
    </PageShell>
  )
}

export function AirportReservationsPage() {
  useDocumentTitle('Airport Reservations')
  return (
    <PageShell title="Airport Reservations" description="Airport pickup and dropoff reservation management.">
      <div className="glass-card p-4"><ReservationsTable type="airport" /></div>
    </PageShell>
  )
}

export function EventReservationsPage() {
  useDocumentTitle('Event Reservations')
  return (
    <PageShell title="Event Reservations" description="Event-based reservation scheduling and analytics.">
      <div className="glass-card p-4"><ReservationsTable type="event" /></div>
    </PageShell>
  )
}

export default ScheduledRidesPage
