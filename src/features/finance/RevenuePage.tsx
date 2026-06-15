import { Button, Table } from 'antd'
import { CreditCard } from 'lucide-react'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getFinanceActionItems,
  handleFinanceAction,
  openTransactionDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueTrendChart, ChartCard } from '@/components/charts/AnalyticsCharts'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetRevenueTrendQuery, useGetDashboardKpisQuery } from '@/services/api'
import { formatCurrency } from '@/utils/format'

export function RevenuePage() {
  useDocumentTitle('Revenue')
  const { data: trend = [] } = useGetRevenueTrendQuery()
  const { data: kpis = [] } = useGetDashboardKpisQuery()
  const revenueKpis = kpis.filter((k) => k.key.includes('revenue') || k.key.includes('Revenue'))

  return (
    <PageShell title="Revenue Dashboard" description="Platform revenue metrics and trends.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {revenueKpis.map((k) => <KpiCard key={k.key} metric={k} />)}
      </div>
      <ChartCard title="Revenue Trend"><RevenueTrendChart data={trend} /></ChartCard>
    </PageShell>
  )
}

export function PayoutsPage() {
  useDocumentTitle('Driver Payouts')
  const adminActions = useAdminActions()
  const payouts = [
    { driver: 'Marcus Johnson', amount: 842, status: 'Processed', date: '2026-06-12' },
    { driver: 'Sarah Chen', amount: 1240, status: 'Pending', date: '2026-06-13' },
  ]

  return (
    <PageShell title="Driver Payouts" description="Stripe Connect payout management." actions={<Button type="primary" icon={<CreditCard className="h-4 w-4" />}>Process Payouts</Button>}>
      <div className="glass-card mb-4 flex items-center gap-3 p-4 text-sm text-alygo-text-muted">
        <CreditCard className="h-5 w-5 text-indigo-400" />
        Stripe integration configured for automated driver payouts
      </div>
      <div className="glass-card p-4">
        <Table
          rowKey="driver"
          dataSource={payouts}
          {...createTableRowProps<{ driver: string; amount: number; status: string; date: string }>((record) => openTransactionDetails(record as Record<string, unknown>, adminActions))}
          columns={[
            { title: 'Driver', dataIndex: 'driver' },
            { title: 'Amount', dataIndex: 'amount', render: (a: number) => formatCurrency(a) },
            { title: 'Status', dataIndex: 'status' },
            { title: 'Date', dataIndex: 'date' },
            createActionsColumn<{ driver: string; amount: number; status: string; date: string }>(
              () => getFinanceActionItems(),
              (key, record) => handleFinanceAction(key, record as Record<string, unknown>, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function WalletsPage() {
  useDocumentTitle('Wallet Management')
  return (
    <PageShell title="Wallet Management" description="Passenger and driver wallet balances.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-card p-5"><p className="text-sm text-alygo-text-muted">Total Wallet Balance</p><p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(284000)}</p></div>
        <div className="glass-card p-5"><p className="text-sm text-alygo-text-muted">Active Wallets</p><p className="mt-2 text-3xl font-semibold text-white">12,847</p></div>
        <div className="glass-card p-5"><p className="text-sm text-alygo-text-muted">Pending Top-ups</p><p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(12400)}</p></div>
      </div>
    </PageShell>
  )
}

export function TransactionsPage() {
  useDocumentTitle('Transaction History')
  const adminActions = useAdminActions()
  const transactions = [
    { id: 'TX-001', type: 'Trip Payment', amount: 42.5, fee: 8.5, status: 'Completed' },
    { id: 'TX-002', type: 'Driver Payout', amount: -842, fee: 0, status: 'Processed' },
    { id: 'TX-003', type: 'Refund', amount: -18, fee: 0, status: 'Completed' },
  ]

  return (
    <PageShell title="Transaction History" description="All platform financial transactions.">
      <div className="glass-card p-4">
        <Table
          rowKey="id"
          dataSource={transactions}
          {...createTableRowProps<{ id: string; type: string; amount: number; fee: number; status: string }>((record) => openTransactionDetails(record as Record<string, unknown>, adminActions))}
          columns={[
            { title: 'Transaction ID', dataIndex: 'id' },
            { title: 'Type', dataIndex: 'type' },
            { title: 'Amount', dataIndex: 'amount', render: (a: number) => formatCurrency(Math.abs(a)) },
            { title: 'Platform Fee', dataIndex: 'fee', render: (f: number) => formatCurrency(f) },
            { title: 'Status', dataIndex: 'status' },
            createActionsColumn<{ id: string; type: string; amount: number; fee: number; status: string }>(
              () => getFinanceActionItems(),
              (key, record) => handleFinanceAction(key, record as Record<string, unknown>, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export default RevenuePage
