import { Button, Form, InputNumber, Switch } from 'antd'
import { Save } from 'lucide-react'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetCapacityAutoRulesQuery,
  useUpdateCapacityAutoRulesMutation,
} from '@/services/driverCapacityApi'

export function AutoRulesSettings() {
  const adminActions = useAdminActions()
  const { data, isLoading } = useGetCapacityAutoRulesQuery()
  const [updateRules, { isLoading: saving }] = useUpdateCapacityAutoRulesMutation()

  if (isLoading || !data) {
    return <div className="p-8 text-center text-alygo-text-muted">Loading auto rules...</div>
  }

  return (
    <div className="max-w-xl">
      <p className="mb-4 text-sm text-alygo-text-muted">
        Configure automatic waitlist approval rules and market capacity thresholds.
      </p>
      <Form
        layout="vertical"
        initialValues={data}
        onFinish={async (values) => {
          await updateRules(values).unwrap()
          adminActions.notify('Auto rules updated')
        }}
      >
        <Form.Item
          name="autoApproveWaitlist"
          label="Auto Approve Waitlist"
          valuePropName="checked"
          extra="Automatically approve drivers when capacity slots become available"
        >
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
        </Form.Item>
        <Form.Item
          name="manualApproval"
          label="Manual Approval"
          valuePropName="checked"
          extra="Require admin review before approving waitlisted drivers"
        >
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
        </Form.Item>
        <Form.Item
          name="priorityDriversEnabled"
          label="Priority Drivers"
          valuePropName="checked"
          extra="Allow priority queue bypass for qualified driver applications"
        >
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
        </Form.Item>
        <Form.Item
          name="marketCapacityThreshold"
          label="Market Capacity Threshold (%)"
          extra="Trigger waitlist processing when market utilization falls below this threshold"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={100} addonAfter="%" className="w-full" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          Save Auto Rules
        </Button>
      </Form>
    </div>
  )
}
