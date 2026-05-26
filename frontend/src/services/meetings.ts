import { api } from "./api"
import type { ApiEnvelope, MeetingDetail, MeetingListItem } from "@/types"

export async function getMeetings() {
  const { data } = await api.get<ApiEnvelope<MeetingListItem[]>>("/api/v1/meetings/")
  return data.data
}

export async function getWorkspaceMeetings(workspaceId: string) {
  const { data } = await api.get<ApiEnvelope<MeetingListItem[]>>(
    `/api/v1/meetings/workspace/${workspaceId}`
  )
  return data.data
}

export async function getMeeting(meetingId: string) {
  const { data } = await api.get<ApiEnvelope<MeetingDetail>>(`/api/v1/meetings/${meetingId}`)
  return data.data
}

export async function uploadTranscript(payload: {
  title: string
  workspace_id: string
  transcript: string
}) {
  const { data } = await api.post("/api/v1/meetings/upload", payload)
  return data
}

export async function uploadAudio(payload: {
  title: string
  workspace_id: string
  file: File
  onUploadProgress?: (progress: number) => void
}) {
  const form = new FormData()
  form.append("audio", payload.file)

  const { data } = await api.post("/api/v1/meetings/upload-audio", form, {
    params: { title: payload.title, workspace_id: payload.workspace_id },
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (event.total && payload.onUploadProgress) {
        payload.onUploadProgress(Math.round((event.loaded / event.total) * 100))
      }
    },
  })

  return data
}

export async function uploadVideo(payload: {
  title: string
  workspace_id: string
  file: File
  onUploadProgress?: (progress: number) => void
}) {
  const form = new FormData()
  form.append("video", payload.file)

  const { data } = await api.post("/api/v1/meetings/upload-video", form, {
    params: { title: payload.title, workspace_id: payload.workspace_id },
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (event.total && payload.onUploadProgress) {
        payload.onUploadProgress(Math.round((event.loaded / event.total) * 100))
      }
    },
  })

  return data
}
