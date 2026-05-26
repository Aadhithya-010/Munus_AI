import { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useOutletContext, useParams } from "react-router-dom"
import { CalendarDays, ChevronDown, FileText, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/common/Skeleton"
import { MeetingChat } from "@/components/meeting/MeetingChat"
import { useAsync } from "@/hooks/useAsync"
import { getMeeting } from "@/services/meetings"
import type { Workspace } from "@/types"

type OutletContext = {
  workspaces: Workspace[]
}

export function MeetingDetailPage() {
  const { meetingId = "" } = useParams()
  const { workspaces } = useOutletContext<OutletContext>()
  const { data: meeting, loading } = useAsync(() => getMeeting(meetingId), [meetingId])
  const [transcriptOpen, setTranscriptOpen] = useState(false)

  const workspaceName = useMemo(
    () => workspaces.find((workspace) => workspace.workspace_id === meeting?.workspace_id)?.name || meeting?.workspace_id || "Workspace",
    [meeting?.workspace_id, workspaces]
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!meeting) {
    return <EmptyState title="Meeting not found" description="The meeting may have been deleted or your account may not have access." />
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-lg p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge className="mb-3 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1 size-3" />
              AI meeting
            </Badge>
            <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{meeting.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{workspaceName}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {new Date(meeting.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-sm leading-7 text-muted-foreground prose-strong:text-foreground">
                <ReactMarkdown>{meeting.summary}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-sm leading-7 text-muted-foreground prose-strong:text-foreground">
                <ReactMarkdown>{Array.isArray(meeting.tasks) ? meeting.tasks.join("\n") : meeting.tasks}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Transcript</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Original meeting source text.</p>
              </div>
              <Button variant="outline" onClick={() => setTranscriptOpen((open) => !open)}>
                {transcriptOpen ? "Collapse" : "Expand"}
                <ChevronDown className={`size-4 transition-transform ${transcriptOpen ? "rotate-180" : ""}`} />
              </Button>
            </CardHeader>
            {transcriptOpen ? (
              <CardContent>
                <div className="max-h-[32rem] overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-7 text-muted-foreground">
                  {meeting.transcript}
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
                  <FileText className="size-4 text-primary" />
                  Transcript is hidden until expanded.
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <MeetingChat meetingId={meeting.meeting_id} workspaceId={meeting.workspace_id} />
      </div>
    </div>
  )
}
