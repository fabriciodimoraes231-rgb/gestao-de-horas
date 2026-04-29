export type UserRole = 'admin' | 'gestor' | 'colaborador';
export type RecordStatus = 'ativo' | 'inativo';
export type TimeEntryStatus = 'confirmado';

export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  status: RecordStatus;
  lastLogin: string;
  dept: string;
  hours: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: RecordStatus;
  responsibleId: number;
  memberIds: number[];
  totalHours: number;
  estimatedHours: number;
  startDate: string;
}

export interface TimeEntry {
  id: number;
  userId: number;
  projectId: number;
  date: string;
  hours: number;
  justification: string;
  status: TimeEntryStatus;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: 'LOGIN' | 'CREATE' | 'UPDATE';
  entity: string;
  detail: string;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  dept: string;
}

export interface ProjectCard {
  id: number;
  name: string;
  description: string;
  responsibleName: string;
  totalHours: number;
  estimatedHours: number;
  startDate: string;
}

export class CreateTimeEntryDto {
  projectId!: number;
  hours!: number;
  justification!: string;
}