import { Form, Input, InputNumber, Modal, Select } from 'antd'
import { useEffect } from 'react'
import type { RideCategoryDefinition, RideCategoryFormValues } from '@/types/rideCategoryManagement'
import { RIDE_CATEGORY_STATUS_OPTIONS } from '@/features/ride-categories/rideCategoryHelpers'

interface RideCategoryFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: RideCategoryDefinition | null
  loading?: boolean
  onCancel: () => void
  onSubmit: (values: RideCategoryFormValues) => Promise<void>
}

const defaultValues: RideCategoryFormValues = {
  name: '',
  description: '',
  fareMultiplier: 1,
  minDriverRating: 4.5,
  vehicleRequirements: '',
  status: 'enabled',
}

export function RideCategoryFormModal({
  open,
  mode,
  initialValues,
  loading,
  onCancel,
  onSubmit,
}: RideCategoryFormModalProps) {
  const [form] = Form.useForm<RideCategoryFormValues>()

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        fareMultiplier: initialValues.fareMultiplier,
        minDriverRating: initialValues.minDriverRating,
        vehicleRequirements: initialValues.vehicleRequirements,
        status: initialValues.status,
      })
    } else {
      form.setFieldsValue(defaultValues)
    }
  }, [open, mode, initialValues, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
  }

  return (
    <Modal
      title={mode === 'create' ? 'Create Category' : 'Edit Category'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === 'create' ? 'Create Category' : 'Save Changes'}
      confirmLoading={loading}
      destroyOnClose
      width={560}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Category name is required' }]}
        >
          <Input placeholder="e.g. Luxury, Electric, Business" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <Input.TextArea rows={3} placeholder="Describe this ride category" />
        </Form.Item>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <Form.Item
            name="fareMultiplier"
            label="Base Fare Multiplier"
            rules={[{ required: true, message: 'Fare multiplier is required' }]}
          >
            <InputNumber min={0.5} max={10} step={0.05} className="!w-full" />
          </Form.Item>
          <Form.Item
            name="minDriverRating"
            label="Minimum Driver Rating"
            rules={[{ required: true, message: 'Minimum rating is required' }]}
          >
            <InputNumber min={1} max={5} step={0.1} className="!w-full" />
          </Form.Item>
        </div>
        <Form.Item
          name="vehicleRequirements"
          label="Vehicle Requirements"
          rules={[{ required: true, message: 'Vehicle requirements are required' }]}
        >
          <Input.TextArea rows={2} placeholder="Vehicle year, type, insurance, etc." />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select options={RIDE_CATEGORY_STATUS_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
