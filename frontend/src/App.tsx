import { useEffect } from 'react'
import {
  createTimeEntry,
  getAssignedProjects,
  getCurrentSession,
  getMyTimeEntries,
} from './api'
interface WireframeUser {
  id: number
  name: string
  initials: string
  email: string
  role: 'admin' | 'gestor' | 'colaborador'
  status: 'ativo' | 'inativo'
  lastLogin: string
  dept: string
  hours: number
}

interface WireframeProject {
  id: number
  name: string
  desc: string
  status: 'ativo' | 'inativo'
  responsible: number
  members: number[]
  total: number
  estimated: number
  start: string
  specialist?: {
    name: string
    area: string
    bio: string
  }
}

interface WireframeEntry {
  id: number
  userId: number
  projectId: number
  date: string
  hours: number
  justification: string
  status: 'confirmado'
}

interface WireframeDatabase {
  users: WireframeUser[]
  projects: WireframeProject[]
  timeEntries: WireframeEntry[]
}

declare global {
  interface Window {
    DB?: WireframeDatabase
    navigate?: (pageId: string, params?: Record<string, unknown>) => void
    submitLancamento?: (event: Event) => Promise<void> | void
    showToast?: (title: string, message: string, type?: string) => void
    lucide?: {
      createIcons: () => void
    }
    __wireframeState?: {
      page?: string
      profile?: string
    }
    __wireframeDefaultPage?: Record<string, string>
  }
}

