export type ApiEnvelope<T> = {
  success: boolean
  message?: string
  count?: number
  data: T
}

export type User = {
  email: string
}

export type Workspace = {
  workspace_id: string
  name: string
  meeting_count?: number
}

export type MeetingListItem = {
  meeting_id: string
  title: string
  workspace_id?: string
  created_at?: string
}

export type MeetingDetail = {
  meeting_id: string
  title: string
  summary: string
  tasks: string | string[]
  transcript: string
  workspace_id: string
  created_by: string
  created_at: string
}

export type ChatResponse = {
  answer: string
  retrieved_context: string[]
  chat_record: {
    meeting_id: string
    workspace_id: string
    query: string
    response: string
    timestamp: string
  }
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  pending?: boolean
}
