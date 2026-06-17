import type { ReactNode } from 'react'
import { PageShell } from '@/components/common/PageShell'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { CommunicationOverviewCards } from '@/features/communication/components/CommunicationOverviewCards'
import { useCommunicationRealtime } from '@/features/communication/hooks/useCommunicationRealtime'

interface CommunicationLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function CommunicationLayout({ title, description, children }: CommunicationLayoutProps) {
  useDocumentTitle(title)
  useCommunicationRealtime()

  return (
    <PageShell title={title} description={description}>
      <CommunicationOverviewCards />
      <div className="glass-card mt-6 p-4">{children}</div>
    </PageShell>
  )
}
