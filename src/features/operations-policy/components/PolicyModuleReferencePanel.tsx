import { Button } from 'antd'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PolicyModuleReferencePanel({
  title,
  description,
  path,
  linkLabel,
}: {
  title: string
  description: string
  path: string
  linkLabel: string
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-alygo-text-muted">{description}</p>
      <Link to={path}>
        <Button type="primary" icon={<ExternalLink className="h-4 w-4" />}>
          {linkLabel}
        </Button>
      </Link>
    </div>
  )
}