const WIREFRAME_SHELL = `
<a href="#content" class="skip-link">Pular para o conteúdo principal</a>

<div id="login-screen" class="login-screen">
  <div class="login-brand">
    <div class="login-logo">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="52" rx="13" fill="white" fill-opacity="0.18"/>
        <rect x="1" y="1" width="50" height="50" rx="12" stroke="white" stroke-opacity="0.3" stroke-width="1"/>
        <text x="26" y="36" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="24" font-weight="700">E</text>
      </svg>
      <div>
        <div class="login-logo-title">Envision</div>
        <div class="login-logo-sub">Pesquisa &amp; Desenvolvimento</div>
      </div>
    </div>
  </div>

  <div class="login-card">
    <h1 class="login-title">Bem-vindo de volta</h1>
    <p class="login-subtitle">Entre com sua conta corporativa para acessar o sistema de controle de horas</p>

    <form onsubmit="handleLogin(event)" autocomplete="off">
      <div class="form-group">
        <label class="form-label" for="login-email">E-mail corporativo</label>
        <input type="email" id="login-email" class="form-input" placeholder="nome@envision.com" value="manuel@envision.com" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="login-password">Senha</label>
        <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn btn-primary btn-full btn-lg" id="btn-login">
        <i data-lucide="log-in"></i>
        Entrar via Keycloak SSO
      </button>
    </form>

    <div class="login-footer">
      <i data-lucide="shield-check"></i>
      <span>Autenticação segura gerenciada pelo Keycloak</span>
    </div>
    <div class="login-help">
      <i data-lucide="help-circle"></i>
      <span>Problemas de acesso? <a href="#" onclick="showToast('Suporte','Contate o time de TI: ti@envision.com','info'); return false;">Contate o TI</a></span>
    </div>
  </div>

  <div class="login-demo-hint">
    <i data-lucide="info"></i>
    <span>Protótipo interativo — clique em "Entrar" e use as abas <strong>Admin · Gestor · Colaborador</strong> para explorar os perfis</span>
  </div>
</div>

<div id="app-shell" class="app-shell hidden">
  <aside id="sidebar" class="sidebar" role="navigation" aria-label="Menu principal">
    <div class="sidebar-header">
      <svg width="34" height="34" viewBox="0 0 52 52" fill="none">
        <rect width="52" height="52" rx="12" fill="white" fill-opacity="0.12"/>
        <text x="26" y="36" text-anchor="middle" fill="white" font-family="Inter,sans-serif" font-size="22" font-weight="700">E</text>
      </svg>
      <div class="sidebar-header-text">
        <div class="sidebar-brand">Envision</div>
        <div class="sidebar-subbrand">P&amp;D — RD2</div>
      </div>
    </div>

    <nav id="sidebar-nav" class="sidebar-nav" aria-label="Navegação do sistema"></nav>

    <div class="sidebar-footer">
      <div class="sidebar-user" onclick="navigate('perfil')">
        <div id="sidebar-avatar" class="avatar avatar-sm av-admin">MM</div>
        <div class="sidebar-user-info">
          <div id="sidebar-username" class="sidebar-user-name">Manuel Moraes</div>
          <div id="sidebar-userrole" class="sidebar-user-role">Administrador</div>
        </div>
      </div>
    </div>
  </aside>

  <div class="main-wrapper">
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-icon" onclick="toggleSidebar()" title="Menu">
          <i data-lucide="menu"></i>
        </button>
        <span id="breadcrumb" class="breadcrumb">Dashboard</span>
      </div>

      <div class="topbar-right">
        <div class="profile-switcher" title="Trocar perfil de demonstração">
          <span style="font-size:11px;color:var(--text-muted);font-weight:600;">Demo:</span>
          <div class="profile-tabs">
            <button class="profile-tab active" data-profile="admin" onclick="switchProfile('admin')">Admin</button>
            <button class="profile-tab" data-profile="gestor" onclick="switchProfile('gestor')">Gestor</button>
            <button class="profile-tab" data-profile="colaborador" onclick="switchProfile('colaborador')">Colaborador</button>
          </div>
        </div>

        <div class="notif-wrapper">
          <button class="btn-icon" title="Notificações" aria-label="Notificações" aria-haspopup="true" onclick="toggleNotifications()" style="position:relative;">
            <i data-lucide="bell"></i>
            <span class="notification-dot"></span>
          </button>
          <div id="notif-dropdown" class="notif-dropdown hidden" role="menu" aria-label="Notificações">
            <div class="notif-dropdown-header">
              <span class="font-semibold text-sm">Notificações</span>
              <span class="badge badge-primary">3 novas</span>
            </div>
            <div class="notif-list">
              <div class="notif-item unread">
                <i data-lucide="clock" class="notif-item-icon text-warning"></i>
                <div class="notif-item-content">
                  <div class="notif-item-title">Ana Silva submeteu horas</div>
                  <div class="notif-item-time">Há 2 horas</div>
                </div>
              </div>
              <div class="notif-item unread">
                <i data-lucide="alert-triangle" class="notif-item-icon text-danger"></i>
                <div class="notif-item-content">
                  <div class="notif-item-title">Projeto Delta excedeu o orçamento</div>
                  <div class="notif-item-time">Há 5 horas</div>
                </div>
              </div>
              <div class="notif-item unread">
                <i data-lucide="user-plus" class="notif-item-icon text-accent"></i>
                <div class="notif-item-content">
                  <div class="notif-item-title">Luciana Ferreira criada no sistema</div>
                  <div class="notif-item-time">Ontem</div>
                </div>
              </div>
              <div class="notif-item">
                <i data-lucide="check-circle" class="notif-item-icon text-accent"></i>
                <div class="notif-item-content">
                  <div class="notif-item-title">Backup realizado com sucesso</div>
                  <div class="notif-item-time">Ontem 03:00</div>
                </div>
              </div>
            </div>
            <div class="notif-dropdown-footer">
              <button class="btn btn-ghost btn-sm btn-full" onclick="toggleNotifications(); showToast('Notificações','Todas marcadas como lidas.','info')">Marcar todas como lidas</button>
            </div>
          </div>
        </div>

        <button class="btn-icon" title="Alternar tema" aria-label="Alternar modo escuro" onclick="toggleDarkMode()">
          <i data-lucide="moon" id="theme-icon"></i>
        </button>

        <div class="topbar-user" onclick="navigate('perfil')">
          <div id="topbar-avatar" class="avatar avatar-sm av-admin">MM</div>
          <span id="topbar-name">Manuel Moraes</span>
          <i data-lucide="chevron-down" style="width:14px;height:14px;color:var(--text-muted);"></i>
        </div>

        <button class="btn-icon btn-danger-hover" onclick="handleLogout()" title="Sair do sistema">
          <i data-lucide="log-out"></i>
        </button>
      </div>
    </header>

    <main id="content" class="content" role="main" aria-live="polite"></main>

    <footer class="footer">
      <span>© 2026 Envision P&amp;D — Sistema de Controle de Horas <strong>v1.1.0</strong></span>
      <span style="margin: 0 var(--space-md); color: var(--border);">|</span>
      <span style="color: var(--accent);">● Online</span>
      <span style="margin: 0 var(--space-md); color: var(--border);">|</span>
      <span>Keycloak SSO ativo</span>
    </footer>
  </div>
</div>

<div id="toast-container"></div>
`

let currentCollaboratorId: number | null = null
let fallbackSubmitLancamento: ((event: Event) => void | Promise<void>) | undefined

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('')
}

function emitToast(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
  window.showToast?.(title, message, type)
}

function getActivePage(): string {
  const activeItem = document.querySelector<HTMLElement>('.sidebar-item.active')
  return activeItem?.dataset.page ?? window.__wireframeState?.page ?? 'dashboard-admin'
}

function refreshCurrentPage() {
  const appShell = document.getElementById('app-shell')

  if (!appShell || appShell.classList.contains('hidden')) {
    return
  }

  window.navigate?.(getActivePage())
}

