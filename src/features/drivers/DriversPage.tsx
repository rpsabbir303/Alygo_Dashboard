import { Table, Tag, type TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getDriverManagementActionItems,
  handleDriverAction,
  openDriverDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TableFilters } from '@/components/common/TableFilters'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetDriversQuery } from '@/services/api'
import type { Driver } from '@/types'

export default function DriversPage() {
  useDocumentTitle('Driver Management')
  const adminActions = useAdminActions()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data, isLoading } = useGetDriversQuery({ page, pageSize: 10, search })

  const filtered = status ? data?.data.filter((d) => d.status === status) : data?.data

  const columns: TableProps<Driver>['columns'] = [
    { title: 'Driver Name', dataIndex: 'name', render: (name, record) => <Link to={`/drivers/${record.id}`} onClick={(e) => e.stopPropagation()}>{name}</Link> },
    { title: 'Driver ID', dataIndex: 'id' },
    { title: 'Rating', dataIndex: 'rating', render: (r: number) => `${r} ★` },
    { title: 'Completed Trips', dataIndex: 'completedTrips' },
    { title: 'Vehicle', dataIndex: 'vehicle' },
    {
      title: 'Ride Categories',
      dataIndex: 'categories',
      render: (cats: Driver['categories']) => cats.map((c) => <Tag key={c}>{RIDE_CATEGORY_LABELS[c]}</Tag>),
    },
    { title: 'Compliance', dataIndex: 'complianceStatus', render: (s: string) => <StatusBadge status={s} /> },
    { title: 'Background Check', dataIndex: 'backgroundCheckStatus', render: (s: string) => <StatusBadge status={s} /> },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
    createActionsColumn(
      () => getDriverManagementActionItems(),
      (key, record) => handleDriverAction(key, record, adminActions),
    ),
  ]

  return (
    <PageShell title="Driver Management" description="Manage driver onboarding, compliance, and lifecycle.">
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search drivers..."
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Pending', value: 'pending' },
          { label: 'Suspended', value: 'suspended' },
          { label: 'Deactivated', value: 'deactivated' },
        ]}
      />
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          scroll={{ x: 1300 }}
          {...createTableRowProps<Driver>((record) => openDriverDetails(record, adminActions))}
          pagination={{
            current: page,
            total: data?.total,
            pageSize: 10,
            onChange: setPage,
            showSizeChanger: false,
          }}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
