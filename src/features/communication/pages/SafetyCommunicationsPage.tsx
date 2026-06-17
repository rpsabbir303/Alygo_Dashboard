import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { SafetyCommunicationsTable } from '@/features/communication/components/SafetyCommunicationsTable'

export default function SafetyCommunicationsPage() {
  return (
    <CommunicationLayout
      title="Safety Communications"
      description="Dedicated safety communication center for SOS alerts, emergency reports, harassment cases, and accident investigations."
    >
      <SafetyCommunicationsTable />
    </CommunicationLayout>
  )
}
