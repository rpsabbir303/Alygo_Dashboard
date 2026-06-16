import { useState } from 'react'
import { Form, InputNumber, Modal, Select, Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetStateDrivingRulesQuery,
  useUpdateStateDrivingRuleMutation,
} from '@/services/drivingHoursApi'
import type { StateDrivingRule } from '@/types/drivingHours'
import {
  buildStateRuleFields,
  getStateRuleActionItems,
} from '@/features/driving-hours/drivingHoursHelpers'

function openRuleDrawer(title: string, record: StateDrivingRule, adminActions: ReturnType<typeof useAdminActions>) {
  adminActions.openDrawer(title, buildStateRuleFields(record))
}

export function StateRulesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetStateDrivingRulesQuery()
  const [editRecord, setEditRecord] = useState<StateDrivingRule | null>(null)
  const [updateRule, { isLoading: updating }] = useUpdateStateDrivingRuleMutation()

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        {...createTableRowProps<StateDrivingRule>((record) =>
          openRuleDrawer('State Driving Rule', record, adminActions),
        )}
        columns={[
          { title: 'State', dataIndex: 'state' },
          { title: 'Max Driving Hours', dataIndex: 'maxDrivingHours' },
          { title: 'Required Reset Hours', dataIndex: 'requiredResetHours' },
          { title: 'Warning Threshold', dataIndex: 'warningThresholdHours' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<StateDrivingRule>(
            () => getStateRuleActionItems(),
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit State Rule — ${editRecord.state}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('state-rule-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="state-rule-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateRule({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('State rule updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="maxDrivingHours" label="Max Driving Hours" rules={[{ required: true }]}>
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>
            <Form.Item name="requiredResetHours" label="Required Reset Hours" rules={[{ required: true }]}>
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>
            <Form.Item name="warningThresholdHours" label="Warning Threshold" rules={[{ required: true }]}>
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
            </Form.Item>
            <button type="submit" className="hidden" />
          </Form>
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
