import { useState } from 'react'
import { Form, Input, InputNumber, Modal, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetCancellationFeesQuery,
  useUpdateCancellationFeeMutation,
} from '@/services/cancellationApi'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import type { CancellationFee } from '@/types/cancellation'
import type { RideCategory } from '@/types'
import { formatCurrency } from '@/utils/format'
import {
  buildFeeDetailFields,
  getFeeActionItems,
  openPolicyDrawer,
} from '@/features/cancellations/cancellationHelpers'

export function CancellationFeeTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetCancellationFeesQuery()
  const [editRecord, setEditRecord] = useState<CancellationFee | null>(null)
  const [updateFee, { isLoading: updating }] = useUpdateCancellationFeeMutation()

  const handleAction = (key: string, record: CancellationFee) => {
    switch (key) {
      case 'view':
        openPolicyDrawer('Cancellation Fee', buildFeeDetailFields(record), adminActions)
        break
      case 'edit':
        setEditRecord(record)
        break
      case 'activate':
        updateFee({ id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('Fee enabled'))
        break
      case 'deactivate':
        updateFee({ id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('Fee disabled'))
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
        {...createTableRowProps<CancellationFee>((record) =>
          openPolicyDrawer('Cancellation Fee', buildFeeDetailFields(record), adminActions),
        )}
        columns={[
          {
            title: 'Ride Category',
            dataIndex: 'rideCategory',
            render: (c: RideCategory) => <Tag>{RIDE_CATEGORY_LABELS[c]}</Tag>,
          },
          { title: 'Cancellation Fee', dataIndex: 'fee', render: (f: number) => formatCurrency(f) },
          { title: 'Driver Compensation', dataIndex: 'driverCompensation', render: (f: number) => formatCurrency(f) },
          { title: 'Passenger Warning Message', dataIndex: 'warningMessage', ellipsis: true },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<CancellationFee>(
            (record) => getFeeActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Fee — ${RIDE_CATEGORY_LABELS[editRecord.rideCategory]}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            const form = document.getElementById('fee-edit-form') as HTMLFormElement | null
            form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }}
          destroyOnClose
        >
          <Form
            id="fee-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={{
              fee: editRecord.fee,
              driverCompensation: editRecord.driverCompensation,
              warningMessage: editRecord.warningMessage,
            }}
            onFinish={async (values) => {
              await updateFee({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Cancellation fee updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="fee" label="Cancellation Fee" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="$" className="w-full" />
            </Form.Item>
            <Form.Item name="driverCompensation" label="Driver Compensation" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="$" className="w-full" />
            </Form.Item>
            <Form.Item name="warningMessage" label="Passenger Warning Message" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <button type="submit" className="hidden" />
          </Form>
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
