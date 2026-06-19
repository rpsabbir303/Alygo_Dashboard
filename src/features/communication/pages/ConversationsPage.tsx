import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { ConversationWorkspace } from '@/features/communication/components/ConversationWorkspace'

export default function ConversationsPage() {
  return (
    <CommunicationLayout
      compact
      title="Conversations"
      description="Real-time support workspace for driver, passenger, trip, safety, and escalation communications."
    >
      <ConversationWorkspace />
    </CommunicationLayout>
  )
}
