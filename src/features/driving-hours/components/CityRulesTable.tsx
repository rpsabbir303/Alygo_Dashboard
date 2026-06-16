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
  useGetCityDrivingRulesQuery,
  useUpdateCityDrivingRuleMutation,
} from '@/services/drivingHoursApi'
import type { CityDrivingRule } from '@/types/drivingHours'
import {
  buildCityRuleFields,
  getCityRuleActionItems,
} from '@/features/driving-hours/drivingHoursHelpers'

export function CityRulesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetCityDrivingRulesQuery()
  const [editRecord, setEditRecord] = useState<CityDrivingRule | null>(null)
  const [updateRule, { isLoading: updating }] = useUpdateCityDrivingRuleMutation()

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        {...createTableRowProps<CityDrivingRule>((record) =>
          adminActions.openDrawer('City Driving Rule', buildCityRuleFields(record)),
        )}
        columns={[
          { title: 'City', dataIndex: 'city' },
          { title: 'State', dataIndex: 'state' },
          { title: 'Max Driving Hours', dataIndex: 'maxDrivingHours' },
          { title: 'Required Reset Hours', dataIndex: 'requiredResetHours' },
          { title: 'Warning Threshold', dataIndex: 'warningThresholdHours' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<CityDrivingRule>(
            () => getCityRuleActionItems(),
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit City Rule — ${editRecord.city}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('city-rule-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="city-rule-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateRule({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('City rule updated')
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
