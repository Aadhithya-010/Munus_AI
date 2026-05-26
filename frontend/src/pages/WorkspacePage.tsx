import { Link, useParams } from "react-router-dom"
import { ArrowUpRight, CalendarDays, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"
import { CardSkeleton } from "@/components/common/Skeleton"
import { PageHeader } from "@/components/common/PageHeader"
import { useAsync } from "@/hooks/useAsync"
import { getWorkspaceMeetings } from "@/services/meetings"

export function WorkspacePage() {
  const { workspaceId = "" } = useParams()
  const { data: meetings, loading } = useAsync(() => getWorkspaceMeetings(workspaceId), [workspaceId])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Meetings"
        description="Every meeting in this workspace has its own summary, tasks, transcript, and embedded AI chat."
        actions={
          <Button asChild>
            <Link to="/upload">
              <UploadCloud className="size-4" />
              Upload meeting
            </Link>
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : meetings?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {meetings.map((meeting) => (
            <Card key={meeting.meeting_id} className="group transition duration-200 hover:-translate-y-0.5 hover:border-primary/30">
              <CardHeader>
                <CardTitle>{meeting.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {meeting.created_at ? new Date(meeting.created_at).toLocaleString() : "Indexed meeting"}
                </div>
                <Button asChild variant="outline" className="mt-5">
                  <Link to={`/meeting/${meeting.meeting_id}`}>
                    Open meeting
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UploadCloud}
          title="No meetings in this workspace"
          description="Upload a meeting to generate a summary, tasks, transcript memory, and meeting-specific AI chat."
          action={
            <Button asChild>
              <Link to="/upload">Upload meeting</Link>
            </Button>
          }
        />
      )}
    </div>
  )
}
