import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AuditLog,
  CreateTimeEntryDto,
  Project,
  ProjectCard,
  SessionUser,
  TimeEntry,
  User,
} from './domain.types';

const CURRENT_USER_ID = 3;

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(value);
}

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(value);
}

@Injectable()
export class MockStoreService {
  private readonly users: User[] = [
    {
      id: 1,
      name: 'Manuel Moraes',
      initials: 'MM',
      email: 'manuel@envision.com',
      role: 'admin',
      status: 'ativo',
      lastLogin: '27/04/2026 09:15',
      dept: 'P&D',
      hours: 0,
    },
    {
      id: 2,
      name: 'Ana Silva',
      initials: 'AS',
      email: 'ana.silva@envision.com',
      role: 'gestor',
      status: 'ativo',
      lastLogin: '27/04/2026 08:30',
      dept: 'P&D',
      hours: 48,
    },
    {
      id: 3,
      name: 'Carlos Pereira',
      initials: 'CP',
      email: 'carlos@envision.com',
      role: 'colaborador',
      status: 'ativo',
      lastLogin: '26/04/2026 17:45',
      dept: 'P&D',
      hours: 136,
    },
    {
      id: 4,
      name: 'Fernanda Costa',
      initials: 'FC',
      email: 'fernanda@envision.com',
      role: 'colaborador',
      status: 'ativo',
      lastLogin: '25/04/2026 16:00',
      dept: 'P&D',
      hours: 124,
    },
    {
      id: 5,
      name: 'Ricardo Lima',
      initials: 'RL',
      email: 'ricardo@envision.com',
      role: 'colaborador',
      status: 'ativo',
      lastLogin: '27/04/2026 10:00',
      dept: 'P&D',
      hours: 98,
    },
    {
      id: 7,
      name: 'Pedro Alves',
      initials: 'PA',
      email: 'pedro@envision.com',
      role: 'gestor',
      status: 'ativo',
      lastLogin: '26/04/2026 14:20',
      dept: 'P&D',
      hours: 56,
    },
    {
      id: 8,
      name: 'Luciana Ferreira',
      initials: 'LF',
      email: 'luciana@envision.com',
      role: 'colaborador',
      status: 'ativo',
      lastLogin: '26/04/2026 11:30',
      dept: 'P&D',
      hours: 88,
    },
  ];

  private readonly projects: Project[] = [
    {
      id: 1,
      name: 'Projeto Alpha',
      description: 'Desenvolvimento do módulo principal do sistema de controle de horas',
      status: 'ativo',
      responsibleId: 2,
      memberIds: [3, 4, 5],
      totalHours: 320,
      estimatedHours: 400,
      startDate: '01/03/2026',
    },
    {
      id: 2,
      name: 'Projeto Beta',
      description: 'Integração com sistemas e APIs legadas do departamento de P&D',
      status: 'ativo',
      responsibleId: 2,
      memberIds: [3, 5, 8],
      totalHours: 180,
      estimatedHours: 200,
      startDate: '15/03/2026',
    },
    {
      id: 3,
      name: 'Projeto Gamma',
      description: 'Análise de requisitos, documentação técnica e pesquisa UX',
      status: 'ativo',
      responsibleId: 7,
      memberIds: [4],
      totalHours: 95,
      estimatedHours: 120,
      startDate: '01/04/2026',
    },
    {
      id: 5,
      name: 'Projeto Epsilon',
      description: 'Pesquisa e prova de conceito de novas tecnologias para inovação em P&D',
      status: 'ativo',
      responsibleId: 7,
      memberIds: [4, 5, 8],
      totalHours: 67,
      estimatedHours: 160,
      startDate: '01/04/2026',
    },
  ];

