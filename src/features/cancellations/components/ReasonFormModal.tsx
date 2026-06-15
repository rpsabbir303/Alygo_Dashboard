import { Form, Input, Modal } from 'antd'

export interface ReasonFormValues {
  name: string
  description: string
}

interface ReasonFormModalProps {
  open: boolean
  title: string
  initialValues?: ReasonFormValues
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: ReasonFormValues) => void
}

function ReasonFormModal({
  open,
  title,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: ReasonFormModalProps) {
  const [form] = Form.useForm<ReasonFormValues>()

  return (
    <Modal
      title={title}
      open={open}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(onSubmit)
      }}
      destroyOnClose
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue(initialValues ?? { name: '', description: '' })
        }
      }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Reason Name"
          rules={[{ required: true, message: 'Please enter a reason name' }]}
        >
          <Input placeholder="e.g. Changed My Mind" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={3} placeholder="Brief description of this cancellation reason" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface CreateReasonModalProps {
  open: boolean
  typeLabel: string
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: ReasonFormValues) => void
}

export function CreateReasonModal({
  open,
  typeLabel,
  confirmLoading,
  onCancel,
  onSubmit,
}: CreateReasonModalProps) {
  return (
    <ReasonFormModal
      open={open}
      title={`Add ${typeLabel} Cancellation Reason`}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
}

interface EditReasonModalProps {
  open: boolean
  typeLabel: string
  initialValues: ReasonFormValues
  confirmLoading?: boolean
  onCancel: () => void
  onSubmit: (values: ReasonFormValues) => void
}

export function EditReasonModal({
  open,
  typeLabel,
  initialValues,
  confirmLoading,
  onCancel,
  onSubmit,
}: EditReasonModalProps) {
  return (
    <ReasonFormModal
      open={open}
      title={`Edit ${typeLabel} Cancellation Reason`}
      initialValues={initialValues}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  )
}
