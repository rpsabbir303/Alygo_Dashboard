import { useEffect, useState } from 'react'
import { Segmented, Table, Tag } from 'antd'
import { createActionsColumn, createTableRowProps } from '@/components/admin'
import { TableFilters } from '@/components/common/TableFilters'
import { CommunicationConversationDrawer } from '@/features/communication/components/CommunicationConversationDrawer'
import {
  getInboxActionItems,
  priorityColor,
  priorityLabel,
  statusColor,
  statusLabel,
} from '@/features/communication/communicationCenterHelpers'
import type { CommunicationTabKey } from '@/features/communication/communicationNavigation'
import { INBOX_TAB_TYPE_MAP } from '@/features/communication/communicationNavigation'
import {
  COMMUNICATION_TYPE_LABELS,
  useGetCommunicationInboxQuery,
} from '@/services/communicationApi'
import type { CommunicationInboxItem, CommunicationInboxType } from '@/types/communication'
import { formatRelativeActivity } from '@/features/communication/communicationHelpers'
import { formatDateTime } from '@/utils/format'

const PAGE_SIZE = 10

const TYPE_FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Driver', value: 'driver' },
  { label: 'Passenger', value: 'passenger' },
  { label: 'Support', value: 'support' },
  { label: 'Safety', value: 'safety' },
  { label: 'Broadcast', value: 'broadcast' },
]

interface CommunicationInboxTabProps {
  tabKey: CommunicationTabKey
}

export function CommunicationInboxTab({ tabKey }: CommunicationInboxTabProps) {
  const tabTypeFilter = INBOX_TAB_TYPE_MAP[tabKey] ?? ''
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState(tabTypeFilter)
  const [selected, setSelected] = useState<CommunicationInboxItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setTypeFilter(INBOX_TAB_TYPE_MAP[tabKey] ?? '')
    setPage(1)
  }, [tabKey])

  const effectiveType = tabTypeFilter || typeFilter

  const { data, isLoading } = useGetCommunicationInboxQuery({
    page,
    pageSize: PAGE_SIZE,
    search,
    communicationType: effectiveType,
  })

  const openDrawer = (record: CommunicationInboxItem) => {
    setSelected(record)
    setDrawerOpen(true)
  }

  return (
    <>
      <TableFilters
        variant="inline"
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder="Search user, ticket ID, or subject..."
      />
      {!tabTypeFilter && (
        <div className="mb-4 mt-3">
          <Segmented
            options={TYPE_FILTER_OPTIONS}
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(String(value))
              setPage(1)
            }}
          />
        </div>
      )}
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data?.data ?? []}
        scroll={{ x: 1100 }}
        pagination={{
          current: page,
          total: data?.total ?? 0,
          pageSize: PAGE_SIZE,
          onChange: setPage,
          showSizeChanger: false,
        }}
        {...createTableRowProps<CommunicationInboxItem>(openDrawer)}
        columns={[
          {
            title: 'User / Group',
            dataIndex: 'userOrGroup',
            render: (name: string, record: CommunicationInboxItem) => (
              <span>
                {name}
                {record.unreadCount > 0 && (
                  <Tag color="processing" className="ml-2">
                    {record.unreadCount} new
                  </Tag>
                )}
              </span>
            ),
          },
          {
            title: 'Communication Type',
            dataIndex: 'communicationType',
            render: (t: CommunicationInboxType) => (
              <Tag>{COMMUNICATION_TYPE_LABELS[t] ?? t}</Tag>
            ),
          },
          { title: 'Subject', dataIndex: 'subject', ellipsis: true },
          {
            title: 'Priority',
            dataIndex: 'priority',
            render: (p: string) => <Tag color={priorityColor(p)}>{priorityLabel(p)}</Tag>,
          },
          {
            title: 'Last Activity',
            dataIndex: 'lastActivity',
            render: (d: string) => (
              <span title={formatDateTime(d)}>{formatRelativeActivity(d)}</span>
            ),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => <Tag color={statusColor(s)}>{statusLabel(s)}</Tag>,
          },
          createActionsColumn<CommunicationInboxItem>(
            () => getInboxActionItems(),
            (key, record) => {
              if (key === 'view') openDrawer(record)
            },
          ),
        ]}
      />
      <CommunicationConversationDrawer
        item={selected}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelected(null)
        }}
      />
    </>
  )
}
