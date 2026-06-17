import { useState } from 'react'
import { Form, Input, InputNumber, Modal, Select, Table } from 'antd'
import { Pencil } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetEscalationRulesQuery,
  useUpdateEscalationRuleMutation,
} from '@/services/safetyIncidentApi'
import type { EscalationRule } from '@/types/safetyIncident'

export function EscalationRulesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetEscalationRulesQuery()
  const [editRecord, setEditRecord] = useState<EscalationRule | null>(null)
  const [updateRule, { isLoading: updating }] = useUpdateEscalationRuleMutation()

  return (
    <>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Define automatic escalation triggers when incidents are not resolved within configured timeframes.
      </p>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        columns={[
          { title: 'Rule Name', dataIndex: 'name' },
          { title: 'Trigger Condition', dataIndex: 'triggerCondition', ellipsis: true },
          { title: 'Escalate After', dataIndex: 'escalateAfterMinutes', render: (m: number) => `${m} min` },
          { title: 'Escalate To', dataIndex: 'escalateTo' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<EscalationRule>(
            () => [{ key: 'edit', label: 'Edit', icon: Pencil }],
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Rule — ${editRecord.name}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('escalation-edit-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="escalation-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateRule({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Escalation rule updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="triggerCondition" label="Trigger Condition" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="escalateAfterMinutes" label="Escalate After (minutes)" rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="escalateTo" label="Escalate To" rules={[{ required: true }]}>
              <Input />
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
