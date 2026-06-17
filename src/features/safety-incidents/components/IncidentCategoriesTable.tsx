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
  useGetIncidentCategoriesQuery,
  useUpdateIncidentCategoryMutation,
} from '@/services/safetyIncidentApi'
import type { IncidentCategory } from '@/types/safetyIncident'
import { priorityLabel } from '@/features/safety-incidents/safetyIncidentHelpers'

const priorityOptions = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function IncidentCategoriesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetIncidentCategoriesQuery()
  const [editRecord, setEditRecord] = useState<IncidentCategory | null>(null)
  const [updateCategory, { isLoading: updating }] = useUpdateIncidentCategoryMutation()

  return (
    <>
      <p className="mb-4 text-sm text-alygo-text-muted">
        Configure incident categories and default priority levels for safety case classification.
      </p>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 800 }}
        columns={[
          { title: 'Category', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description', ellipsis: true },
          { title: 'Default Priority', dataIndex: 'defaultPriority', render: (p: string) => priorityLabel(p) },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          createActionsColumn<IncidentCategory>(
            () => [{ key: 'edit', label: 'Edit', icon: Pencil }],
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      {editRecord && (
        <Modal
          title={`Edit Category — ${editRecord.name}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById('category-edit-form')?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <Form
            id="category-edit-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord}
            onFinish={async (values) => {
              await updateCategory({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Category updated')
              setEditRecord(null)
            }}
          >
            <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="defaultPriority" label="Default Priority" rules={[{ required: true }]}>
              <Select options={priorityOptions} />
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
