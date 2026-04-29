export interface SessionUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'gestor' | 'colaborador'
  dept: string
}

export interface ProjectCard {
  id: number
  name: string
  description: string
  responsibleName: string
  totalHours: number
  estimatedHours: number
  startDate: string
}

export interface TimeEntryRecord {
  id: number
  userId: number
  projectId: number
  date: string
  hours: number
  justification: string
  status: 'confirmado'
}

export interface TimeEntriesSummary {
  count: number
  totalHours: number
  activeProjectCount: number
}

export interface TimeEntriesResponse {
  summary: TimeEntriesSummary
  items: TimeEntryRecord[]
}

export interface CreateTimeEntryPayload {
  projectId: number
  hours: number
  justification: string
}

export interface CreateTimeEntryResponse {
  message: string
  entry: TimeEntryRecord
  summary: TimeEntriesSummary
}