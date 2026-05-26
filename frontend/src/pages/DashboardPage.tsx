import { FormEvent, useMemo, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { ArrowUpRight, FolderPlus, Sparkles, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/common/EmptyState"
import { CardSkeleton } from "@/components/common/Skeleton"
import { PageHeader } from "@/components/common/PageHeader"
import { useAsync } from "@/hooks/useAsync"
import { getApiError } from "@/services/api"
import { getMeetings } from "@/services/meetings"
import { createWorkspace } from "@/services/workspaces"
import { useToast } from "@/context/ToastContext"
import type { Workspace } from "@/types"

type OutletContext = {
  workspaces: Workspace[]
  reloadWorkspaces: () => Promise<void>
}

export function DashboardPage() {
  const { workspaces, reloadWorkspaces } = useOutletContext<OutletContext>()
  const { data: meetings, loading } = useAsync(getMeetings, [])
  const { toast } = useToast()
  const [workspaceName, setWorkspaceName] = useState("")
  const [creating, setCreating] = useState(false)

  const workspaceCards = useMemo(
    () =>
      workspaces.map((workspace) => ({
        ...workspace,
        meeting_count: meetings?.filter((meeting) => meeting.workspace_id === workspace.workspace_id).length || 0,
      })),
    [meetings, workspaces]
  )

  async function handleCreateWorkspace(event: FormEvent) {
    event.preventDefault()
    if (!workspaceName.trim()) return

    setCreating(true)
    try {
      await createWorkspace(workspaceName.trim())
      setWorkspaceName("")
      await reloadWorkspaces()
      toast({ title: "Workspace created", description: "Your new workspace is ready.", tone: "success" })
    } catch (error) {
      toast({ title: "Could not create workspace", description: getApiError(error), tone: "error" })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Your meeting memory"
        description="Move from workspaces to meetings, summaries, extracted tasks, and meeting-specific AI chat."
        actions={
          <Button asChild>
            <Link to="/upload">
              <UploadCloud className="size-4" />
              Upload
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading && !workspaceCards.length ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : workspaceCards.length ? (
            workspaceCards.map((workspace) => (
              <Card key={workspace.workspace_id} className="group transition duration-200 hover:-translate-y-0.5 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-3">
                    <span>{workspace.name}</span>
                    <Sparkles className="size-4 text-primary opacity-70" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{workspace.meeting_count} meetings indexed</p>
                  <Button asChild variant="outline" className="mt-5">
                    <Link to={`/workspace/${workspace.workspace_id}`}>
                      Open workspace
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="sm:col-span-2 xl:col-span-3">
              <EmptyState
                icon={FolderPlus}
                title="Create your first workspace"
                description="Workspaces keep meetings, summaries, and semantic chat separated by team or project."
              />
            </div>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>New workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleCreateWorkspace}>
              <Input placeholder="Product, Sales, Research..." value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
              <Button className="w-full" type="submit" disabled={creating}>
                <FolderPlus className="size-4" />
                Create workspace
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent meetings</h2>
        {meetings?.length ? (
          <div className="grid gap-3">
            {meetings.slice(0, 6).map((meeting) => (
              <Link
                key={meeting.meeting_id}
                to={`/meeting/${meeting.meeting_id}`}
                className="soft-panel flex items-center justify-between rounded-lg p-4 transition-colors hover:border-primary/30 hover:bg-white/[0.06]"
              >
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{meeting.workspace_id || "Workspace meeting"}</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={UploadCloud} title="No meetings yet" description="Upload a transcript, audio file, or video to create your first AI meeting record." />
        )}
      </section>
    </div>
  )
}
