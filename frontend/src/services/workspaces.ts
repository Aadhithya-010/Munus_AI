import { api } from "./api"
import type { ApiEnvelope, Workspace } from "@/types"

export async function getWorkspaces() {
  const { data } = await api.get<ApiEnvelope<Workspace[]>>("/api/v1/workspaces/")
  return data.data
}

export async function createWorkspace(name: string) {
  const { data } = await api.post<ApiEnvelope<Workspace>>(
    "/api/v1/workspaces/",
    null,
    { params: { name } }
  )

  return data.data
}
