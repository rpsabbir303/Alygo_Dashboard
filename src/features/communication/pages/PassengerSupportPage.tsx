import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { ConversationInbox } from '@/features/communication/components/ConversationInbox'

export default function PassengerSupportPage() {
  return (
    <CommunicationLayout
      title="Passenger Support"
      description="Manage passenger support chats including trip issues, payment disputes, and account inquiries."
    >
      <ConversationInbox defaultTab="passenger" userTypeFilter="passenger" />
    </CommunicationLayout>
  )
}
