import { useMemo, useState } from 'react'
import { Button, Form, InputNumber, Switch, Table, Tabs } from 'antd'
import { useAdminActions } from '@/hooks/useAdminActions'
import {
  LEVEL_LABELS,
  useGetDriverLevelsQuery,
  useUpdateDriverLevelMutation,
} from '@/services/driverRewardsApi'
import type { DriverLevel, DriverLevelName } from '@/types/driverRewards'
import { TIER_BENEFIT_FLAG_FIELDS } from '@/features/driver-rewards/utils/tierDefaults'

export function TierBenefitsEnginePanel() {
  const adminActions = useAdminActions()
  const { data: tiers = [], isLoading } = useGetDriverLevelsQuery()
  const [selectedTier, setSelectedTier] = useState<DriverLevelName>('journey')
  const [updateLevel, { isLoading: saving }] = useUpdateDriverLevelMutation()
  const tier = useMemo(() => tiers.find((t) => t.name === selectedTier), [tiers, selectedTier])

  const saveBenefits = async (values: DriverLevel['benefits']) => {
    if (!tier) return
    await updateLevel({ id: tier.id, benefits: values }).unwrap()
    adminActions.notify('Tier benefits updated', tier.label)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-alygo-text-muted">
        Configure destination filter limits, usage caps, multipliers, and operational benefits per tier.
      </p>

      <Tabs
        activeKey={selectedTier}
        onChange={setSelectedTier}
        items={tiers.map((t) => ({
          key: t.name,
          label: (
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-white"
                style={{ backgroundColor: t.tierColor }}
              >
                {t.tierBadge}
              </span>
              {t.label}
            </span>
          ),
          children: tier && tier.name === t.name ? (
            <Form
              key={tier.id}
              layout="vertical"
              initialValues={tier.benefits}
              onFinish={saveBenefits}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Form.Item name="destinationFilters" label="Destination Filters" rules={[{ required: true }]}>
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="dailyUsageLimit" label="Daily Usage Limit" rules={[{ required: true }]}>
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
                <Form.Item name="weeklyUsageLimit" label="Weekly Usage Limit" rules={[{ required: true }]}>
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TIER_BENEFIT_FLAG_FIELDS.map(({ key, label }) => (
                  <Form.Item key={key} name={['flags', key]} label={label} valuePropName="checked">
                    <Switch />
                  </Form.Item>
                ))}
                <Form.Item name={['flags', 'bonusMultiplier']} label="Bonus Multiplier">
                  <InputNumber min={1} max={3} step={0.05} className="w-full" />
                </Form.Item>
                <Form.Item name={['flags', 'surgeMultiplier']} label="Surge Multiplier">
                  <InputNumber min={1} max={3} step={0.05} className="w-full" />
                </Form.Item>
                <Form.Item name={['flags', 'reducedPlatformFees']} label="Reduced Platform Fees (%)">
                  <InputNumber min={0} max={25} className="w-full" />
                </Form.Item>
              </div>

              <Button type="primary" htmlType="submit" loading={saving}>
                Save {LEVEL_LABELS[tier.name] ?? tier.label} Benefits
              </Button>
            </Form>
          ) : null,
        }))}
      />

      <Table
        loading={isLoading}
        rowKey="id"
        pagination={false}
        dataSource={tiers}
        columns={[
          { title: 'Tier', dataIndex: 'label' },
          { title: 'Destination Filters', render: (_: unknown, r: DriverLevel) => r.benefits.destinationFilters },
          { title: 'Daily Limit', render: (_: unknown, r: DriverLevel) => r.benefits.dailyUsageLimit },
          { title: 'Weekly Limit', render: (_: unknown, r: DriverLevel) => r.benefits.weeklyUsageLimit },
          { title: 'Bonus Multiplier', render: (_: unknown, r: DriverLevel) => `${r.benefits.flags.bonusMultiplier}x` },
          { title: 'Priority Dispatch', render: (_: unknown, r: DriverLevel) => (r.benefits.flags.priorityDispatch ? 'Yes' : 'No') },
        ]}
      />
    </div>
  )
}
