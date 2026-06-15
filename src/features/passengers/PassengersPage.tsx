import { Table, type TableProps } from 'antd'
import { Link } from 'react-router-dom'
import { useState } from 'react'
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
import { TableFilters } from '@/components/common/TableFilters'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetPassengersQuery } from '@/services/api'
import type { Passenger } from '@/types'
import { formatCurrency } from '@/utils/format'

export default function PassengersPage() {
  useDocumentTitle('Passenger Management')
  const adminActions = useAdminActions()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useGetPassengersQuery({ page, pageSize: 10, search })

  const columns: TableProps<Passenger>['columns'] = [
    { title: 'Name', dataIndex: 'name', render: (name, record) => <Link to={`/passengers/${record.id}`} onClick={(e) => e.stopPropagation()}>{name}</Link> },
    { title: 'Passenger ID', dataIndex: 'id' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Rating', dataIndex: 'rating', render: (r: number) => `${r} ★` },
    { title: 'Trips', dataIndex: 'completedTrips' },
    { title: 'Wallet', dataIndex: 'walletBalance', render: (v: number) => formatCurrency(v) },
    { title: 'City', dataIndex: 'city' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
    createActionsColumn(
      () => getPassengerActionItems(),
      (key, record) => handlePassengerAction(key, record, adminActions),
    ),
  ]

  return (
    <PageShell title="Passenger Management" description="Manage passenger accounts, wallets, and support actions.">
      <TableFilters search={search} onSearchChange={setSearch} searchPlaceholder="Search passengers..." />
      <div className="glass-card p-4">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data?.data}
          rowKey="id"
          scroll={{ x: 1100 }}
          {...createTableRowProps<Passenger>((record) => openPassengerDetails(record, adminActions))}
          pagination={{ current: page, total: data?.total, pageSize: 10, onChange: setPage }}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
