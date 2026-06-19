import { Button, Form, Switch } from 'antd'
import { Save } from 'lucide-react'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  useGetSafetySettingsQuery,
  useUpdateSafetySettingsMutation,
} from '@/services/safetyIncidentApi'

export function SafetySettingsPanel() {
  const adminActions = useAdminActions()
  const { data, isLoading } = useGetSafetySettingsQuery()
  const [updateSettings, { isLoading: saving }] = useUpdateSafetySettingsMutation()

  if (isLoading || !data) {
    return <div className="p-8 text-center text-alygo-text-muted">Loading settings...</div>
  }

  return (
    <div className="max-w-xl">
      <p className="mb-4 text-sm text-alygo-text-muted">
        Configure global safety settings for SOS alerts, notifications, and case handling.
      </p>
      <Form
        layout="vertical"
        initialValues={data}
        onFinish={async (values) => {
          await updateSettings(values).unwrap()
          adminActions.notify('Safety settings saved')
        }}
      >
        <Form.Item name="enableSosFeature" label="Enable SOS Feature" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="enableEmergencyHotline" label="Enable Emergency Hotline" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="enableCriticalAlertNotifications" label="Enable Critical Alert Notifications" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="autoAssignCases" label="Auto Assign Cases" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="enableSafetyCaseEmailAlerts" label="Enable Safety Case Email Alerts" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="enablePushNotifications" label="Enable Push Notifications" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          Save Settings
        </Button>
      </Form>
    </div>
  )
}