  private readonly timeEntries: TimeEntry[] = [
    {
      id: 1,
      userId: 3,
      projectId: 1,
      date: '27/04/2026',
      hours: 4,
      justification: 'Implementação do módulo de autenticação SSO com Keycloak — configuração OIDC',
      status: 'confirmado',
    },
    {
      id: 2,
      userId: 3,
      projectId: 2,
      date: '27/04/2026',
      hours: 4,
      justification: 'Mapeamento de endpoints da API legada e documentação OpenAPI 3.0',
      status: 'confirmado',
    },
    {
      id: 7,
      userId: 3,
      projectId: 1,
      date: '24/04/2026',
      hours: 5,
      justification: 'Code review e resolução de conflitos no branch de feature/dashboard',
      status: 'confirmado',
    },
    {
      id: 10,
      userId: 3,
      projectId: 2,
      date: '22/04/2026',
      hours: 4,
      justification: 'Documentação dos contratos de API e geração automática via Swagger',
      status: 'confirmado',
    },
  ];

  private readonly auditLogs: AuditLog[] = [
    {
      id: 1,
      timestamp: '27/04/2026, 09:15:32',
      user: 'Manuel Moraes',
      action: 'LOGIN',
      entity: 'Sistema',
      detail: 'Login realizado com sucesso via Keycloak SSO',
    },
    {
      id: 2,
      timestamp: '27/04/2026, 09:02:14',
      user: 'Carlos Pereira',
      action: 'CREATE',
      entity: 'TimeEntry',
      detail: 'Lançamento de 4h no Projeto Alpha (27/04)',
    },
  ];

  getCurrentUser(): SessionUser {
    const user = this.findUserOrThrow(CURRENT_USER_ID);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      dept: user.dept,
    };
  }

  getAssignedProjectsForCurrentUser(): ProjectCard[] {
    const user = this.findUserOrThrow(CURRENT_USER_ID);

    return this.projects
      .filter((project) => project.status === 'ativo' && project.memberIds.includes(user.id))
      .map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        responsibleName: this.findUserOrThrow(project.responsibleId).name,
        totalHours: project.totalHours,
        estimatedHours: project.estimatedHours,
        startDate: project.startDate,
      }));
  }

  getTimeEntriesForCurrentUser(): TimeEntry[] {
    return [...this.timeEntries]
      .filter((entry) => entry.userId === CURRENT_USER_ID)
      .sort((left, right) => right.id - left.id);
  }

  createTimeEntryForCurrentUser(input: CreateTimeEntryDto): TimeEntry {
    const user = this.findUserOrThrow(CURRENT_USER_ID);

    if (user.role !== 'colaborador') {
      throw new ForbiddenException('Somente colaboradores podem lançar horas.');
    }

    const project = this.projects.find((candidate) => candidate.id === input.projectId);
    if (!project || project.status !== 'ativo') {
      throw new NotFoundException('Projeto ativo não encontrado para lançamento.');
    }

    if (!project.memberIds.includes(user.id)) {
      throw new ForbiddenException('O colaborador atual não está alocado neste projeto.');
    }

    if (!Number.isFinite(input.hours) || input.hours <= 0 || input.hours > 220) {
      throw new BadRequestException('As horas devem ser maiores que zero e no máximo 220 por mês.');
    }

    const justification = input.justification.trim();
    if (justification.length < 10) {
      throw new BadRequestException('A justificativa precisa ter ao menos 10 caracteres.');
    }

    const createdEntry: TimeEntry = {
      id: this.nextTimeEntryId(),
      userId: user.id,
      projectId: project.id,
      date: formatDate(new Date()),
      hours: input.hours,
      justification,
      status: 'confirmado',
    };

    this.timeEntries.push(createdEntry);
    project.totalHours += createdEntry.hours;
    user.hours += createdEntry.hours;

    this.auditLogs.push({
      id: this.auditLogs.length + 1,
      timestamp: formatTimestamp(new Date()),
      user: user.name,
      action: 'CREATE',
      entity: 'TimeEntry',
      detail: `Lançamento de ${createdEntry.hours}h no ${project.name} (${createdEntry.date})`,
    });

    return createdEntry;
  }

  getTimeEntrySummaryForCurrentUser() {
    const entries = this.getTimeEntriesForCurrentUser();
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

    return {
      count: entries.length,
      totalHours,
      activeProjectCount: this.getAssignedProjectsForCurrentUser().length,
    };
  }

  private findUserOrThrow(userId: number): User {
    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado na base inicial.');
    }
    return user;
  }

  private nextTimeEntryId(): number {
    return Math.max(...this.timeEntries.map((entry) => entry.id)) + 1;
  }
}