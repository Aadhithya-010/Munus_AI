import { FormEvent, useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { CheckCircle2, FileAudio, FileText, FileVideo, Loader2, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/common/PageHeader"
import { useToast } from "@/context/ToastContext"
import { getApiError } from "@/services/api"
import { uploadAudio, uploadTranscript, uploadVideo } from "@/services/meetings"
import type { Workspace } from "@/types"
import { cn } from "@/lib/utils"

type UploadMode = "transcript" | "audio" | "video"

type OutletContext = {
  workspaces: Workspace[]
}

const modes = [
  { id: "transcript", label: "Transcript", icon: FileText },
  { id: "audio", label: "Audio", icon: FileAudio },
  { id: "video", label: "Video", icon: FileVideo },
] as const

function normalizeTranscriptInput(value: string) {
  return value
    .replace(/\r?\n+/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim()
}

export function UploadPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { workspaces } = useOutletContext<OutletContext>()
  const [mode, setMode] = useState<UploadMode>("transcript")
  const [title, setTitle] = useState("")
  const [workspaceId, setWorkspaceId] = useState("")
  const [transcript, setTranscript] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const accept = useMemo(() => {
    if (mode === "audio") return "audio/*"
    if (mode === "video") return "video/*"
    return ".txt,.md"
  }, [mode])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setSuccess(false)
    setProgress(mode === "transcript" ? 100 : 0)

    try {
      const basePayload = { title, workspace_id: workspaceId }
      const response =
        mode === "transcript"
          ? await uploadTranscript({ ...basePayload, transcript: normalizeTranscriptInput(transcript) })
          : mode === "audio" && file
            ? await uploadAudio({ ...basePayload, file, onUploadProgress: setProgress })
            : file
              ? await uploadVideo({ ...basePayload, file, onUploadProgress: setProgress })
              : null

      const meetingId = response?.data?.meeting_id
      setSuccess(true)
      toast({ title: "Meeting processed", description: "Summary, tasks, and semantic memory are ready.", tone: "success" })

      if (meetingId) {
        navigate(`/meeting/${meetingId}`)
      }
    } catch (error) {
      toast({ title: "Upload failed", description: getApiError(error), tone: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Upload"
        title="Add a meeting"
        description="Create a meeting record from transcript text, audio, or video. MUNUS AI will generate the meeting intelligence layer."
      />

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Meeting source</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-3">
              {modes.map((item) => {
                const Icon = item.icon
                const active = item.id === mode

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setMode(item.id)
                      setFile(null)
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 text-left text-sm transition hover:border-primary/40 hover:bg-white/[0.06]",
                      active ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.03] text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Meeting title" value={title} onChange={(event) => setTitle(event.target.value)} required />
              <Select value={workspaceId} onChange={(event) => setWorkspaceId(event.target.value)} required>
                <option value="">Select workspace</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.workspace_id} value={workspace.workspace_id}>
                    {workspace.name}
                  </option>
                ))}
              </Select>
            </div>

            {mode === "transcript" ? (
              <Textarea
                className="min-h-72"
                placeholder="Paste the meeting transcript here..."
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                required
              />
            ) : (
              <label className="glass-panel flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-lg border-dashed p-8 text-center transition hover:border-primary/40">
                <UploadCloud className="mb-4 size-9 text-primary" />
                <p className="font-medium">{file ? file.name : `Drop or select ${mode} file`}</p>
                <p className="mt-2 text-sm text-muted-foreground">Upload progress appears while the file is sent to FastAPI.</p>
                <input className="sr-only" type="file" accept={accept} onChange={(event) => setFile(event.target.files?.[0] || null)} required />
              </label>
            )}

            {loading || success ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {success ? <CheckCircle2 className="size-4 text-primary" /> : <Loader2 className="size-4 animate-spin text-primary" />}
                    {success ? "Processing complete" : "Uploading and processing"}
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}

            <Button className="h-10 w-full sm:w-fit" type="submit" disabled={loading || !workspaceId}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
              Process meeting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
