import { useState } from 'react'
import { Form, Input, Modal, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetWarningMessagesQuery,
  useUpdateWarningMessageMutation,
} from '@/services/cancellationApi'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import type { PassengerWarningMessage } from '@/types/cancellation'
import type { RideCategory } from '@/types'
import {
  buildWarningDetailFields,
  getWarningActionItems,
  openPolicyDrawer,
} from '@/features/cancellations/cancellationHelpers'

export function WarningMessageTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetWarningMessagesQuery()
  const [editRecord, setEditRecord] = useState<PassengerWarningMessage | null>(null)
  const [updateMessage, { isLoading: updating }] = useUpdateWarningMessageMutation()

  const handleAction = (key: string, record: PassengerWarningMessage) => {
    switch (key) {
      case 'view':
        openPolicyDrawer('Passenger Warning', buildWarningDetailFields(record), adminActions)
        break
      case 'edit':
        setEditRecord(record)
        break
      case 'activate':
        updateMessage({ id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('Warning message activated'))
        break
      case 'deactivate':
        updateMessage({ id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('Warning message deactivated'))
        break
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        {...createTableRowProps<PassengerWarningMessage>((record) =>
          openPolicyDrawer('Passenger Warning', buildWarningDetailFields(record), adminActions),
        )}
        columns={[
          { title: 'Message', dataIndex: 'message', ellipsis: true },
          {
            title: 'Ride Category',
            dataIndex: 'rideCategory',
            render: (c: RideCategory) => <Tag>{RIDE_CATEGORY_LABELS[c]}</Tag>,
          },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<PassengerWarningMessage>(
            (record) => getWarningActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Warning — ${RIDE_CATEGORY_LABELS[editRecord.rideCategory]}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('warning-edit-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="warning-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={{ message: editRecord.message }}
            onFinish={async (values) => {
              await updateMessage({ id: editRecord.id, message: values.message }).unwrap()
              adminActions.notify('Warning message updated')
              setEditRecord(null)
            }}
          >
            <Form.Item
              name="message"
              label="Passenger Warning Message"
              rules={[{ required: true, message: 'Message is required' }]}
            >
              <Input.TextArea rows={3} placeholder="A cancellation fee may apply if you cancel this ride now." />
            </Form.Item>
            <button type="submit" className="hidden" />
          </Form>
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
