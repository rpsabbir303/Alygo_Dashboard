import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { InternalNotesTable } from '@/features/communication/components/InternalNotesTable'

export default function InternalNotesPage() {
  return (
    <CommunicationLayout
      title="Internal Notes"
      description="Staff-only notes for fraud flags, compliance records, safety concerns, VIP users, and support context."
    >
      <InternalNotesTable />
    </CommunicationLayout>
  )
}
