const DB = {

  users: [
    { id: 1, name: 'Manuel Moraes',   initials: 'MM', email: 'manuel@envision.com',   role: 'admin',       status: 'ativo',   lastLogin: '27/04/2026 09:15', dept: 'P&D', hours: 0   },
    { id: 2, name: 'Ana Silva',        initials: 'AS', email: 'ana.silva@envision.com', role: 'gestor',      status: 'ativo',   lastLogin: '27/04/2026 08:30', dept: 'P&D', hours: 48  },
    { id: 3, name: 'Carlos Pereira',   initials: 'CP', email: 'carlos@envision.com',    role: 'colaborador', status: 'ativo',   lastLogin: '26/04/2026 17:45', dept: 'P&D', hours: 136 },
    { id: 4, name: 'Fernanda Costa',   initials: 'FC', email: 'fernanda@envision.com',  role: 'colaborador', status: 'ativo',   lastLogin: '25/04/2026 16:00', dept: 'P&D', hours: 124 },
    { id: 5, name: 'Ricardo Lima',     initials: 'RL', email: 'ricardo@envision.com',   role: 'colaborador', status: 'ativo',   lastLogin: '27/04/2026 10:00', dept: 'P&D', hours: 98  },
    { id: 6, name: 'Juliana Santos',   initials: 'JS', email: 'juliana@envision.com',   role: 'colaborador', status: 'inativo', lastLogin: '15/03/2026 09:00', dept: 'P&D', hours: 210 },
    { id: 7, name: 'Pedro Alves',      initials: 'PA', email: 'pedro@envision.com',     role: 'gestor',      status: 'ativo',   lastLogin: '26/04/2026 14:20', dept: 'P&D', hours: 56  },
    { id: 8, name: 'Luciana Ferreira', initials: 'LF', email: 'luciana@envision.com',   role: 'colaborador', status: 'ativo',   lastLogin: '26/04/2026 11:30', dept: 'P&D', hours: 88  },
  ],

  projects: [
    { id: 1, name: 'Projeto Alpha',   desc: 'Desenvolvimento do módulo principal do sistema de controle de horas',   status: 'ativo',   responsible: 2, members: [3, 4, 5],    total: 320, estimated: 400, start: '01/03/2026' },
    { id: 2, name: 'Projeto Beta',    desc: 'Integração com sistemas e APIs legadas do departamento de P&D',          status: 'ativo',   responsible: 2, members: [3, 5, 8],    total: 180, estimated: 200, start: '15/03/2026' },
    { id: 3, name: 'Projeto Gamma',   desc: 'Análise de requisitos, documentação técnica e pesquisa UX',              status: 'ativo',   responsible: 7, members: [4],          total: 95,  estimated: 120, start: '01/04/2026' },
    { id: 4, name: 'Projeto Delta',   desc: 'Refatoração e modernização do módulo de relatórios (concluído)',         status: 'inativo', responsible: 2, members: [3],          total: 440, estimated: 400, start: '01/01/2026' },
    { id: 5, name: 'Projeto Epsilon', desc: 'Pesquisa e prova de conceito de novas tecnologias para inovação em P&D', status: 'ativo',   responsible: 7, members: [4, 5, 8],    total: 67,  estimated: 160, start: '01/04/2026' },
  ],

  timeEntries: [
    { id: 1,  userId: 3, projectId: 1, date: '27/04/2026', hours: 4.0, justification: 'Implementação do módulo de autenticação SSO com Keycloak — configuração OIDC',            status: 'confirmado' },
    { id: 2,  userId: 3, projectId: 2, date: '27/04/2026', hours: 4.0, justification: 'Mapeamento de endpoints da API legada e documentação OpenAPI 3.0',                         status: 'confirmado' },
    { id: 3,  userId: 4, projectId: 1, date: '26/04/2026', hours: 6.0, justification: 'Desenvolvimento dos componentes React para dashboard gerencial (KPIs e gráficos)',         status: 'confirmado' },
    { id: 4,  userId: 4, projectId: 3, date: '26/04/2026', hours: 2.0, justification: 'Atualização da documentação de requisitos funcionais e não-funcionais',                    status: 'confirmado' },
    { id: 5,  userId: 5, projectId: 1, date: '25/04/2026', hours: 8.0, justification: 'Configuração do ambiente de staging e pipeline CI/CD com GitHub Actions',                 status: 'confirmado' },
    { id: 6,  userId: 5, projectId: 2, date: '24/04/2026', hours: 4.0, justification: 'Testes de integração com sistema legado v2 e correção de 3 bugs críticos',                status: 'confirmado' },
    { id: 7,  userId: 3, projectId: 1, date: '24/04/2026', hours: 5.0, justification: 'Code review e resolução de conflitos no branch de feature/dashboard',                     status: 'confirmado' },
    { id: 8,  userId: 4, projectId: 1, date: '23/04/2026', hours: 7.0, justification: 'Implementação das telas de lançamento de horas — Sprint 2',                               status: 'confirmado' },
    { id: 9,  userId: 5, projectId: 5, date: '22/04/2026', hours: 3.0, justification: 'Análise de viabilidade de tecnologias — PoC com React 19 e Bun.js',                       status: 'confirmado' },
    { id: 10, userId: 3, projectId: 2, date: '22/04/2026', hours: 4.0, justification: 'Documentação dos contratos de API e geração automática via Swagger',                       status: 'confirmado' },
    { id: 11, userId: 4, projectId: 1, date: '21/04/2026', hours: 8.0, justification: 'Desenvolvimento da tela de histórico com filtros de período e projeto',                   status: 'confirmado' },
    { id: 12, userId: 8, projectId: 2, date: '25/04/2026', hours: 5.0, justification: 'Migração de dados do sistema legado para a nova estrutura PostgreSQL',                    status: 'confirmado' },
    { id: 13, userId: 8, projectId: 5, date: '24/04/2026', hours: 4.0, justification: 'Revisão de literatura técnica sobre arquitetura de microsserviços',                        status: 'confirmado' },
  ],

  auditLogs: [
    { id: 1,  ts: '27/04/2026 09:15:32', user: 'Manuel Moraes',  action: 'LOGIN',  entity: 'Sistema',   detail: 'Login realizado com sucesso via Keycloak SSO' },
    { id: 2,  ts: '27/04/2026 09:02:14', user: 'Carlos Pereira', action: 'CREATE', entity: 'TimeEntry', detail: 'Lançamento de 4h no Projeto Alpha (27/04)' },
    { id: 3,  ts: '27/04/2026 08:58:45', user: 'Carlos Pereira', action: 'CREATE', entity: 'TimeEntry', detail: 'Lançamento de 4h no Projeto Beta (27/04)' },
    { id: 4,  ts: '27/04/2026 08:30:10', user: 'Ana Silva',      action: 'LOGIN',  entity: 'Sistema',   detail: 'Login realizado com sucesso via Keycloak SSO' },
    { id: 5,  ts: '26/04/2026 17:30:00', user: 'Fernanda Costa', action: 'CREATE', entity: 'TimeEntry', detail: 'Lançamento de 6h no Projeto Alpha e 2h no Gamma' },
    { id: 6,  ts: '26/04/2026 14:20:00', user: 'Pedro Alves',    action: 'UPDATE', entity: 'Projeto',   detail: 'Projeto Gamma: status atualizado para ativo' },
    { id: 7,  ts: '25/04/2026 10:00:00', user: 'Manuel Moraes',  action: 'CREATE', entity: 'Usuário',   detail: 'Novo usuário criado: Luciana Ferreira (colaborador)' },
    { id: 8,  ts: '24/04/2026 16:45:00', user: 'Ana Silva',      action: 'UPDATE', entity: 'Alocação',  detail: 'Luciana Ferreira alocada ao Projeto Beta e Epsilon' },
    { id: 9,  ts: '23/04/2026 09:00:00', user: 'Manuel Moraes',  action: 'UPDATE', entity: 'Usuário',   detail: 'Status de Juliana Santos alterado para inativo' },
    { id: 10, ts: '22/04/2026 11:30:00', user: 'Ana Silva',      action: 'CREATE', entity: 'Projeto',   detail: 'Projeto Epsilon criado com equipe de 3 membros' },
  ],

    chartData: {
        horasPorProjeto: {
      labels: ['Alpha', 'Beta', 'Gamma', 'Epsilon'],
      values: [320, 180, 95, 67],
    },
        distribuicao: {
      labels: ['Carlos', 'Fernanda', 'Ricardo', 'Luciana'],
      values: [136, 124, 98, 88],
    },
        atividadeDiaria: {
      labels: ['21/Abr', '22/Abr', '23/Abr', '24/Abr', '25/Abr', '26/Abr', 'Hoje'],
      values: [8, 12, 11, 9, 14, 10, 6],
    },
        minhasHoras: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Seg', 'Hoje'],
      values: [4, 6, 5, 7, 8, 4, 8],
    },
  },
};

