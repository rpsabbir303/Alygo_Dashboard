import { useState } from 'react'
import { Form, InputNumber, Modal, Table, Tag } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetNoShowPoliciesQuery,
  useUpdateNoShowPolicyMutation,
} from '@/services/cancellationApi'
import { RIDE_CATEGORY_LABELS } from '@/constants'
import type { NoShowPolicy } from '@/types/cancellation'
import type { RideCategory } from '@/types'
import { formatCurrency } from '@/utils/format'
import {
  buildNoShowDetailFields,
  getNoShowActionItems,
  openPolicyDrawer,
} from '@/features/cancellations/cancellationHelpers'

export function NoShowPolicyTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetNoShowPoliciesQuery()
  const [editRecord, setEditRecord] = useState<NoShowPolicy | null>(null)
  const [updatePolicy, { isLoading: updating }] = useUpdateNoShowPolicyMutation()

  const handleAction = (key: string, record: NoShowPolicy) => {
    switch (key) {
      case 'view':
        openPolicyDrawer('No Show Policy', buildNoShowDetailFields(record), adminActions)
        break
      case 'edit':
        setEditRecord(record)
        break
      case 'activate':
        updatePolicy({ id: record.id, status: 'active' }).unwrap()
          .then(() => adminActions.notify('No show policy activated'))
        break
      case 'deactivate':
        updatePolicy({ id: record.id, status: 'inactive' }).unwrap()
          .then(() => adminActions.notify('No show policy deactivated'))
        break
    }
  }

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        {...createTableRowProps<NoShowPolicy>((record) =>
          openPolicyDrawer('No Show Policy', buildNoShowDetailFields(record), adminActions),
        )}
        columns={[
          {
            title: 'Ride Category',
            dataIndex: 'rideCategory',
            render: (c: RideCategory) => <Tag>{RIDE_CATEGORY_LABELS[c]}</Tag>,
          },
          { title: 'Wait Time', dataIndex: 'waitTimeMinutes', render: (m: number) => `${m} minutes` },
          { title: 'No Show Fee', dataIndex: 'noShowFee', render: (f: number) => formatCurrency(f) },
          { title: 'Driver Compensation', dataIndex: 'driverCompensation', render: (f: number) => formatCurrency(f) },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<NoShowPolicy>(
            (record) => getNoShowActionItems(record),
            (key, record) => handleAction(key, record),
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit No Show Policy — ${RIDE_CATEGORY_LABELS[editRecord.rideCategory]}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            const form = document.getElementById('noshow-edit-form') as HTMLFormElement | null
            form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }}
          destroyOnClose
        >
          <Form
            id="noshow-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={{
              waitTimeMinutes: editRecord.waitTimeMinutes,
              noShowFee: editRecord.noShowFee,
              driverCompensation: editRecord.driverCompensation,
            }}
            onFinish={async (values) => {
              await updatePolicy({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('No show policy updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="waitTimeMinutes" label="Wait Time (minutes)" rules={[{ required: true }]}>
              <InputNumber min={1} max={30} className="w-full" />
            </Form.Item>
            <Form.Item name="noShowFee" label="No Show Fee" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="$" className="w-full" />
            </Form.Item>
            <Form.Item name="driverCompensation" label="Driver Compensation" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="$" className="w-full" />
            </Form.Item>
            <button type="submit" className="hidden" />
          </Form>
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
