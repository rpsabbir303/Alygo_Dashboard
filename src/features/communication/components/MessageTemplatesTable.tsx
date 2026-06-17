import { useState } from 'react'
import { Form, Input, Modal, Select, Table, Tag } from 'antd'
import { Pencil, Trash2 } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
} from '@/components/admin'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  CATEGORY_LABELS,
  useCreateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useGetMessageTemplatesQuery,
  useUpdateMessageTemplateMutation,
} from '@/services/communicationApi'
import type { MessageTemplate } from '@/types/communication'

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))

export function MessageTemplatesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetMessageTemplatesQuery()
  const [editRecord, setEditRecord] = useState<MessageTemplate | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateTemplate, { isLoading: updating }] = useUpdateMessageTemplateMutation()
  const [createTemplate, { isLoading: creating }] = useCreateMessageTemplateMutation()
  const [deleteTemplate] = useDeleteMessageTemplateMutation()

  const handleDelete = (id: string, name: string) => {
    adminActions.openConfirm({
      title: 'Delete Template',
      description: `Delete template "${name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        await deleteTemplate(id).unwrap()
        adminActions.notify('Template deleted')
      },
    })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-alygo-text-muted">
          Quick response templates for support agents. Insert templates directly into chat conversations.
        </p>
        <button type="button" onClick={() => setCreateOpen(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
          Create Template
        </button>
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        columns={[
          { title: 'Template Name', dataIndex: 'name' },
          { title: 'Category', dataIndex: 'category', render: (c: string) => <Tag>{CATEGORY_LABELS[c] ?? c}</Tag> },
          { title: 'Content', dataIndex: 'content', ellipsis: true },
          { title: 'Usage', dataIndex: 'usageCount' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s}</Tag> },
          createActionsColumn<MessageTemplate>(
            () => [
              { key: 'edit', label: 'Edit', icon: Pencil },
              { key: 'delete', label: 'Delete', icon: Trash2, danger: true, group: 2 },
            ],
            (key, record) => {
              if (key === 'edit') setEditRecord(record)
              if (key === 'delete') handleDelete(record.id, record.name)
            },
          ),
        ]}
      />

      {(editRecord || createOpen) && (
        <Modal
          title={editRecord ? `Edit Template — ${editRecord.name}` : 'Create Template'}
          open
          confirmLoading={updating || creating}
          onCancel={() => { setEditRecord(null); setCreateOpen(false) }}
          onOk={() => {
            document.getElementById('template-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }}
          destroyOnClose
        >
          <Form
            id="template-form"
            layout="vertical"
            className="mt-4"
            initialValues={editRecord ?? { status: 'active', category: 'general' }}
            onFinish={async (values) => {
              if (editRecord) {
                await updateTemplate({ id: editRecord.id, ...values }).unwrap()
                adminActions.notify('Template updated')
                setEditRecord(null)
              } else {
                await createTemplate(values).unwrap()
                adminActions.notify('Template created')
                setCreateOpen(false)
              }
            }}
          >
            <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select options={categoryOptions} />
            </Form.Item>
            <Form.Item name="content" label="Message Content" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
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