function getUserById(id) {
  return DB.users.find(u => u.id === id) || {};
}

function getProjectById(id) {
  return DB.projects.find(p => p.id === id) || {};
}

function getProjectsForUser(userId) {
  return DB.projects.filter(p => p.members.includes(userId) && p.status === 'ativo');
}

function getEntriesForUser(userId) {
  return DB.timeEntries
    .filter(e => e.userId === userId)
    .sort((a, b) => b.id - a.id);
}

function getTotalHoursThisMonth(userId) {
  return DB.timeEntries
    .filter(e => e.userId === userId)
    .reduce((sum, e) => sum + e.hours, 0);
}

function getAvatarClass(role) {
  if (role === 'gestor')      return 'av-gestor';
  if (role === 'admin')       return 'av-admin';
  return 'av-colaborador';
}

function roleBadge(role) {
  if (role === 'admin')       return '<span class="badge badge-primary">Admin</span>';
  if (role === 'gestor')      return '<span class="badge badge-accent">Gestor</span>';
  return '<span class="badge badge-purple">Colaborador</span>';
}

function statusBadge(status) {
  if (status === 'ativo')   return '<span class="badge badge-accent">● Ativo</span>';
  if (status === 'inativo') return '<span class="badge badge-gray">○ Inativo</span>';
  return '<span class="badge badge-warning">Pendente</span>';
}

function progressColor(done, total) {
  const pct = done / total;
  if (pct >= 1.0) return 'over';
  if (pct >= 0.85) return 'near';
  return 'ok';
}
