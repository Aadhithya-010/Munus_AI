import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-white/[0.08]", className)} />
}

export function CardSkeleton() {
  return (
    <div className="soft-panel rounded-lg p-5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <Skeleton className="mt-6 h-8 w-28" />
    </div>
  )
}
