import { CommunicationLayout } from '@/features/communication/CommunicationLayout'
import { BroadcastCenter } from '@/features/communication/components/BroadcastCenter'

export default function BroadcastCenterPage() {
  return (
    <CommunicationLayout
      title="Broadcast Center"
      description="Send targeted platform announcements to drivers and passengers by city, state, category, or tier."
    >
      <BroadcastCenter />
    </CommunicationLayout>
  )
}
