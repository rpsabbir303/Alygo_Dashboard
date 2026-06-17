import { useState } from 'react'
import { Form, Input, Modal, Select, Table, Tag } from 'antd'
import { Plus } from 'lucide-react'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  NOTE_TYPE_LABELS,
  useCreateInternalNoteMutation,
  useGetInternalNotesQuery,
} from '@/services/communicationApi'

const noteTypeOptions = Object.entries(NOTE_TYPE_LABELS).map(([value, label]) => ({ value, label }))

export function InternalNotesTable() {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetInternalNotesQuery()
  const [createOpen, setCreateOpen] = useState(false)
  const [createNote, { isLoading: creating }] = useCreateInternalNoteMutation()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-alygo-text-muted">
          Internal staff notes visible only to admin teams. Not visible to drivers or passengers.
        </p>
        <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">
          <Plus className="h-4 w-4" /> Add Note
        </button>
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1100 }}
        columns={[
          { title: 'User', dataIndex: 'userName' },
          { title: 'Type', dataIndex: 'userType', render: (t: string) => <Tag>{t}</Tag> },
          { title: 'Note Type', dataIndex: 'noteType', render: (t: string) => <Tag color="purple">{NOTE_TYPE_LABELS[t] ?? t}</Tag> },
          { title: 'Content', dataIndex: 'content', ellipsis: true },
          { title: 'Author', dataIndex: 'author' },
          { title: 'Trip ID', dataIndex: 'tripId', render: (t?: string) => t ?? '—' },
          { title: 'Created', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
        ]}
      />

      <Modal
        title="Add Internal Note"
        open={createOpen}
        confirmLoading={creating}
        onCancel={() => setCreateOpen(false)}
        onOk={() => document.getElementById('note-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
        destroyOnClose
      >
        <Form
          id="note-form"
          layout="vertical"
          className="mt-4"
          initialValues={{ userType: 'passenger', noteType: 'support' }}
          onFinish={async (values) => {
            await createNote(values).unwrap()
            adminActions.notify('Internal note added')
            setCreateOpen(false)
          }}
        >
          <Form.Item name="userName" label="User Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userType" label="User Type" rules={[{ required: true }]}>
            <Select options={[{ value: 'driver', label: 'Driver' }, { value: 'passenger', label: 'Passenger' }]} />
          </Form.Item>
          <Form.Item name="noteType" label="Note Type" rules={[{ required: true }]}>
            <Select options={noteTypeOptions} />
          </Form.Item>
          <Form.Item name="content" label="Note Content" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="tripId" label="Trip ID (optional)">
            <Input />
          </Form.Item>
          <button type="submit" className="hidden" />
        </Form>
      </Modal>
    </>
  )
}
