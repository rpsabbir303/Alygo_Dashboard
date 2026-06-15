import { Button, Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getAirportActionItems,
  getDemandActionItems,
  handleGenericAction,
  openGenericDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const states = [
  { code: 'CA', name: 'California', cities: 12, drivers: 4200, status: 'Active' },
  { code: 'NY', name: 'New York', cities: 8, drivers: 3800, status: 'Active' },
  { code: 'TX', name: 'Texas', cities: 10, drivers: 2900, status: 'Active' },
  { code: 'FL', name: 'Florida', cities: 9, drivers: 2100, status: 'Active' },
]

export function StatesPage() {
  useDocumentTitle('States')
  const adminActions = useAdminActions()

  return (
    <PageShell title="States" description="Manage state-level platform configuration." actions={<Button type="primary">Add State</Button>}>
      <div className="glass-card p-4">
        <Table
          rowKey="code"
          dataSource={states}
          {...createTableRowProps<{ code: string; name: string; cities: number; drivers: number; status: string }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.name))}
          columns={[
            { title: 'Code', dataIndex: 'code' },
            { title: 'State', dataIndex: 'name' },
            { title: 'Cities', dataIndex: 'cities' },
            { title: 'Drivers', dataIndex: 'drivers' },
            { title: 'Status', dataIndex: 'status' },
            createActionsColumn<{ code: string; name: string; cities: number; drivers: number; status: string }>(
              () => getDemandActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.name),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function CitiesPage() {
  useDocumentTitle('Cities')
  const adminActions = useAdminActions()
  const cities = [
    { name: 'San Francisco', state: 'CA', drivers: 1420, zones: 8 },
    { name: 'Los Angeles', state: 'CA', drivers: 2100, zones: 12 },
    { name: 'New York', state: 'NY', drivers: 3200, zones: 15 },
  ]

  return (
    <PageShell title="Cities" description="City-level operations and zone management.">
      <div className="glass-card p-4">
        <Table
          rowKey="name"
          dataSource={cities}
          {...createTableRowProps<{ name: string; state: string; drivers: number; zones: number }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.name))}
          columns={[
            { title: 'City', dataIndex: 'name' },
            { title: 'State', dataIndex: 'state' },
            { title: 'Drivers', dataIndex: 'drivers' },
            { title: 'Zones', dataIndex: 'zones' },
            createActionsColumn<{ name: string; state: string; drivers: number; zones: number }>(
              () => getDemandActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.name),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function AirportsPage() {
  useDocumentTitle('Airports')
  const adminActions = useAdminActions()
  const airports = [
    { code: 'SFO', name: 'San Francisco Intl', queue: 89, reservations: 42, drivers: 156 },
    { code: 'LAX', name: 'Los Angeles Intl', queue: 124, reservations: 68, drivers: 210 },
    { code: 'JFK', name: 'JFK Intl', queue: 98, reservations: 55, drivers: 185 },
  ]

  return (
    <PageShell title="Airport Management" description="Airport queue system, demand trends, and pricing rules.">
      <div className="glass-card p-4">
        <Table
          rowKey="code"
          dataSource={airports}
          {...createTableRowProps<{ code: string; name: string; queue: number; reservations: number; drivers: number }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.name))}
          columns={[
            { title: 'Code', dataIndex: 'code' },
            { title: 'Airport', dataIndex: 'name' },
            { title: 'Queue Count', dataIndex: 'queue' },
            { title: 'Reservations', dataIndex: 'reservations' },
            { title: 'Available Drivers', dataIndex: 'drivers' },
            createActionsColumn<{ code: string; name: string; queue: number; reservations: number; drivers: number }>(
              () => getAirportActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.name),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function ZonesPage() {
  useDocumentTitle('Zones')
  const adminActions = useAdminActions()
  const zones = [
    { name: 'Downtown SF', city: 'San Francisco', type: 'Surge', active: true },
    { name: 'Financial District', city: 'San Francisco', type: 'Pricing', active: true },
    { name: 'Midtown', city: 'New York', type: 'Surge', active: true },
  ]

  return (
    <PageShell title="Zones" description="Geographic zones for pricing and operations.">
      <div className="glass-card p-4">
        <Table
          rowKey="name"
          dataSource={zones}
          {...createTableRowProps<{ name: string; city: string; type: string; active: boolean }>((record) => openGenericDetails(record as Record<string, unknown>, adminActions, record.name))}
          columns={[
            { title: 'Zone', dataIndex: 'name' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Type', dataIndex: 'type' },
            { title: 'Active', dataIndex: 'active', render: (v: boolean) => (v ? 'Yes' : 'No') },
            createActionsColumn<{ name: string; city: string; type: string; active: boolean }>(
              () => getDemandActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.name),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export default StatesPage