async function syncCollaboratorData() {
  const database = window.DB
  if (!database) {
    return
  }

  try {
    const [sessionUser, assignedProjects, timeEntries] = await Promise.all([
      getCurrentSession(),
      getAssignedProjects(),
      getMyTimeEntries(),
    ])

    currentCollaboratorId = sessionUser.id

    const collaborator = database.users.find((user) => user.id === sessionUser.id)

    if (collaborator) {
      collaborator.name = sessionUser.name
      collaborator.initials = getInitials(sessionUser.name)
      collaborator.email = sessionUser.email
      collaborator.role = sessionUser.role
      collaborator.dept = sessionUser.dept
      collaborator.status = 'ativo'
      collaborator.hours = timeEntries.summary.totalHours
    }

    const assignedIds = new Set(assignedProjects.map((project) => project.id))

    database.projects.forEach((project) => {
      project.members = project.members.filter((memberId) => memberId !== sessionUser.id || assignedIds.has(project.id))
    })

    assignedProjects.forEach((project) => {
      const existingProject = database.projects.find((candidate) => candidate.id === project.id)
      const responsibleUser = database.users.find((user) => user.name === project.responsibleName)

      if (existingProject) {
        existingProject.name = project.name
        existingProject.desc = project.description
        existingProject.status = 'ativo'
        existingProject.responsible = responsibleUser?.id ?? existingProject.responsible
        existingProject.total = project.totalHours
        existingProject.estimated = project.estimatedHours
        existingProject.start = project.startDate
        if (!existingProject.members.includes(sessionUser.id)) {
          existingProject.members.push(sessionUser.id)
        }
        return
      }

      database.projects.push({
        id: project.id,
        name: project.name,
        desc: project.description,
        status: 'ativo',
        responsible: responsibleUser?.id ?? 2,
        members: [sessionUser.id],
        total: project.totalHours,
        estimated: project.estimatedHours,
        start: project.startDate,
      })
    })

    database.timeEntries = database.timeEntries.filter((entry) => entry.userId !== sessionUser.id)

    const syncedEntries = timeEntries.items.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      projectId: entry.projectId,
      date: entry.date,
      hours: entry.hours,
      justification: entry.justification,
      status: entry.status,
    }))

    database.timeEntries.unshift(...syncedEntries)

    refreshCurrentPage()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível sincronizar o colaborador com a API.'
    emitToast('Integração parcial', message, 'warning')
  }
}

function installSubmitOverride() {
  fallbackSubmitLancamento = window.submitLancamento

  window.submitLancamento = async (event: Event) => {
    event.preventDefault()

    const database = window.DB

    if (!database || currentCollaboratorId === null) {
      await fallbackSubmitLancamento?.(event)
      return
    }

    const assignedProjects = database.projects.filter(
      (project) => project.status === 'ativo' && project.members.includes(currentCollaboratorId as number),
    )

    const payloads: Array<{ projectId: number; hours: number; justification: string }> = []

    for (const [index, project] of assignedProjects.entries()) {
      const hoursInput = document.getElementById(`hours-${index}`) as HTMLInputElement | null
      const justificationInput = document.getElementById(`just-${index}`) as HTMLTextAreaElement | null

      if (!hoursInput || !justificationInput) {
        continue
      }

      const enteredTotal = Number(hoursInput.value || 0)
      const currentTotal = database.timeEntries
        .filter((entry) => entry.userId === currentCollaboratorId && entry.projectId === project.id)
        .reduce((sum, entry) => sum + entry.hours, 0)

      if (!Number.isFinite(enteredTotal) || enteredTotal < currentTotal) {
        emitToast(
          'Valor inválido',
          `O total informado para ${project.name} não pode ser menor que as ${currentTotal}h já registradas.`,
          'error',
        )
        return
      }

      const delta = Number((enteredTotal - currentTotal).toFixed(2))
      const justification = justificationInput.value.trim()

      if (delta === 0) {
        continue
      }

      if (justification.length < 10) {
        emitToast('Justificativa insuficiente', `A justificativa de ${project.name} precisa ter ao menos 10 caracteres.`, 'error')
        return
      }

      payloads.push({
        projectId: project.id,
        hours: delta,
        justification,
      })
    }

    if (!payloads.length) {
      emitToast('Nenhuma diferença', 'Nenhuma nova hora foi informada para envio.', 'info')
      return
    }

    try {
      for (const payload of payloads) {
        await createTimeEntry(payload)
      }

      await syncCollaboratorData()
      window.navigate?.('confirmacao-lancamento')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível registrar as horas do mês.'
      emitToast('Falha ao registrar', message, 'error')
    }
  }
}

function App() {
  useEffect(() => {
    const initializeWireframe = () => {
      window.lucide?.createIcons()
      installSubmitOverride()
      void syncCollaboratorData()
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeWireframe, { once: true })

      return () => {
        document.removeEventListener('DOMContentLoaded', initializeWireframe)
      }
    }

    initializeWireframe()

    return undefined
  }, [])

  return <div dangerouslySetInnerHTML={{ __html: WIREFRAME_SHELL }} />
}

export default App
