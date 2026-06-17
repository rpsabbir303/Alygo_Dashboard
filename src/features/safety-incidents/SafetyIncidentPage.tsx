import { Tabs } from 'antd'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { EscalationRulesTable } from '@/features/safety-incidents/components/EscalationRulesTable'
import { IncidentCategoriesTable } from '@/features/safety-incidents/components/IncidentCategoriesTable'
import { IncidentTable } from '@/features/safety-incidents/components/IncidentTable'
import { ResponseSlaSettings } from '@/features/safety-incidents/components/ResponseSlaSettings'
import { SafetyOverviewCards } from '@/features/safety-incidents/components/SafetyOverviewCards'
import { SafetyTeamTable } from '@/features/safety-incidents/components/SafetyTeamTable'
import { useSafetyIncidentRealtime } from '@/features/safety-incidents/hooks/useSafetyIncidentRealtime'

export default function SafetyIncidentPage() {
  useDocumentTitle('Safety & Incident Management')
  useSafetyIncidentRealtime()

  return (
    <PageShell
      title="Safety & Incident Management"
      description="Manage SOS alerts, incidents, emergency reports, and safety cases with real-time monitoring and escalation controls."
    >
      <SafetyOverviewCards />

      <div className="glass-card mt-6 p-4">
        <Tabs
          defaultActiveKey="incidents"
          items={[
            { key: 'incidents', label: 'Incidents', children: <IncidentTable /> },
            { key: 'categories', label: 'Incident Categories', children: <IncidentCategoriesTable /> },
            { key: 'escalation', label: 'Escalation Rules', children: <EscalationRulesTable /> },
            { key: 'sla', label: 'Response SLA', children: <ResponseSlaSettings /> },
            { key: 'team', label: 'Safety Team', children: <SafetyTeamTable /> },
          ]}
        />
      </div>
    </PageShell>
  )
}
