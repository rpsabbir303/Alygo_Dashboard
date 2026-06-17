import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { ConversationInbox } from '@/features/communication/components/ConversationInbox'

export default function DriverSupportPage() {
  return (
    <CommunicationLayout
      title="Driver Support"
      description="Manage all driver support conversations, compliance inquiries, and operational communications."
    >
      <ConversationInbox defaultTab="driver" userTypeFilter="driver" />
    </CommunicationLayout>
  )
}
