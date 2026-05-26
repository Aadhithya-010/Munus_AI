import { LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Topbar({
  workspaceName,
  email,
  onMenu,
  onLogout,
}: {
  workspaceName: string
  email: string
  onMenu: () => void
  onLogout: () => void
}) {
  const initials = email ? email.slice(0, 2).toUpperCase() : "AI"

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/75 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}>
          <Menu className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-medium">{workspaceName}</p>
          <p className="text-xs text-muted-foreground">Workspace console</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{email || "Signed in"}</p>
          <p className="text-xs text-muted-foreground">Authenticated</p>
        </div>
        <div className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold">
          {initials}
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
