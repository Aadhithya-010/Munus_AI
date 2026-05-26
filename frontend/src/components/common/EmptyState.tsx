import type { LucideIcon } from "lucide-react"
import { Sparkles } from "lucide-react"

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
}: {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="glass-panel flex min-h-60 flex-col items-center justify-center rounded-lg px-6 py-12 text-center">
      <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.05] p-3">
        <Icon className="size-5 text-primary" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
