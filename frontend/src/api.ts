import type {
  CreateTimeEntryPayload,
  CreateTimeEntryResponse,
  ProjectCard,
  SessionUser,
  TimeEntriesResponse,
} from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? ((await response.json()) as T | { message?: string }) : null

  if (!response.ok) {
    const errorPayload = payload !== null && typeof payload === 'object' ? payload : null
    const message =
      errorPayload && 'message' in errorPayload && typeof errorPayload.message === 'string'
        ? errorPayload.message
        : 'A requisição falhou.'

    throw new Error(message)
  }

  return payload as T
}

export function getCurrentSession() {
  return request<SessionUser>('/session/me')
}

export function getAssignedProjects() {
  return request<ProjectCard[]>('/projects/mine')
}

export function getMyTimeEntries() {
  return request<TimeEntriesResponse>('/time-entries/mine')
}

export function createTimeEntry(payload: CreateTimeEntryPayload) {
  return request<CreateTimeEntryResponse>('/time-entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}