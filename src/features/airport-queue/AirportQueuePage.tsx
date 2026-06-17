import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AirportOverviewCards } from '@/features/airport-queue/components/AirportOverviewCards'
import { AirportTable } from '@/features/airport-queue/components/AirportTable'
import { QueueMonitoringTable } from '@/features/airport-queue/components/QueueMonitoringTable'
import { QueueRulesSettings } from '@/features/airport-queue/components/QueueRulesSettings'
import { useAirportQueueRealtime } from '@/features/airport-queue/hooks/useAirportQueueRealtime'

export default function AirportQueuePage() {
  useDocumentTitle('Airport Queue Management')
  useAirportQueueRealtime()

  return (
    <PageShell
      title="Airport Queue Management"
      description="Manage airport driver staging areas, dispatch queues, tier priority rules, and live queue monitoring."
    >
      <AirportOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="airports"
          items={[
            { key: 'airports', label: 'Airports', children: <AirportTable /> },
            { key: 'rules', label: 'Queue Rules', children: <QueueRulesSettings /> },
            { key: 'monitoring', label: 'Queue Monitoring', children: <QueueMonitoringTable /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
