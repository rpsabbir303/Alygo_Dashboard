import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { ActiveTripChatsView } from '@/features/communication/components/ActiveTripChatsView'

export default function ActiveTripChatsPage() {
  return (
    <CommunicationLayout
      title="Active Trip Chats"
      description="Real-time communication hub for all in-progress trips with driver and passenger messaging."
    >
      <ActiveTripChatsView />
    </CommunicationLayout>
  )
}
