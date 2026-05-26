import { api } from "./api"
import type { ApiEnvelope, ChatResponse } from "@/types"

export async function queryMeeting(payload: {
  query: string
  workspace_id: string
  meeting_id: string
}) {
  const { data } = await api.post<ApiEnvelope<ChatResponse>>("/api/v1/chat/query", payload)
  return data.data
}
