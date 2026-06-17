import { useState } from 'react'
import { Form, InputNumber, Modal, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useApproveWaitlistDriverMutation,
  useGetWaitlistDriversQuery,
  useMoveWaitlistPositionMutation,
  usePriorityApproveWaitlistDriverMutation,
  useRejectWaitlistDriverMutation,
  WAITLIST_STATUS_LABELS,
} from '@/services/driverCapacityApi'
import type { WaitlistDriver } from '@/types/driverCapacity'
import {
  buildWaitlistDetailFields,
  getWaitlistActionItems,
  waitlistStatusColor,
} from '@/features/driver-capacity/driverCapacityHelpers'

export function WaitlistManagementTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetWaitlistDriversQuery()
  const [moveRecord, setMoveRecord] = useState<WaitlistDriver | null>(null)
  const [newPosition, setNewPosition] = useState(1)

  const [approve] = useApproveWaitlistDriverMutation()
  const [reject] = useRejectWaitlistDriverMutation()
  const [priorityApprove] = usePriorityApproveWaitlistDriverMutation()
  const [movePosition, { isLoading: moving }] = useMoveWaitlistPositionMutation()

  const handleAction = (key: string, record: WaitlistDriver) => {
    switch (key) {
      case 'view':
        adminActions.openDrawer(record.driverName, buildWaitlistDetailFields(record))
        break
      case 'approve':
        approve(record.id).unwrap()
          .then(() => adminActions.notify(`${record.driverName} approved`))
        break
      case 'priority-approve':
        priorityApprove(record.id).unwrap()
          .then(() => adminActions.notify(`${record.driverName} priority approved`))
        break
      case 'move':
        setMoveRecord(record)
        setNewPosition(record.position)
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
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1100 }}
        {...createTableRowProps<WaitlistDriver>((record) =>
          adminActions.openDrawer(record.driverName, buildWaitlistDetailFields(record)),
        )}
        columns={[
          { title: 'Driver Name', dataIndex: 'driverName' },
          {
            title: 'Application Date',
            dataIndex: 'applicationDate',
            render: (d: string) => new Date(d).toLocaleDateString(),
          },
          { title: 'Position', dataIndex: 'position', width: 90 },
          { title: 'City', dataIndex: 'city' },
          { title: 'State', dataIndex: 'state' },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={waitlistStatusColor(s)}>{WAITLIST_STATUS_LABELS[s as keyof typeof WAITLIST_STATUS_LABELS] ?? s}</Tag>
            ),
          },
          createActionsColumn<WaitlistDriver>(
            (record) => getWaitlistActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      <Modal
        title={`Move Position — ${moveRecord?.driverName}`}
        open={Boolean(moveRecord)}
        confirmLoading={moving}
        onCancel={() => setMoveRecord(null)}
        onOk={async () => {
          if (!moveRecord) return
          await movePosition({ id: moveRecord.id, position: newPosition }).unwrap()
          adminActions.notify(`Position updated for ${moveRecord.driverName}`)
          setMoveRecord(null)
        }}
        destroyOnClose
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="New Queue Position">
            <InputNumber min={1} className="w-full" value={newPosition} onChange={(v) => setNewPosition(v ?? 1)} />
          </Form.Item>
        </Form>
      </Modal>

      <AdminActionHost actions={adminActions} />
    </>
  )
}
