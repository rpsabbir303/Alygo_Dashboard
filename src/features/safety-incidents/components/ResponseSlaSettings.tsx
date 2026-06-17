import { Button, Form, InputNumber, Switch } from 'antd'
import { Save } from 'lucide-react'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetResponseSlaQuery,
  useUpdateResponseSlaMutation,
} from '@/services/safetyIncidentApi'

export function ResponseSlaSettings() {
  const adminActions = useAdminActions()
  const { data, isLoading } = useGetResponseSlaQuery()
  const [updateSla, { isLoading: saving }] = useUpdateResponseSlaMutation()

  if (isLoading || !data) {
    return <div className="p-8 text-center text-alygo-text-muted">Loading SLA settings...</div>
  }

  return (
    <div className="max-w-xl">
      <p className="mb-4 text-sm text-alygo-text-muted">
        Configure response time SLAs by priority level. Auto-escalation triggers when SLAs are breached.
      </p>
      <Form
        layout="vertical"
        initialValues={data}
        onFinish={async (values) => {
          await updateSla(values).unwrap()
          adminActions.notify('Response SLA updated')
        }}
      >
        <Form.Item name="criticalResponseMinutes" label="Critical Response SLA" rules={[{ required: true }]}>
          <InputNumber min={1} addonAfter="minutes" className="w-full" />
        </Form.Item>
        <Form.Item name="highResponseMinutes" label="High Priority Response SLA" rules={[{ required: true }]}>
          <InputNumber min={1} addonAfter="minutes" className="w-full" />
        </Form.Item>
        <Form.Item name="mediumResponseMinutes" label="Medium Priority Response SLA" rules={[{ required: true }]}>
          <InputNumber min={1} addonAfter="minutes" className="w-full" />
        </Form.Item>
        <Form.Item name="lowResponseMinutes" label="Low Priority Response SLA" rules={[{ required: true }]}>
          <InputNumber min={1} addonAfter="minutes" className="w-full" />
        </Form.Item>
        <Form.Item name="autoEscalateEnabled" label="Auto-Escalate on SLA Breach" valuePropName="checked">
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          Save SLA Settings
        </Button>
      </Form>
    </div>
  )
}
