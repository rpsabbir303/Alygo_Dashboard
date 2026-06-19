import { useState } from 'react'
import { Select, Table, Tag } from 'antd'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { TableFilters } from '@/components/common/TableFilters'
import {
  buildWaitlistDetailFields,
  getWaitlistActionItems,
  waitlistStatusColor,
} from '@/features/driver-capacity/driverCapacityHelpers'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useApproveWaitlistDriverMutation,
  useGetWaitlistDriversQuery,
  useRejectWaitlistDriverMutation,
  useRemoveWaitlistDriverMutation,
  useSetWaitlistPriorityMutation,
  WAITLIST_STATUS_LABELS,
  CITY_OPTIONS,
  STATE_OPTIONS,
} from '@/services/driverCapacityApi'
import type { WaitlistDriver } from '@/types/driverCapacity'
import { formatDate } from '@/utils/format'

const PAGE_SIZE = 10

const STATUS_OPTIONS = Object.entries(WAITLIST_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function WaitlistManagementTable() {
  const adminActions = useAdminActions()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [state, setState] = useState<string | undefined>()
  const [city, setCity] = useState<string | undefined>()
  const [status, setStatus] = useState('')
  const [removeRecord, setRemoveRecord] = useState<WaitlistDriver | null>(null)

  const { data, isLoading } = useGetWaitlistDriversQuery({
    page,
    pageSize: PAGE_SIZE,
    search,
    state: state ?? '',
    city: city ?? '',
    status,
  })

  const [approve] = useApproveWaitlistDriverMutation()
  const [reject] = useRejectWaitlistDriverMutation()
  const [setPriority] = useSetWaitlistPriorityMutation()
  const [removeDriver, { isLoading: removing }] = useRemoveWaitlistDriverMutation()

  const resetPage = () => setPage(1)

  const handleAction = (key: string, record: WaitlistDriver) => {
    switch (key) {
      case 'view':
        adminActions.openDrawer(record.driverName, buildWaitlistDetailFields(record))
        break
      case 'approve':
        approve(record.id)
          .unwrap()
          .then(() => adminActions.notify(`${record.driverName} approved`))
        break
      case 'reject':
        adminActions.openConfirm({
          title: 'Reject Application',
          description: `Reject waitlist application for ${record.driverName}?`,
          confirmLabel: 'Reject',
          danger: true,
          onConfirm: async () => {
            await reject(record.id).unwrap()
            adminActions.notify(`${record.driverName} rejected`)
          },
        })
        break
      case 'priority':
        setPriority(record.id)
          .unwrap()
          .then(() => adminActions.notify(`${record.driverName} moved to priority`))
        break
      case 'remove':
        setRemoveRecord(record)
        break
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3">
        <TableFilters
          variant="inline"
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          searchPlaceholder="Search waitlist..."
          statusOptions={STATUS_OPTIONS}
          status={status}
          onStatusChange={(value) => {
            setStatus(value ?? '')
            resetPage()
          }}
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select
            placeholder="Filter by state"
            value={state}
            onChange={(value) => {
              setState(value)
              resetPage()
            }}
            allowClear
            options={STATE_OPTIONS}
            className="!min-w-[180px]"
          />
          <Select
            placeholder="Filter by city"
            value={city}
            onChange={(value) => {
              setCity(value)
              resetPage()
            }}
            allowClear
            options={CITY_OPTIONS}
            className="!min-w-[180px]"
          />
        </div>
      </div>

      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data?.data ?? []}
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          total: data?.total ?? 0,
          pageSize: PAGE_SIZE,
          onChange: setPage,
          showSizeChanger: false,
        }}
        {...createTableRowProps<WaitlistDriver>((record) =>
          adminActions.openDrawer(record.driverName, buildWaitlistDetailFields(record)),
        )}
        columns={[
          { title: 'Driver Name', dataIndex: 'driverName' },
          {
            title: 'Application Date',
            dataIndex: 'applicationDate',
            render: (d: string) => formatDate(d),
          },
          { title: 'Position', dataIndex: 'position', width: 90 },
          { title: 'City', dataIndex: 'city' },
          { title: 'State', dataIndex: 'state' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={waitlistStatusColor(s)}>
                {WAITLIST_STATUS_LABELS[s as keyof typeof WAITLIST_STATUS_LABELS] ?? s}
              </Tag>
            ),
          },
          createActionsColumn<WaitlistDriver>(
            (record) => getWaitlistActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      <ConfirmationModal
        open={Boolean(removeRecord)}
        title="Remove From Waitlist"
        description={`Remove ${removeRecord?.driverName} from the waitlist?`}
        confirmLabel="Remove"
        danger
        loading={removing}
        onCancel={() => setRemoveRecord(null)}
        onConfirm={async () => {
          if (!removeRecord) return
          await removeDriver(removeRecord.id).unwrap()
          adminActions.notify(`${removeRecord.driverName} removed from waitlist`)
          setRemoveRecord(null)
        }}
      />

      <AdminActionHost actions={adminActions} />
    </>
  )
}
