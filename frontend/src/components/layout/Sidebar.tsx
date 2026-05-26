import { Link, NavLink } from "react-router-dom"
import { LayoutDashboard, PlusCircle, Settings, UploadCloud, Workflow, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import type { Workspace } from "@/types"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload meeting", icon: UploadCloud },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  open,
  onClose,
}: {
  workspaces: Workspace[]
  currentWorkspaceId?: string
  onWorkspaceChange: (workspaceId: string) => void
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-background/90 p-4 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/15 text-primary">
              <Workflow className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">MUNUS AI</p>
              <p className="mt-1 text-xs text-muted-foreground">Meeting intelligence</p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Workspace</span>
            <Link to="/dashboard" className="text-primary">
              <PlusCircle className="size-4" />
            </Link>
          </div>
          <Select
            value={currentWorkspaceId || ""}
            onChange={(event) => onWorkspaceChange(event.target.value)}
            disabled={!workspaces.length}
          >
            <option value="">{workspaces.length ? "Select workspace" : "No workspaces"}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.workspace_id} value={workspace.workspace_id}>
                {workspace.name}
              </option>
            ))}
          </Select>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
                    isActive && "bg-white/[0.08] text-foreground"
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-medium">AI-native workspace</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Upload meetings, extract decisions, and ask precise questions inside each meeting.
          </p>
        </div>
      </aside>
    </>
  )
}
