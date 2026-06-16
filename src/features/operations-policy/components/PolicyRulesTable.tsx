import { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Select, Table } from 'antd'
import { Plus } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
} from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  CATEGORY_LABELS,
  useCreateOperationsPolicyMutation,
  useGetOperationsPoliciesQuery,
  useUpdateOperationsPolicyMutation,
} from '@/services/operationsPolicyApi'
import type { OperationsPolicyCategory, OperationsPolicyRule } from '@/types/operationsPolicy'
import { buildPolicyFields, getPolicyActionItems } from '@/features/operations-policy/operationsPolicyHelpers'

interface PolicyRulesTableProps {
  category: OperationsPolicyCategory
}

export function PolicyRulesTable({ category }: PolicyRulesTableProps) {
  const adminActions = useAdminActions()
  const { data = [], isLoading } = useGetOperationsPoliciesQuery(category)
  const [editRecord, setEditRecord] = useState<OperationsPolicyRule | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [updatePolicy, { isLoading: updating }] = useUpdateOperationsPolicyMutation()
  const [createPolicy, { isLoading: creating }] = useCreateOperationsPolicyMutation()

  const PolicyForm = ({
    id,
    initialValues,
    onFinish,
  }: {
    id: string
    initialValues?: Partial<OperationsPolicyRule>
    onFinish: (values: Partial<OperationsPolicyRule>) => void
  }) => (
    <Form
      id={id}
      layout="vertical"
      className="mt-4"
      initialValues={{ status: 'active', category, ...initialValues }}
      onFinish={onFinish}
    >
      <Form.Item name="name" label="Policy Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="value" label="Display Value" rules={[{ required: true }]}>
        <Input placeholder="e.g. 12 hours" />
      </Form.Item>
      <Form.Item name="numericValue" label="Numeric Value">
        <InputNumber className="w-full" />
      </Form.Item>
      <Form.Item name="unit" label="Unit">
        <Input placeholder="hours, percent, USD, etc." />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true }]}>
        <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
      </Form.Item>
      <button type="submit" className="hidden" />
    </Form>
  )

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Add Policy
        </Button>
      </div>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={data}
        scroll={{ x: 1000 }}
        {...createTableRowProps<OperationsPolicyRule>((record) =>
          adminActions.openDrawer(record.name, buildPolicyFields(record)),
        )}
        columns={[
          { title: 'Policy Name', dataIndex: 'name' },
          { title: 'Description', dataIndex: 'description', ellipsis: true },
          { title: 'Value', dataIndex: 'value' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            render: (d: string) => new Date(d).toLocaleDateString(),
          },
          createActionsColumn<OperationsPolicyRule>(
            () => getPolicyActionItems(),
            (key, record) => { if (key === 'edit') setEditRecord(record) },
          ),
        ]}
      />

      <Modal
        title={`Add ${CATEGORY_LABELS[category]}`}
        open={createOpen}
        confirmLoading={creating}
        onCancel={() => setCreateOpen(false)}
        onOk={() => {
          document.getElementById(`policy-create-${category}`)?.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true }),
          )
        }}
        destroyOnClose
      >
        <PolicyForm
          id={`policy-create-${category}`}
          onFinish={async (values) => {
            await createPolicy({
              category,
              name: values.name!,
              description: values.description!,
              value: values.value!,
              numericValue: values.numericValue,
              unit: values.unit,
              status: values.status ?? 'active',
            }).unwrap()
            adminActions.notify('Policy created')
            setCreateOpen(false)
          }}
        />
      </Modal>

      {editRecord && (
        <Modal
          title={`Edit Policy — ${editRecord.name}`}
          open
          confirmLoading={updating}
          onCancel={() => setEditRecord(null)}
          onOk={() => {
            document.getElementById(`policy-edit-${category}`)?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true }),
            )
          }}
          destroyOnClose
        >
          <PolicyForm
            id={`policy-edit-${category}`}
            initialValues={editRecord}
            onFinish={async (values) => {
              await updatePolicy({ id: editRecord.id, ...values }).unwrap()
              adminActions.notify('Policy updated')
              setEditRecord(null)
            }}
          />
        </Modal>
      )}

      <AdminActionHost actions={adminActions} />
    </>
  )
}
