import { useState } from 'react'
import { Button, DatePicker, Form, Input, Modal, Radio, Select, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  ConfirmationModal,
  createActionsColumn,
} from '@/components/admin'
import { TableFilters } from '@/components/common/TableFilters'
import {
  BROADCAST_AUDIENCE_OPTIONS,
  formatBroadcastAudience,
  getBroadcastActionItems,
  getNotificationTemplateActionItems,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_OPTIONS,
  TIER_OPTIONS,
} from '@/features/communication/communicationCenterHelpers'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  BROADCAST_TYPE_LABELS,
  useCreateBroadcastMutation,
  useCreateMessageTemplateMutation,
  useDeleteBroadcastMutation,
  useGetBroadcastsQuery,
  useGetMessageTemplatesQuery,
  useSendBroadcastNowMutation,
  useUpdateBroadcastMutation,
  useUpdateMessageTemplateMutation,
} from '@/services/communicationApi'
import type { BroadcastRecord, MessageTemplate } from '@/types/communication'
import type { BroadcastTarget, BroadcastType } from '@/types/communication'
import { formatDateTime } from '@/utils/format'

const typeOptions = Object.entries(BROADCAST_TYPE_LABELS).map(([value, label]) => ({ value, label }))

export function BroadcastsTab() {
  const adminActions = useAdminActions()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<BroadcastRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<BroadcastRecord | null>(null)
  const [sendMode, setSendMode] = useState<'schedule' | 'now'>('schedule')
  const [form] = Form.useForm<{
    title: string
    message: string
    broadcastType: BroadcastType
    target: BroadcastTarget
    targetValue?: string
    scheduledAt: dayjs.Dayjs
  }>()

  const { data = [], isLoading } = useGetBroadcastsQuery()
  const [createBroadcast, { isLoading: creating }] = useCreateBroadcastMutation()
  const [updateBroadcast, { isLoading: updating }] = useUpdateBroadcastMutation()
  const [deleteBroadcast, { isLoading: deleting }] = useDeleteBroadcastMutation()
  const [sendNow, { isLoading: sending }] = useSendBroadcastNowMutation()

  const filtered = data.filter((item) => item.title.toLowerCase().includes(search.trim().toLowerCase()))
  const target = Form.useWatch('target', form)

  const openCreate = () => {
    setEditRecord(null)
    setSendMode('schedule')
    form.resetFields()
    form.setFieldsValue({
      scheduledAt: dayjs().add(1, 'day'),
      broadcastType: 'service',
      target: 'all_drivers',
    })
    setModalOpen(true)
  }

  const openEdit = (record: BroadcastRecord) => {
    setEditRecord(record)
    setSendMode(record.status === 'scheduled' ? 'schedule' : 'now')
    form.setFieldsValue({
      title: record.title,
      message: record.message,
      broadcastType: record.broadcastType,
      target: record.target,
      targetValue: record.targetValue,
      scheduledAt: dayjs(record.sentAt),
    })
    setModalOpen(true)
  }

  const handleAction = async (key: string, record: BroadcastRecord) => {
    switch (key) {
      case 'edit':
        openEdit(record)
        break
      case 'delete':
        setDeleteRecord(record)
        break
      case 'send':
        await sendNow(record.id).unwrap()
        adminActions.notify('Broadcast sent', record.title)
        break
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload = {
      title: values.title.trim(),
      message: values.message.trim(),
      broadcastType: values.broadcastType,
      target: values.target,
      targetValue: values.targetValue?.trim(),
      scheduledAt:
        sendMode === 'now' ? new Date().toISOString() : values.scheduledAt.toISOString(),
    }
    if (editRecord) {
      const updated = await updateBroadcast({
        id: editRecord.id,
        ...payload,
        sentAt: payload.scheduledAt,
        status: sendMode === 'now' ? 'sent' : 'scheduled',
      }).unwrap()
      if (sendMode === 'now' && editRecord.status === 'scheduled') {
        await sendNow(updated.id).unwrap()
      }
      adminActions.notify('Broadcast updated', values.title)
    } else if (sendMode === 'now') {
      const created = await createBroadcast(payload).unwrap()
      await sendNow(created.id).unwrap()
      adminActions.notify('Broadcast sent', values.title)
    } else {
      await createBroadcast(payload).unwrap()
      adminActions.notify('Broadcast scheduled', values.title)
    }
    setModalOpen(false)
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TableFilters
          variant="inline"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search broadcasts..."
        />
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Create Broadcast
        </Button>
      </div>
      <Table
        loading={isLoading || creating || updating || sending}
        rowKey="id"
        dataSource={filtered}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        columns={[
          { title: 'Message Title', dataIndex: 'title' },
          {
            title: 'Audience',
            render: (_: unknown, record: BroadcastRecord) => formatBroadcastAudience(record),
          },
          {
            title: 'Scheduled Date',
            dataIndex: 'sentAt',
            render: (d: string) => formatDateTime(d),
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'sent' ? 'success' : s === 'failed' ? 'error' : 'processing'}>
                {s === 'scheduled' ? 'Scheduled' : s === 'sent' ? 'Sent' : 'Failed'}
              </Tag>
            ),
          },
          createActionsColumn<BroadcastRecord>(
            (record) => getBroadcastActionItems(record.status),
            (key, record) => void handleAction(key, record),
          ),
        ]}
      />
      <Modal
        title={editRecord ? 'Edit Broadcast' : 'Create Broadcast'}
        open={modalOpen}
        confirmLoading={creating || updating || sending}
        okText="Save"
        cancelText="Cancel"
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="Delivery">
            <Radio.Group
              value={sendMode}
              onChange={(e) => setSendMode(e.target.value)}
              options={[
                { label: 'Schedule Broadcast', value: 'schedule' },
                { label: 'Send Immediately', value: 'now' },
              ]}
            />
          </Form.Item>
          <Form.Item name="title" label="Message Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="broadcastType" label="Type" rules={[{ required: true }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item name="target" label="Target Audience" rules={[{ required: true }]}>
            <Select options={BROADCAST_AUDIENCE_OPTIONS} />
          </Form.Item>
          {(target === 'city' || target === 'state') && (
            <Form.Item name="targetValue" label={target === 'city' ? 'City' : 'State'} rules={[{ required: true }]}>
              <Input placeholder={target === 'city' ? 'e.g. San Francisco' : 'e.g. California'} />
            </Form.Item>
          )}
          {target === 'tier_based' && (
            <Form.Item name="targetValue" label="Tier" rules={[{ required: true }]}>
              <Select options={TIER_OPTIONS} placeholder="Select tier" />
            </Form.Item>
          )}
          {sendMode === 'schedule' && (
            <Form.Item name="scheduledAt" label="Scheduled Date" rules={[{ required: true }]}>
              <DatePicker showTime className="w-full" />
            </Form.Item>
          )}
        </Form>
      </Modal>
      <ConfirmationModal
        open={Boolean(deleteRecord)}
        title="Delete Broadcast"
        description={`Delete "${deleteRecord?.title}"?`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteRecord(null)}
        onConfirm={async () => {
          if (!deleteRecord) return
          await deleteBroadcast(deleteRecord.id).unwrap()
          adminActions.notify('Broadcast deleted', deleteRecord.title)
          setDeleteRecord(null)
        }}
      />
      <AdminActionHost actions={adminActions} />
    </>
  )
}

