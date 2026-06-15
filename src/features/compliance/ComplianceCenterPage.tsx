import { Alert, Table } from 'antd'
import {
  AdminActionHost,
  createActionsColumn,
  createTableRowProps,
  getComplianceActionItems,
  getEligibilityActionItems,
  handleComplianceAction,
  handleGenericAction,
  openComplianceDetails,
  openEligibilityRecordDetails,
} from '@/components/admin'
import { PageShell } from '@/components/common/PageShell'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useAdminActions } from '@/hooks/useAdminActions'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useGetComplianceDocumentsQuery } from '@/services/api'
import type { ComplianceDocument } from '@/types'
import { formatDate } from '@/utils/format'

function ComplianceTable() {
  const adminActions = useAdminActions()
  const { data: documents = [], isLoading } = useGetComplianceDocumentsQuery()

  return (
    <>
      <Table
        loading={isLoading}
        rowKey="id"
        dataSource={documents}
        {...createTableRowProps<ComplianceDocument>((record) => openComplianceDetails(record, adminActions))}
        columns={[
          { title: 'Driver', dataIndex: 'driverName' },
          { title: 'Document Type', dataIndex: 'type' },
          { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
          { title: 'Submitted', dataIndex: 'submittedAt', render: (d: string) => formatDate(d) },
          { title: 'Expires', dataIndex: 'expiresAt', render: (d?: string) => (d ? formatDate(d) : '—') },
          createActionsColumn<ComplianceDocument>(
            () => getComplianceActionItems(),
            (key, record) => handleComplianceAction(key, record, adminActions),
          ),
        ]}
      />
      <AdminActionHost actions={adminActions} />
    </>
  )
}

export default function ComplianceCenterPage() {
  useDocumentTitle('Compliance Center')
  const { data: documents = [] } = useGetComplianceDocumentsQuery()
  const alerts = documents.filter((d) => d.status === 'expiring_soon' || d.status === 'expired')

  return (
    <PageShell title="Compliance Center" description="Monitor driver documents, expirations, and compliance alerts.">
      {alerts.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`${alerts.length} compliance alerts require attention`}
          className="mb-4"
        />
      )}
      <div className="glass-card p-4">
        <ComplianceTable />
      </div>
    </PageShell>
  )
}

export function BackgroundChecksPage() {
  useDocumentTitle('Background Checks')
  const adminActions = useAdminActions()
  const { data: documents = [] } = useGetComplianceDocumentsQuery()
  const bgChecks = documents.filter((d) => d.type === 'Background Check')

  return (
    <PageShell title="Background Checks" description="Review and manage driver background check statuses.">
      <div className="glass-card p-4">
        <Table
          rowKey="id"
          dataSource={bgChecks}
          {...createTableRowProps<ComplianceDocument>((record) => openComplianceDetails(record, adminActions))}
          columns={[
            { title: 'Driver', dataIndex: 'driverName' },
            { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
            { title: 'Submitted', dataIndex: 'submittedAt', render: (d: string) => formatDate(d) },
            createActionsColumn<ComplianceDocument>(
              () => getComplianceActionItems(),
              (key, record) => handleComplianceAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function DocumentMonitoringPage() {
  useDocumentTitle('Document Monitoring')
  const adminActions = useAdminActions()
  const { data: documents = [] } = useGetComplianceDocumentsQuery()

  return (
    <PageShell title="Document Monitoring" description="Track all driver document submissions and expirations.">
      <div className="glass-card p-4">
        <Table
          rowKey="id"
          dataSource={documents}
          {...createTableRowProps<ComplianceDocument>((record) => openComplianceDetails(record, adminActions))}
          columns={[
            { title: 'Driver', dataIndex: 'driverName' },
            { title: 'Type', dataIndex: 'type' },
            { title: 'Status', dataIndex: 'status', render: (s: string) => <StatusBadge status={s} /> },
            { title: 'Expires', dataIndex: 'expiresAt', render: (d?: string) => (d ? formatDate(d) : '—') },
            createActionsColumn<ComplianceDocument>(
              () => getComplianceActionItems(),
              (key, record) => handleComplianceAction(key, record, adminActions),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}

export function DriverRestrictionsPage() {
  useDocumentTitle('Driver Restrictions')
  const adminActions = useAdminActions()

  const restrictions = [
    { driver: 'Marcus Johnson', reason: 'Expired vehicle inspection', until: '2026-06-20', categories: 'Black, Black SUV' },
    { driver: 'David Kim', reason: 'Background check pending', until: 'Review', categories: 'All premium' },
  ]

  return (
    <PageShell title="Driver Restrictions" description="Manage category restrictions and reactivation workflows.">
      <div className="glass-card p-4">
        <Table
          rowKey="driver"
          dataSource={restrictions}
          {...createTableRowProps<{ driver: string; reason: string; until: string; categories: string }>((record) => openEligibilityRecordDetails(record as Record<string, unknown>, adminActions, `Restriction — ${record.driver}`))}
          columns={[
            { title: 'Driver', dataIndex: 'driver' },
            { title: 'Reason', dataIndex: 'reason' },
            { title: 'Restricted Categories', dataIndex: 'categories' },
            { title: 'Until', dataIndex: 'until' },
            createActionsColumn<{ driver: string; reason: string; until: string; categories: string }>(
              () => getEligibilityActionItems(),
              (key, record) => handleGenericAction(key, record as Record<string, unknown>, adminActions, record.driver),
            ),
          ]}
        />
      </div>
      <AdminActionHost actions={adminActions} />
    </PageShell>
  )
}
