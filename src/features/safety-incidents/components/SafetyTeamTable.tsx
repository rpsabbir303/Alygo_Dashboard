import { useState } from 'react'
import { Form, Input, Modal, Select, Table } from 'antd'
import { Pencil } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetSafetyTeamQuery,
  useUpdateSafetyTeamMemberMutation,
} from '@/services/safetyIncidentApi'
import type { SafetyTeamMember } from '@/types/safetyIncident'

export function SafetyTeamTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetSafetyTeamQuery()
  const [editRecord, setEditRecord] = useState<SafetyTeamMember | null>(null)
  const [updateMember, { isLoading: updating }] = useUpdateSafetyTeamMemberMutation()

  return (
    <>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Manage safety team members available for incident assignment and escalation.
      </p>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 900 }}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Role', dataIndex: 'role' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Shift', dataIndex: 'shift' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<SafetyTeamMember>(
            () => [{ key: 'edit', label: 'Edit', icon: Pencil }],
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Team Member — ${editRecord.name}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('team-edit-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="team-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateMember({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Team member updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="shift" label="Shift" rules={[{ required: true }]}>
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