export function TemplatesTab() {
  const adminActions = useAdminActions()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<MessageTemplate | null>(null)
  const [form] = Form.useForm<{
    name: string
    category: MessageTemplate['category']
    content: string
    status: MessageTemplate['status']
  }>()

  const { data = [], isLoading } = useGetMessageTemplatesQuery()
  const [createTemplate, { isLoading: creating }] = useCreateMessageTemplateMutation()
  const [updateTemplate, { isLoading: updating }] = useUpdateMessageTemplateMutation()

  const filtered = data.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))

  const openCreate = () => {
    setEditRecord(null)
    form.resetFields()
    form.setFieldsValue({ status: 'active', category: 'trip_updates' })
    setModalOpen(true)
  }

  const openEdit = (record: MessageTemplate) => {
    setEditRecord(record)
    form.setFieldsValue({
      name: record.name,
      category: record.category,
      content: record.content,
      status: record.status,
    })
    setModalOpen(true)
  }

  const handleAction = async (key: string, record: MessageTemplate) => {
    switch (key) {
      case 'edit':
        openEdit(record)
        break
      case 'enable':
        await updateTemplate({ id: record.id, status: 'active' }).unwrap()
        adminActions.notify('Template enabled', record.name)
        break
      case 'disable':
        await updateTemplate({ id: record.id, status: 'inactive' }).unwrap()
        adminActions.notify('Template disabled', record.name)
        break
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    if (editRecord) {
      await updateTemplate({ id: editRecord.id, ...values }).unwrap()
      adminActions.notify('Template updated', values.name)
    } else {
      await createTemplate(values).unwrap()
      adminActions.notify('Template created', values.name)
    }
    setModalOpen(false)
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TableFilters
          variant="inline"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search templates..."
        />
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Create Template
        </Button>
      </div>
      <Table
        loading={isLoading || creating || updating}
        rowKey="id"
        dataSource={filtered}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        columns={[
          { title: 'Template Name', dataIndex: 'name' },
          {
            title: 'Notification Type',
            dataIndex: 'category',
            render: (c: string) => NOTIFICATION_TYPE_LABELS[c] ?? c,
          },
          { title: 'Message Content', dataIndex: 'content', ellipsis: true },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'active' ? 'success' : 'default'}>{s}</Tag>
            ),
          },
          createActionsColumn<MessageTemplate>(
            (record) => getNotificationTemplateActionItems(record.status),
            (key, record) => void handleAction(key, record),
          ),
        ]}
      />
      <Modal
        title={editRecord ? 'Edit Template' : 'Create Template'}
        open={modalOpen}
        confirmLoading={creating || updating}
        okText="Save"
        cancelText="Cancel"
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Ride Accepted" />
          </Form.Item>
          <Form.Item name="category" label="Notification Type" rules={[{ required: true }]}>
            <Select options={NOTIFICATION_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item name="content" label="Message Content" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <AdminActionHost actions={adminActions} />
    </>
  )
}
