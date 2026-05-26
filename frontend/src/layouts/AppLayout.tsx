import { useMemo, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { useAuth } from "@/context/AuthContext"
import { useAsync } from "@/hooks/useAsync"
import { getWorkspaces } from "@/services/workspaces"

export function AppLayout() {
  const navigate = useNavigate()
  const params = useParams()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: workspaces, reload } = useAsync(getWorkspaces, [])

  const activeWorkspace = useMemo(
    () => workspaces?.find((workspace) => workspace.workspace_id === params.workspaceId),
    [params.workspaceId, workspaces]
  )

  const email = useMemo(() => {
    try {
      const token = localStorage.getItem("munus_access_token")
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null
      return payload?.sub || ""
    } catch {
      return ""
    }
  }, [])

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar
        workspaces={workspaces || []}
        currentWorkspaceId={params.workspaceId}
        onWorkspaceChange={(workspaceId) => workspaceId && navigate(`/workspace/${workspaceId}`)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-w-0">
        <Topbar
          workspaceName={activeWorkspace?.name || "MUNUS AI"}
          email={email}
          onMenu={() => setSidebarOpen(true)}
          onLogout={() => {
            logout()
            navigate("/login", { replace: true })
          }}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <Outlet context={{ workspaces: workspaces || [], reloadWorkspaces: reload }} />
        </main>
      </div>
    </div>
  )
}
