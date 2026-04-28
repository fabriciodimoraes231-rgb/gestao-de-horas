const state = {
  profile: 'admin',   /* admin | gestor | colaborador */
  page: null,
  params: {},
};

const DEMO_USERS = {
  admin:       DB.users.find(u => u.role === 'admin'),
  gestor:      DB.users.find(u => u.role === 'gestor'),
  colaborador: DB.users.find(u => u.role === 'colaborador'),
};

const SIDEBAR_MENUS = {
  admin: [
    { id: 'dashboard-admin',  label: 'Dashboard',           icon: 'layout-dashboard' },
    { id: 'submissoes',       label: 'Submissões Mensais',  icon: 'calendar-check' },
    { id: 'usuarios',         label: 'Usuários',            icon: 'users' },
    { id: 'auditoria',        label: 'Logs de Auditoria',   icon: 'shield-check' },
    { id: 'configuracoes',    label: 'Configurações',       icon: 'settings' },
    { id: 'permissoes',       label: 'Perfis & Permissões', icon: 'key' },
  ],
  gestor: [
    { id: 'dashboard-gestor', label: 'Dashboard',         icon: 'layout-dashboard' },
    { id: 'projetos',         label: 'Projetos',          icon: 'folder-open' },
    { id: 'relatorios',       label: 'Relatórios',        icon: 'bar-chart-2' },
    { id: 'horas-todos',      label: 'Visualizar Horas',  icon: 'clock' },
    { id: 'alocacao',         label: 'Alocação de Equipe', icon: 'users' },
    { id: 'lancar-horas',     label: 'Lançar Horas',      icon: 'plus-circle' },
  ],
  colaborador: [
    { id: 'dashboard-colaborador', label: 'Dashboard',    icon: 'layout-dashboard' },
    { id: 'lancar-horas',          label: 'Lançar Horas', icon: 'plus-circle' },
    { id: 'historico',             label: 'Meu Histórico', icon: 'list' },
    { id: 'perfil',                label: 'Meu Perfil',   icon: 'user' },
  ],
};

const DEFAULT_PAGE = {
  admin:       'dashboard-admin',
  gestor:      'dashboard-gestor',
  colaborador: 'dashboard-colaborador',
};

const PAGE_TITLES = {
  'dashboard-admin':       'Dashboard',
  'submissoes':            'Submissões Mensais',
  'usuarios':              'Gerenciamento de Usuários',
  'auditoria':             'Logs de Auditoria',
  'configuracoes':         'Configurações do Sistema',
  'permissoes':            'Perfis & Permissões',
  'dashboard-gestor':      'Dashboard Gerencial',
  'projetos':              'Gestão de Projetos',
  'detalhe-projeto':       'Detalhes do Projeto',
  'relatorios':            'Relatórios',
  'horas-todos':           'Visualização de Horas',
  'alocacao':              'Alocação de Equipe',
  'dashboard-colaborador': 'Dashboard',
  'lancar-horas':          'Lançar Horas',
  'historico':             'Meu Histórico',
  'perfil':                'Meu Perfil',
};

/* Breadcrumb hierarchy map */
const BREADCRUMB_PARENT = {
  'detalhe-projeto': { label: 'Projetos', page: 'projetos' },
  'confirmacao-lancamento': { label: 'Lançar Horas', page: 'lancar-horas' },
};

function navigate(pageId, params = {}) {
  state.page = pageId;
  state.params = params;

  // Update breadcrumb with hierarchy
  const bc = document.getElementById('breadcrumb');
  const parent = BREADCRUMB_PARENT[pageId];
  const title = PAGE_TITLES[pageId] || pageId;
  if (parent) {
    bc.innerHTML = `<span class="breadcrumb-trail"><a href="#" onclick="navigate('${parent.page}'); return false;">${parent.label}</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${title}</span></span>`;
  } else {
    bc.textContent = title;
  }

  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  const content = document.getElementById('content');
  content.innerHTML = renderPage(pageId, params);

  lucide.createIcons();
  initPageCharts(pageId);

  content.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close notification dropdown if open
  const notif = document.getElementById('notif-dropdown');
  if (notif && !notif.classList.contains('hidden')) notif.classList.add('hidden');
}

function renderPage(pageId, params) {
  const pages = {
    'dashboard-admin':       pageDashboardAdmin,
    'submissoes':            pageSubmissoesMensais,
    'usuarios':              pageUsuarios,
    'auditoria':             pageAuditoria,
    'configuracoes':         pageConfiguracoes,
    'permissoes':            pagePermissoes,
    'dashboard-gestor':      pageDashboardGestor,
    'projetos':              pageProjetos,
    'detalhe-projeto':       () => pageDetalheProjeto(params.id),
    'confirmacao-lancamento': pageConfirmacaoLancamento,
    'relatorios':            pageRelatorios,
    'horas-todos':           pageHorasTodos,
    'alocacao':              pageAlocacao,
    'dashboard-colaborador': pageDashboardColaborador,
    'lancar-horas':          pageLancarHoras,
    'historico':             pageHistorico,
    'perfil':                pagePerfil,
  };

  const fn = pages[pageId];
  return fn ? fn() : `<div class="page-header"><h1 class="page-title">Página não encontrada</h1></div>`;
}

function switchProfile(profile) {
  state.profile = profile;

    document.querySelectorAll('.profile-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.profile === profile));

    buildSidebar(profile);

    const user = DEMO_USERS[profile];
  document.getElementById('topbar-avatar').textContent = user.initials;
  document.getElementById('topbar-name').textContent   = user.name;
  document.getElementById('sidebar-avatar').textContent   = user.initials;
  document.getElementById('sidebar-username').textContent = user.name;
  document.getElementById('sidebar-userrole').textContent = { admin: 'Administrador', gestor: 'Gestor', colaborador: 'Colaborador' }[profile];

    ['topbar-avatar', 'sidebar-avatar'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('av-admin', 'av-gestor', 'av-colaborador');
    el.classList.add('av-' + profile);
  });

  navigate(DEFAULT_PAGE[profile]);
}

function buildSidebar(profile) {
  const nav = document.getElementById('sidebar-nav');
  const items = SIDEBAR_MENUS[profile] || [];

  nav.innerHTML = items.map(item => `
    <button class="sidebar-item" data-page="${item.id}" onclick="navigate('${item.id}')" title="${item.label}">
      <i data-lucide="${item.icon}"></i>
      <span class="sidebar-item-label">${item.label}</span>
    </button>
  `).join('');

  lucide.createIcons();
}

function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Autenticando...';
  lucide.createIcons();

  setTimeout(() => {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    buildSidebar('admin');
    navigate('dashboard-admin');
    showToast('Bem-vindo, Manuel!', 'Login realizado com sucesso via Keycloak SSO.', 'success');
  }, 900);
}

function handleLogout() {
  if (!confirm('Deseja sair do sistema?')) return;
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  destroyAllCharts();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.querySelector('.main-wrapper').classList.toggle('expanded');
}

/* Dark mode toggle */
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    lucide.createIcons();
  }
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

/* Notifications toggle */
function toggleNotifications() {
  const dd = document.getElementById('notif-dropdown');
  if (!dd) return;
  dd.classList.toggle('hidden');
  if (!dd.classList.contains('hidden')) {
    lucide.createIcons();
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function _close(e) {
        if (!e.target.closest('.notif-wrapper')) {
          dd.classList.add('hidden');
          document.removeEventListener('click', _close);
        }
      });
    }, 10);
  }
}

function showToast(title, msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle', info: 'info' };
  const id = 'toast-' + Date.now();

  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : ''}`;
  el.id = id;
  el.innerHTML = `
    <i data-lucide="${icons[type] || 'info'}"></i>
    <div class="toast-msg">
      <div class="toast-title">${title}</div>
      <div>${msg}</div>
    </div>
    <button class="btn-icon btn-sm" onclick="document.getElementById('${id}').remove()">
      <i data-lucide="x"></i>
    </button>
  `;

  container.appendChild(el);
  lucide.createIcons();
  setTimeout(() => el.remove(), 4500);
}

function openModal(html) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal';
  overlay.innerHTML = html;
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
  lucide.createIcons();
}

function closeModal() {
  const m = document.getElementById('active-modal');
  if (m) m.remove();
}

function pageSubmissoesMensais() {
    const now = new Date();
  const mesAtualValue = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mesAtualLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const usuarios = DB.users.filter(u => u.status === 'ativo' && u.role !== 'admin');

    function calcStatus(userId) {
    const entries = DB.timeEntries.filter(e => {
      if (e.userId !== userId) return false;
            const parts = e.date.split('/');
      if (parts.length < 3) return false;
      const entryMonth = parseInt(parts[1], 10);
      const entryYear  = parseInt(parts[2], 10);
      return entryMonth === (now.getMonth()+1) && entryYear === now.getFullYear();
    });
    const totalHoras = entries.reduce((s, e) => s + e.hours, 0);
    const projetos = [...new Set(entries.map(e => {
      const p = DB.projects.find(x => x.id === e.projectId);
      return p ? p.name : '—';
    }))];
    return { submeteu: entries.length > 0, totalHoras, projetos, qtdLancamentos: entries.length };
  }

  const dados = usuarios.map(u => ({ user: u, ...calcStatus(u.id) }));
  const submeteram = dados.filter(d => d.submeteu).length;
  const pendentes  = dados.filter(d => !d.submeteu).length;
  const totalHoras = dados.reduce((s, d) => s + d.totalHoras, 0);

    function exportCSV() {
    const linhas = [
      ['Nome', 'Perfil', 'Status', 'Total Horas', 'Projetos', 'Lançamentos'],
      ...dados.map(d => [
        d.user.name,
        d.user.role,
        d.submeteu ? 'Submeteu' : 'Pendente',
        d.totalHoras,
        d.projetos.join(' | '),
        d.qtdLancamentos,
      ])
    ];
    const csv = linhas.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `submissoes_${mesAtualValue}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exportado!', `submissoes_${mesAtualValue}.csv baixado.`, 'success');
  }
    window._exportSubmissoes = exportCSV;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Submissões Mensais</h1>
        <p class="page-subtitle">Controle de quem submeteu as horas de <strong>${mesAtualLabel}</strong></p>
      </div>
      <div class="page-actions">
        <div class="filter-bar" style="margin:0;">
          <label>Mês:</label>
          <input type="month" class="form-input" value="${mesAtualValue}" style="max-width:180px;"
            onchange="showToast('Demo', 'Filtro por mês está disponível na versão real.', 'info')">
        </div>
        <button class="btn btn-accent" onclick="window._exportSubmissoes()">
          <i data-lucide="download"></i> Exportar CSV
        </button>
      </div>
    </div>

    ${pendentes > 0 ? `
    <div class="alert alert-warning" style="margin-bottom:var(--space-xl);">
      <i data-lucide="alert-triangle"></i>
      <div><strong>${pendentes} colaborador${pendentes > 1 ? 'es ainda não submeteram' : ' ainda não submeteu'} as horas</strong> de ${mesAtualLabel}.
        ${dados.filter(d => !d.submeteu).map(d => `<span class="badge badge-warning" style="margin-left:4px;">${d.user.name.split(' ')[0]}</span>`).join('')}
      </div>
    </div>` : `
    <div class="alert alert-info" style="margin-bottom:var(--space-xl);">
      <i data-lucide="check-circle-2"></i>
      <strong>Todos os colaboradores submeteram as horas</strong> de ${mesAtualLabel}. 🎉
    </div>`}

    <div class="kpi-grid" style="margin-bottom:var(--space-xl);">
      <div class="kpi-card">
        <div class="kpi-icon"><i data-lucide="users"></i></div>
        <div class="kpi-label">Total de Membros</div>
        <div class="kpi-value">${usuarios.length}</div>
        <div class="kpi-delta">Gestores + Colaboradores</div>
      </div>
      <div class="kpi-card accent">
        <div class="kpi-icon"><i data-lucide="check-circle-2"></i></div>
        <div class="kpi-label">Submeteram</div>
        <div class="kpi-value">${submeteram}</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> ${Math.round(submeteram/usuarios.length*100)}% da equipe</div>
      </div>
      <div class="kpi-card ${pendentes > 0 ? 'warning' : 'accent'}">
        <div class="kpi-icon"><i data-lucide="${pendentes > 0 ? 'clock' : 'check'}"></i></div>
        <div class="kpi-label">Pendentes</div>
        <div class="kpi-value">${pendentes}</div>
        <div class="kpi-delta ${pendentes > 0 ? '' : 'up'}">${pendentes > 0 ? 'Aguardando submissão' : 'Todos em dia'}</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-icon"><i data-lucide="clock"></i></div>
        <div class="kpi-label">Total Horas no Mês</div>
        <div class="kpi-value">${totalHoras}h</div>
        <div class="kpi-delta">${(totalHoras/usuarios.length).toFixed(1)}h média por pessoa</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Status por Colaborador — ${mesAtualLabel}</span>
        <span class="badge badge-primary">${dados.length} membros</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Perfil</th>
              <th>Status</th>
              <th style="text-align:right;">Total Horas</th>
              <th>Projetos com Lançamento</th>
              <th style="text-align:center;">Registros</th>
              <th style="text-align:center;">Evidências</th>
            </tr>
          </thead>
          <tbody>
            ${dados.map(d => {
              const qtdEv = Object.keys(DB.evidencias).filter(k => k.startsWith(d.user.id + '_')).length;
              return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <div class="avatar avatar-sm ${getAvatarClass(d.user.role)}">${d.user.initials}</div>
                    <div>
                      <div style="font-weight:600;">${d.user.name}</div>
                      <div class="text-muted text-xs">${d.user.email}</div>
                    </div>
                  </div>
                </td>
                <td>${roleBadge(d.user.role)}</td>
                <td>
                  ${d.submeteu
                    ? '<span class="badge badge-accent"><i data-lucide="check" style="width:11px;height:11px;"></i> Submeteu</span>'
                    : '<span class="badge badge-warning"><i data-lucide="clock" style="width:11px;height:11px;"></i> Pendente</span>'}
                </td>
                <td style="text-align:right;font-weight:700;font-size:var(--text-md);">
                  ${d.submeteu ? `${d.totalHoras}h` : '<span class="text-muted">—</span>'}
                </td>
                <td>
                  ${d.projetos.length
                    ? d.projetos.map(p => `<span class="badge badge-gray" style="margin-right:4px;">${p}</span>`).join('')
                    : '<span class="text-muted text-xs">Nenhum lançamento</span>'}
                </td>
                <td style="text-align:center;">
                  <span class="badge ${d.qtdLancamentos > 0 ? 'badge-primary' : 'badge-gray'}">${d.qtdLancamentos}</span>
                </td>
                <td style="text-align:center;">
                  ${qtdEv > 0
                    ? `<button class="btn btn-ghost btn-sm" onclick="modalVerEvidencias(${d.user.id})">
                        <i data-lucide="paperclip"></i> Ver (${qtdEv})
                       </button>`
                    : '<span class="text-muted text-xs">—</span>'}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background:var(--primary-light);">
              <td colspan="3" style="font-weight:700;padding:10px 16px;">Total</td>
              <td style="text-align:right;font-weight:700;font-size:var(--text-md);padding:10px 16px;">${totalHoras}h</td>
              <td colspan="3" style="padding:10px 16px;font-size:var(--text-sm);color:var(--text-muted);">${submeteram} de ${usuarios.length} membros submeteram</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  `;
}

function pageDashboardAdmin() {
  const totalUsers    = DB.users.length;
  const ativos        = DB.users.filter(u => u.status === 'ativo').length;
  const totalProjetos = DB.projects.length;
  const lancamentos   = DB.timeEntries.length;

    const now = new Date();
  const membrosAtivos = DB.users.filter(u => u.status === 'ativo' && u.role !== 'admin');
  const submeteramIds = new Set(
    DB.timeEntries
      .filter(e => {
        const parts = e.date.split('/');
        return parts.length === 3 &&
          parseInt(parts[1], 10) === (now.getMonth()+1) &&
          parseInt(parts[2], 10) === now.getFullYear();
      })
      .map(e => e.userId)
  );
  const pendentesSubmissao = membrosAtivos.filter(u => !submeteramIds.has(u.id)).length;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Visão geral do sistema — ${new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
      </div>
    </div>

    <div class="alert alert-warning">
      <i data-lucide="alert-triangle"></i>
      <div><strong>1 usuário inativo</strong> no sistema — Juliana Santos. <a href="#" onclick="navigate('usuarios'); return false;">Ver usuários →</a></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon"><i data-lucide="users"></i></div>
        <div class="kpi-label">Total de Usuários</div>
        <div class="kpi-value">${totalUsers}</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> +1 este mês</div>
      </div>
      <div class="kpi-card accent">
        <div class="kpi-icon"><i data-lucide="user-check"></i></div>
        <div class="kpi-label">Usuários Ativos</div>
        <div class="kpi-value">${ativos}</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> ${Math.round(ativos/totalUsers*100)}% do total</div>
      </div>
      <div class="kpi-card warning">
        <div class="kpi-icon"><i data-lucide="folder"></i></div>
        <div class="kpi-label">Projetos Cadastrados</div>
        <div class="kpi-value">${totalProjetos}</div>
        <div class="kpi-delta"><i data-lucide="minus"></i> ${DB.projects.filter(p=>p.status==='ativo').length} ativos</div>
      </div>
      <div class="kpi-card ${pendentesSubmissao > 0 ? 'danger' : 'purple'}" style="cursor:pointer;" onclick="navigate('submissoes')">
        <div class="kpi-icon"><i data-lucide="calendar-check"></i></div>
        <div class="kpi-label">Submissões Pendentes</div>
        <div class="kpi-value">${pendentesSubmissao}</div>
        <div class="kpi-delta ${pendentesSubmissao > 0 ? '' : 'up'}">
          ${pendentesSubmissao > 0
            ? `<i data-lucide="alert-triangle"></i> de ${membrosAtivos.length} membros`
            : `<i data-lucide="check"></i> Todos em dia`}
          <span style="font-size:10px;margin-left:4px;opacity:.7;">ver detalhes →</span>
        </div>
      </div>
    </div>

    <div class="grid-7-5">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Submissões Mensais — Lançamentos</span>
          <span class="badge badge-primary">Últimos 7 meses</span>
        </div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-admin-activity"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Últimas Ações</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('auditoria')">Ver tudo</button>
        </div>
        <div class="card-body" style="padding: 0 var(--space-lg);">
          <div class="recent-list">
            ${DB.auditLogs.slice(0, 5).map(log => `
              <div class="recent-item">
                <div class="avatar avatar-sm ${getAvatarClass(DB.users.find(u=>u.name===log.user)?.role||'')}">${DB.users.find(u=>u.name===log.user)?.initials||'?'}</div>
                <div class="recent-item-info">
                  <div class="recent-item-title">${log.user}</div>
                  <div class="recent-item-sub">${log.detail}</div>
                </div>
                <span class="action-badge action-${log.action.toLowerCase()}">${log.action}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card">
        <div class="card-header"><span class="card-title">Acesso Rápido</span></div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:var(--space-sm);">
          <button class="btn btn-secondary" onclick="navigate('submissoes')"><i data-lucide="calendar-check"></i> Submissões Mensais</button>
          <button class="btn btn-secondary" onclick="navigate('usuarios')"><i data-lucide="users"></i> Gerenciar Usuários</button>
          <button class="btn btn-secondary" onclick="navigate('auditoria')"><i data-lucide="shield-check"></i> Logs de Auditoria</button>
          <button class="btn btn-secondary" onclick="navigate('configuracoes')"><i data-lucide="settings"></i> Configurações</button>
          <button class="btn btn-secondary" onclick="navigate('permissoes')"><i data-lucide="key"></i> Perfis & Permissões</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Status do Sistema</span></div>
        <div class="card-body">
          ${[
            ['API Backend (NestJS)', 'accent', 'Online'],
            ['Banco PostgreSQL',     'accent', 'Online'],
            ['Keycloak SSO',         'accent', 'Online'],
            ['Serviço de Backup',    'accent', 'Ativo'],
            ['CI/CD Pipeline',       'accent', 'Verde'],
          ].map(([name, cls, val]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
              <span class="text-sm">${name}</span>
              <span class="badge badge-${cls}">● ${val}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Informações do Sistema</span></div>
        <div class="card-body">
          ${[
            ['Versão', 'v1.1.0'],
            ['Ambiente', 'Produção'],
            ['Último backup', 'Hoje 03:00'],
            ['Uptime', '99.8%'],
            ['Usuários simultâneos', '3'],
          ].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:var(--text-sm);">
              <span class="text-muted">${k}</span><strong>${v}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function pageUsuarios() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Gerenciamento de Usuários</h1>
        <p class="page-subtitle">${DB.users.length} usuários cadastrados · ${DB.users.filter(u=>u.status==='ativo').length} ativos</p>
      </div>
      <div class="page-actions">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Buscar usuário..." oninput="filterUsers(this.value)">
        </div>
        <select class="form-select" style="width:auto;" onchange="filterByRole(this.value)">
          <option value="">Todos os perfis</option>
          <option value="admin">Admin</option>
          <option value="gestor">Gestor</option>
          <option value="colaborador">Colaborador</option>
        </select>
        <button class="btn btn-primary" onclick="modalNovoUsuario()">
          <i data-lucide="user-plus"></i> Novo Usuário
        </button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper" id="users-table-wrap">
        ${usersTable(DB.users)}
      </div>
    </div>
  `;
}

function usersTable(users) {
  return `
    <table id="users-table">
      <thead>
        <tr>
          <th>Usuário</th>
          <th>E-mail</th>
          <th>Perfil</th>
          <th>Status</th>
          <th>Último Login</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:var(--space-sm);">
                <div class="avatar avatar-sm ${getAvatarClass(u.role)}">${u.initials}</div>
                <strong>${u.name}</strong>
              </div>
            </td>
            <td class="text-muted">${u.email}</td>
            <td>${roleBadge(u.role)}</td>
            <td>${statusBadge(u.status)}</td>
            <td class="text-muted text-sm">${u.lastLogin}</td>
            <td>
              <div class="table-actions">
                <button class="btn-icon" title="Editar" onclick="modalEditarUsuario(${u.id})"><i data-lucide="pencil"></i></button>
                <button class="btn-icon" title="${u.status==='ativo'?'Desativar':'Ativar'}" onclick="toggleUserStatus(${u.id})">
                  <i data-lucide="${u.status==='ativo'?'user-x':'user-check'}"></i>
                </button>
                <button class="btn-icon" title="Resetar senha" onclick="showToast('Senha redefinida','E-mail enviado para '+${JSON.stringify(u.email)})">
                  <i data-lucide="key"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function filterUsers(q) {
  const filtered = DB.users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('users-table-wrap').innerHTML = usersTable(filtered);
  lucide.createIcons();
}

function filterByRole(role) {
  const filtered = role ? DB.users.filter(u => u.role === role) : DB.users;
  document.getElementById('users-table-wrap').innerHTML = usersTable(filtered);
  lucide.createIcons();
}

function toggleUserStatus(id) {
  const u = DB.users.find(x => x.id === id);
  if (!u) return;
  u.status = u.status === 'ativo' ? 'inativo' : 'ativo';
  document.getElementById('users-table-wrap').innerHTML = usersTable(DB.users);
  lucide.createIcons();
  showToast('Status atualizado', `${u.name} agora está ${u.status}.`, u.status === 'ativo' ? 'success' : 'warning');
}

function modalNovoUsuario() {
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 class="modal-title">Novo Usuário</h2>
        <button class="btn-icon" onclick="closeModal()"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">Nome completo</label>
            <input class="form-input" placeholder="Ex: João da Silva" type="text">
          </div>
          <div class="form-group">
            <label class="form-label required">E-mail corporativo</label>
            <input class="form-input" placeholder="joao@envision.com" type="email">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">Perfil de acesso</label>
            <select class="form-select">
              <option value="">Selecione...</option>
              <option value="admin">Admin</option>
              <option value="gestor">Gestor</option>
              <option value="colaborador">Colaborador</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Departamento</label>
            <input class="form-input" value="P&D" type="text">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Projetos iniciais (opcional)</label>
          <div class="checkbox-list" id="proj-checkboxes">
            ${DB.projects.filter(p=>p.status==='ativo').map(p => `
              <label class="checkbox-item" onclick="this.classList.toggle('selected')">
                <input type="checkbox"> ${p.name}
              </label>
            `).join('')}
          </div>
        </div>
        <div class="toggle-wrap">
          <label class="toggle">
            <input type="checkbox" checked>
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
          <span class="text-sm">Usuário ativo imediatamente</span>
        </div>
        <div class="alert alert-info" style="margin-top:var(--space-md);">
          <i data-lucide="info"></i>
          <span>O usuário receberá um e-mail com instruções de acesso via Keycloak SSO.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="closeModal(); showToast('Usuário criado', 'Convite enviado por e-mail.', 'success')">
          <i data-lucide="user-plus"></i> Criar Usuário
        </button>
      </div>
    </div>
  `);
}

function modalEditarUsuario(id) {
  const u = DB.users.find(x => x.id === id);
  if (!u) return;
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 class="modal-title">Editar Usuário — ${u.name}</h2>
        <button class="btn-icon" onclick="closeModal()"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">Nome completo</label>
            <input class="form-input" value="${u.name}" type="text">
          </div>
          <div class="form-group">
            <label class="form-label required">E-mail</label>
            <input class="form-input" value="${u.email}" type="email">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Perfil</label>
            <select class="form-select">
              <option ${u.role==='admin'?'selected':''}>admin</option>
              <option ${u.role==='gestor'?'selected':''}>gestor</option>
              <option ${u.role==='colaborador'?'selected':''}>colaborador</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <div class="toggle-wrap" style="margin-top:8px;">
              <label class="toggle">
                <input type="checkbox" ${u.status==='ativo'?'checked':''}>
                <div class="toggle-track"></div>
                <div class="toggle-thumb"></div>
              </label>
              <span class="text-sm">${u.status==='ativo'?'Ativo':'Inativo'}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="closeModal(); showToast('Usuário salvo', '${u.name} atualizado com sucesso.')">
          <i data-lucide="save"></i> Salvar
        </button>
      </div>
    </div>
  `);
}

function pageAuditoria() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Logs de Auditoria</h1>
        <p class="page-subtitle">Histórico imutável de todas as operações — somente leitura</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="showToast('Exportado','CSV gerado com sucesso.','success')">
          <i data-lucide="download"></i> Exportar CSV
        </button>
      </div>
    </div>

    <div class="filter-bar">
      <label for="audit-action">Ação:</label>
      <select id="audit-action" onchange="filterAuditLogs()"><option value="">Todas</option><option value="LOGIN">LOGIN</option><option value="CREATE">CREATE</option><option value="UPDATE">UPDATE</option><option value="DELETE">DELETE</option></select>
      <label for="audit-user">Usuário:</label>
      <select id="audit-user" onchange="filterAuditLogs()">
        <option value="">Todos</option>
        ${DB.users.map(u=>`<option value="${u.name}">${u.name}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" onclick="filterAuditLogs()"><i data-lucide="filter"></i> Filtrar</button>
    </div>

    <div class="card">
      <div class="table-wrapper" id="audit-table-wrap">
        ${auditTable(DB.auditLogs)}
      </div>
      <div class="card-footer">
        <span class="text-sm text-muted" id="audit-count">${DB.auditLogs.length} registros encontrados</span>
      </div>
    </div>
  `;
}

function auditTable(logs) {
  if (!logs.length) return '<div class="empty-state" style="padding:32px;"><div class="empty-state-title">Nenhum registro</div><p class="text-muted text-sm">Nenhum log encontrado com os filtros selecionados.</p></div>';
  return `<table><thead><tr><th>#</th><th>Data / Hora</th><th>Usuário</th><th>Ação</th><th>Entidade</th><th>Detalhes</th></tr></thead><tbody>${logs.map(log => {
    const u = DB.users.find(u => u.name === log.user) || {};
    return `<tr><td class="text-muted text-sm">${log.id}</td><td class="text-sm" style="font-family:monospace;">${log.ts}</td><td><div style="display:flex;align-items:center;gap:8px;"><div class="avatar avatar-xs ${getAvatarClass(u.role)}">${u.initials||'?'}</div><span class="text-sm">${log.user}</span></div></td><td><span class="action-badge action-${log.action.toLowerCase()}">${log.action}</span></td><td><span class="badge badge-gray">${log.entity}</span></td><td class="text-sm text-muted">${log.detail}</td></tr>`;
  }).join('')}</tbody></table>`;
}

function filterAuditLogs() {
  const action = document.getElementById('audit-action')?.value || '';
  const user = document.getElementById('audit-user')?.value || '';
  let filtered = DB.auditLogs;
  if (action) filtered = filtered.filter(l => l.action === action);
  if (user) filtered = filtered.filter(l => l.user === user);
  document.getElementById('audit-table-wrap').innerHTML = auditTable(filtered);
  document.getElementById('audit-count').textContent = filtered.length + ' registros encontrados';
  lucide.createIcons();
}

function pageConfiguracoes() {
  return `
    <div class="page-header">
      <h1 class="page-title">Configurações do Sistema</h1>
    </div>
    <div class="settings-layout">
      <div class="settings-sidebar">
        ${[
          ['geral',    'sliders',    'Geral'],
          ['keycloak', 'shield',     'Keycloak'],
          ['backup',   'hard-drive', 'Backup'],
          ['lgpd',     'file-text',  'LGPD'],
        ].map(([id, icon, label], i) => `
          <button class="settings-tab ${i===0?'active':''}" onclick="showSettingsTab('${id}', this)">
            <i data-lucide="${icon}"></i> ${label}
          </button>
        `).join('')}
      </div>
      <div id="settings-content">
        ${settingsTabGeral()}
      </div>
    </div>
  `;
}

function showSettingsTab(tab, btn) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const tabs = { geral: settingsTabGeral, keycloak: settingsTabKeycloak, backup: settingsTabBackup, lgpd: settingsTabLgpd };
  document.getElementById('settings-content').innerHTML = (tabs[tab] || settingsTabGeral)();
  lucide.createIcons();
}

function settingsTabGeral() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Configurações Gerais</span></div>
      <div class="card-body">
        ${[
          ['Nome do Departamento', 'P&D — Pesquisa & Desenvolvimento', 'text'],
          ['Fuso Horário',         'America/Sao_Paulo (UTC-3)',          'text'],
          ['Limite de Horas/Dia',  '12',                                  'number'],
          ['Horas Mensais Padrão', '160',                                  'number'],
        ].map(([label, val, type]) => `
          <div class="form-group">
            <label class="form-label">${label}</label>
            <input class="form-input" type="${type}" value="${val}">
          </div>
        `).join('')}
        <button class="btn btn-primary" onclick="showToast('Configurações salvas','Alterações aplicadas com sucesso.')">
          <i data-lucide="save"></i> Salvar Alterações
        </button>
      </div>
    </div>
  `;
}

function settingsTabKeycloak() {
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Keycloak SSO</span>
        <span class="badge badge-accent">● Conectado</span>
      </div>
      <div class="card-body">
        <div class="alert alert-info"><i data-lucide="info"></i> Campos somente leitura — editar via painel Keycloak.</div>
        ${[
          ['Realm URL',  'https://auth.envision.com.br/realms/envision'],
          ['Client ID',  'sistema-horas-prod'],
          ['Algoritmo',  'RS256'],
          ['Status',     'Conectado — Token expira em 3h 24min'],
        ].map(([k,v]) => `
          <div class="config-field">
            <div><div class="config-field-label">${k}</div></div>
            <span class="config-field-value">${v}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function settingsTabBackup() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Backup & Recuperação</span></div>
      <div class="card-body">
        ${[
          ['RPO (Recovery Point Objective)', '24 horas (máximo de perda de dados)'],
          ['RTO (Recovery Time Objective)',  '4 horas (tempo máximo para restauração)'],
          ['Frequência de Backup',           'Diária — 03:00 BRT'],
          ['Retenção',                       '30 dias'],
          ['Último Backup',                  'Hoje 03:00 — ✅ Sucesso (2.4 GB)'],
          ['Próximo Backup',                 'Amanhã 03:00'],
        ].map(([k,v]) => `
          <div class="config-field">
            <div><div class="config-field-label">${k}</div></div>
            <span class="config-field-value" style="max-width:280px;text-align:right;">${v}</span>
          </div>
        `).join('')}
        <div style="margin-top:var(--space-md);display:flex;gap:var(--space-sm);">
          <button class="btn btn-secondary" onclick="showToast('Backup iniciado','Backup manual em andamento...','info')"><i data-lucide="hard-drive"></i> Backup Agora</button>
          <button class="btn btn-secondary" onclick="showToast('Teste iniciado','Simulação de restauração iniciada...','warning')"><i data-lucide="refresh-cw"></i> Testar Restauração</button>
        </div>
      </div>
    </div>
  `;
}

function settingsTabLgpd() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Conformidade LGPD</span></div>
      <div class="card-body">
        <div class="alert alert-info"><i data-lucide="shield"></i> Dados de colaboradores são dados pessoais — Lei n.º 13.709/2018.</div>
        ${[
          ['Controlador dos Dados',       'Envision P&D — CNPJ 00.000.000/0001-00'],
          ['Operador dos Dados',          'TI / Desenvolvimento — Manuel Moraes'],
          ['Período de Retenção',         '5 anos após desligamento'],
          ['Política de Anonimização',    '90 dias após solicitação formal'],
          ['Consentimento de Uso',        'Exibido no 1º acesso — aceito em 100% dos usuários'],
        ].map(([k,v]) => `
          <div class="config-field">
            <div><div class="config-field-label">${k}</div></div>
            <span class="config-field-value" style="max-width:280px;text-align:right;">${v}</span>
          </div>
        `).join('')}
        <div style="margin-top:var(--space-md);">
          <button class="btn btn-danger" onclick="showToast('Solicitação registrada','Processo de anonimização criado.','warning')">
            <i data-lucide="trash-2"></i> Solicitar Anonimização
          </button>
        </div>
      </div>
    </div>
  `;
}

function pagePermissoes() {
  const perms = [
    { feature: 'Dashboard pessoal',             admin: 1, gestor: 1, colaborador: 1 },
    { feature: 'Lançar horas',                  admin: 0, gestor: 1, colaborador: 1 },
    { feature: 'Ver próprio histórico',         admin: 0, gestor: 1, colaborador: 1 },
    { feature: 'Dashboard gerencial (KPIs)',    admin: 1, gestor: 1, colaborador: 0 },
    { feature: 'Cadastrar projetos',            admin: 1, gestor: 1, colaborador: 0 },
    { feature: 'Alocar colaboradores',          admin: 1, gestor: 1, colaborador: 0 },
    { feature: 'Ver horas de todos',            admin: 1, gestor: 1, colaborador: 0 },
    { feature: 'Exportar relatórios (.xlsx)',   admin: 1, gestor: 1, colaborador: 0 },
    { feature: 'Gerenciar usuários',            admin: 1, gestor: 0, colaborador: 0 },
    { feature: 'Logs de auditoria',             admin: 1, gestor: 0, colaborador: 0 },
    { feature: 'Configurações do sistema',      admin: 1, gestor: 0, colaborador: 0 },
    { feature: 'Gerenciar perfis e permissões', admin: 1, gestor: 0, colaborador: 0 },
  ];

  const chk = (v) => v
    ? `<span class="check-yes"><i data-lucide="check-circle-2"></i></span>`
    : `<span class="check-no"><i data-lucide="minus"></i></span>`;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Perfis & Permissões</h1>
        <p class="page-subtitle">Matriz de funcionalidades por perfil de acesso</p>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper perm-matrix">
        <table>
          <thead>
            <tr>
              <th>Funcionalidade</th>
              <th class="perm-check">Admin</th>
              <th class="perm-check">Gestor</th>
              <th class="perm-check">Colaborador</th>
            </tr>
          </thead>
          <tbody>
            ${perms.map(p => `
              <tr>
                <td class="text-sm">${p.feature}</td>
                <td class="perm-check">${chk(p.admin)}</td>
                <td class="perm-check">${chk(p.gestor)}</td>
                <td class="perm-check">${chk(p.colaborador)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageDashboardGestor() {
  const totalHoras   = DB.timeEntries.reduce((s, e) => s + e.hours, 0);
  const projAtivos   = DB.projects.filter(p => p.status === 'ativo').length;
  const membros      = new Set(DB.projects.flatMap(p => p.members)).size;
  const mediaHorasMembro = membros > 0 ? (totalHoras / membros).toFixed(1) : 0;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard Gerencial</h1>
        <p class="page-subtitle">Visão consolidada — Abril 2026</p>
      </div>
      <div class="page-actions">
        <select class="form-select" style="width:auto;">
          <option>Abril 2026</option>
          <option>Março 2026</option>
          <option>Fevereiro 2026</option>
        </select>
        <button class="btn btn-accent" onclick="showToast('Exportando...','Planilha Excel gerada com sucesso.','success')">
          <i data-lucide="download"></i> Exportar Excel
        </button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon"><i data-lucide="clock"></i></div>
        <div class="kpi-label">Total de Horas (mês)</div>
        <div class="kpi-value">${totalHoras}</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> +14% vs. março</div>
      </div>
      <div class="kpi-card accent">
        <div class="kpi-icon"><i data-lucide="folder-open"></i></div>
        <div class="kpi-label">Projetos Ativos</div>
        <div class="kpi-value">${projAtivos}</div>
        <div class="kpi-delta"><i data-lucide="minus"></i> 1 inativo</div>
      </div>
      <div class="kpi-card warning">
        <div class="kpi-icon"><i data-lucide="users"></i></div>
        <div class="kpi-label">Colaboradores Alocados</div>
        <div class="kpi-value">${membros}</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> Todos ativos</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-icon"><i data-lucide="activity"></i></div>
        <div class="kpi-label">Média Horas/Membro (mês)</div>
        <div class="kpi-value">${mediaHorasMembro}h</div>
        <div class="kpi-delta up"><i data-lucide="trending-up"></i> Acima da meta</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Horas por Projeto</span>
          <span class="badge badge-primary">Abril 2026</span>
        </div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-horas-projeto"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Distribuição por Colaborador</span>
          <span class="badge badge-primary">Abril 2026</span>
        </div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-dist-colab"></canvas></div>
        </div>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header">
        <span class="card-title">Realizado vs. Previsto por Projeto</span>
        <button class="btn btn-ghost btn-sm" onclick="navigate('relatorios')">Ver relatórios completos →</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Projeto</th><th>Responsável</th><th>Realizado</th><th>Previsto</th><th>Progresso</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${DB.projects.map(p => {
              const pct = Math.min(Math.round(p.total / p.estimated * 100), 100);
              const color = progressColor(p.total, p.estimated);
              const resp = DB.users.find(u => u.id === p.responsible);
              return `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td class="text-sm">${resp?.name || '-'}</td>
                  <td><strong>${p.total}h</strong></td>
                  <td class="text-muted">${p.estimated}h</td>
                  <td style="min-width:160px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div class="progress" style="flex:1;">
                        <div class="progress-bar ${color}" style="width:${pct}%"></div>
                      </div>
                      <span class="text-xs text-muted">${pct}%</span>
                    </div>
                  </td>
                  <td>${statusBadge(p.status)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageProjetos() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Gestão de Projetos</h1>
        <p class="page-subtitle">${DB.projects.length} projetos · ${DB.projects.filter(p=>p.status==='ativo').length} ativos</p>
      </div>
      <div class="page-actions">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Buscar projeto...">
        </div>
        <button class="btn btn-primary" onclick="modalNovoProjeto()">
          <i data-lucide="plus"></i> Novo Projeto
        </button>
      </div>
    </div>

    <div class="project-grid">
      ${DB.projects.map(p => {
        const pct = Math.min(Math.round(p.total / p.estimated * 100), 100);
        const color = progressColor(p.total, p.estimated);
        const resp = DB.users.find(u => u.id === p.responsible);
        return `
          <div class="project-card" onclick="navigate('detalhe-projeto', {id: ${p.id}})"
               title="Inspirado por: ${p.specialist?.name}">
            <div class="project-card-header">
              <span class="project-name">${p.name}</span>
              ${statusBadge(p.status)}
            </div>
            <p class="project-desc">${p.desc}</p>
            ${p.specialist ? `
            <div class="specialist-badge">
              <i data-lucide="user-check"></i>
              <span>${p.specialist.name}</span>
              <span class="specialist-area">${p.specialist.area}</span>
            </div>` : ''}
            <div class="project-stats">
              <span><strong>${p.total}h</strong> lançadas</span>
              <span><strong>${p.estimated}h</strong> previstas</span>
              <span><strong>${p.members.length}</strong> membros</span>
            </div>
            <div class="progress" style="margin-bottom:var(--space-md);">
              <div class="progress-bar ${color}" style="width:${pct}%"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div class="project-members">
                ${p.members.slice(0,4).map(uid => {
                  const u = DB.users.find(x=>x.id===uid);
                  return `<div class="avatar ${getAvatarClass(u?.role)}" title="${u?.name}">${u?.initials||'?'}</div>`;
                }).join('')}
                ${p.members.length > 4 ? `<div class="avatar av-admin">+${p.members.length-4}</div>` : ''}
              </div>
              <div style="display:flex;gap:4px;">
                <button class="btn-icon" title="Editar" onclick="event.stopPropagation(); modalEditarProjeto(${p.id})"><i data-lucide="pencil"></i></button>
                <button class="btn-icon" title="Alocação" onclick="event.stopPropagation(); navigate('alocacao')"><i data-lucide="users"></i></button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function modalNovoProjeto() {
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 class="modal-title">Novo Projeto</h2>
        <button class="btn-icon" onclick="closeModal()"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label required">Nome do Projeto</label>
          <input class="form-input" placeholder="Ex: Projeto Zeta" type="text">
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea class="form-textarea" placeholder="Descreva o objetivo do projeto..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status inicial</label>
            <select class="form-select">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Horas previstas</label>
            <input class="form-input" type="number" placeholder="160" min="1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Alocar colaboradores</label>
          <div class="checkbox-list">
            ${DB.users.filter(u => u.role === 'colaborador').map(u => `
              <label class="checkbox-item" onclick="this.classList.toggle('selected')">
                <input type="checkbox">
                <div class="avatar avatar-sm ${getAvatarClass(u.role)}">${u.initials}</div>
                <div>
                  <div class="text-sm font-semibold">${u.name}</div>
                  <div class="text-xs text-muted">${u.email}</div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="closeModal(); showToast('Projeto criado','Projeto criado e equipe notificada.','success')">
          <i data-lucide="folder-plus"></i> Criar Projeto
        </button>
      </div>
    </div>
  `);
}

function modalEditarProjeto(id) {
  const p = DB.projects.find(x => x.id === id);
  if (!p) return;
  openModal(`
    <div class="modal modal-lg">
      <div class="modal-header">
        <h2 class="modal-title">Editar — ${p.name}</h2>
        <button class="btn-icon" onclick="closeModal()"><i data-lucide="x"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label required">Nome</label>
          <input class="form-input" value="${p.name}" type="text">
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea class="form-textarea">${p.desc}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select">
              <option ${p.status==='ativo'?'selected':''} value="ativo">Ativo</option>
              <option ${p.status==='inativo'?'selected':''} value="inativo">Inativo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Horas previstas</label>
            <input class="form-input" type="number" value="${p.estimated}">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="closeModal(); showToast('Projeto salvo','${p.name} atualizado com sucesso.')">
          <i data-lucide="save"></i> Salvar
        </button>
      </div>
    </div>
  `);
}

function pageDetalheProjeto(id) {
  const p = DB.projects.find(x => x.id === id);
  if (!p) return '<p>Projeto não encontrado.</p>';

  const resp = DB.users.find(u => u.id === p.responsible);
  const entries = DB.timeEntries.filter(e => e.projectId === id);
  const pct = Math.min(Math.round(p.total / p.estimated * 100), 100);
  const color = progressColor(p.total, p.estimated);

  return `
    <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-lg);">
      <button class="btn btn-ghost btn-sm" onclick="navigate('projetos')">
        <i data-lucide="arrow-left"></i> Projetos
      </button>
      <span class="text-muted">/</span>
      <span class="text-sm font-semibold">${p.name}</span>
    </div>

    <div class="detail-header">
      <div>
        <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-sm);">
          <h1 class="detail-title">${p.name}</h1>
          ${statusBadge(p.status)}
        </div>
        <p class="detail-desc">${p.desc}</p>
        <div class="detail-meta">
          <span class="detail-meta-item">Responsável: <strong>${resp?.name}</strong></span>
          <span class="detail-meta-item">Início: <strong>${p.start}</strong></span>
          <span class="detail-meta-item">Membros: <strong>${p.members.length}</strong></span>
        </div>
        ${p.specialist ? `
        <div class="specialist-card">
          <div class="specialist-card-icon"><i data-lucide="award"></i></div>
          <div>
            <div class="specialist-card-name">Inspirado em <strong>${p.specialist.name}</strong> · <span>${p.specialist.area}</span></div>
            <div class="specialist-card-bio">${p.specialist.bio}</div>
          </div>
        </div>` : ''}
      </div>
      <div style="display:flex;gap:var(--space-sm);">
        <button class="btn btn-secondary" onclick="modalEditarProjeto(${p.id})"><i data-lucide="pencil"></i> Editar</button>
        <button class="btn btn-secondary" onclick="navigate('alocacao')"><i data-lucide="users"></i> Alocação</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:var(--space-xl);">
      <div class="kpi-card">
        <div class="kpi-icon"><i data-lucide="clock"></i></div>
        <div class="kpi-label">Horas Lançadas (total)</div>
        <div class="kpi-value">${p.total}h</div>
      </div>
      <div class="kpi-card ${color === 'over' ? 'danger' : color === 'near' ? 'warning' : 'accent'}">
        <div class="kpi-icon"><i data-lucide="target"></i></div>
        <div class="kpi-label">Horas Previstas</div>
        <div class="kpi-value">${p.estimated}h</div>
        <div class="kpi-delta ${pct>=100?'down':'up'}"><i data-lucide="${pct>=100?'trending-up':'trending-up'}"></i> ${pct}% concluído</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon"><i data-lucide="users"></i></div>
        <div class="kpi-label">Membros</div>
        <div class="kpi-value">${p.members.length}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Membros da Equipe</span></div>
        <div class="card-body" style="padding:0 var(--space-lg);">
          ${p.members.map(uid => {
            const u = DB.users.find(x=>x.id===uid);
            const hrs = DB.timeEntries.filter(e=>e.userId===uid&&e.projectId===id).reduce((s,e)=>s+e.hours,0);
            return `
              <div class="recent-item">
                <div class="avatar ${getAvatarClass(u?.role)}">${u?.initials}</div>
                <div class="recent-item-info">
                  <div class="recent-item-title">${u?.name}</div>
                  <div class="recent-item-sub">${roleBadge(u?.role)}</div>
                </div>
                <span class="recent-item-value">${hrs}h</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Lançamentos Recentes</span></div>
        <div class="card-body">
          <div class="timeline">
            ${entries.slice(0,5).map(e => {
              const u = DB.users.find(x=>x.id===e.userId);
              return `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-date">${e.date} — ${u?.name}</div>
                  <div class="timeline-content"><strong>${e.hours}h</strong> — ${e.justification}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function pageRelatorios() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Relatórios</h1>
        <p class="page-subtitle">Geração automática de planilhas de custos e relatórios analíticos</p>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header"><span class="card-title">Filtros do Relatório</span></div>
      <div class="card-body">
        <div class="filter-bar" style="margin:0;">
          <label>Tipo:</label>
          <select id="relatorio-tipo">
            <option>Por Projeto</option>
            <option>Por Colaborador</option>
            <option>Consolidado</option>
          </select>
          <label>Período:</label>
          <input type="date" value="2026-04-01">
          <span>até</span>
          <input type="date" value="2026-04-27">
          <label>Projeto:</label>
          <select>
            <option>Todos</option>
            ${DB.projects.map(p=>`<option>${p.name}</option>`).join('')}
          </select>
          <label>Colaborador:</label>
          <select>
            <option>Todos</option>
            ${DB.users.filter(u=>u.role==='colaborador').map(u=>`<option>${u.name}</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm"><i data-lucide="bar-chart-2"></i> Gerar</button>
        </div>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header">
        <span class="card-title">Realizado vs. Previsto — Todos os Projetos</span>
      </div>
      <div class="card-body">
        <div class="chart-container" style="height:300px;"><canvas id="chart-relatorio"></canvas></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Tabela de Custos — Abril 2026</span>
        <div style="display:flex;gap:var(--space-sm);">
          <button class="btn btn-accent btn-sm" onclick="showToast('Excel exportado','Planilha .xlsx gerada e pronta para download.','success')">
            <i data-lucide="file-spreadsheet"></i> Exportar Excel
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('PDF exportado','Relatório PDF gerado.','success')">
            <i data-lucide="file-text"></i> Exportar PDF
          </button>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Horas Previstas</th>
              <th>Horas Realizadas</th>
              <th>Diferença</th>
              <th>% Conclusão</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${DB.projects.map(p => {
              const diff = p.total - p.estimated;
              const pct = Math.round(p.total / p.estimated * 100);
              return `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td>${p.estimated}h</td>
                  <td><strong>${p.total}h</strong></td>
                  <td class="${diff>0?'text-danger':diff<0?'text-accent':''}">
                    ${diff>=0?'+':''}${diff}h
                  </td>
                  <td>${pct}%</td>
                  <td>${statusBadge(p.status)}</td>
                </tr>
              `;
            }).join('')}
            <tr style="background:var(--bg);font-weight:700;">
              <td>TOTAL</td>
              <td>${DB.projects.reduce((s,p)=>s+p.estimated,0)}h</td>
              <td>${DB.projects.reduce((s,p)=>s+p.total,0)}h</td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageHorasTodos() {
  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Visualização de Horas</h1>
        <p class="page-subtitle">Todos os lançamentos — ${DB.timeEntries.length} registros</p>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header"><span class="card-title">Horas por Colaborador — Abril 2026</span></div>
      <div class="card-body">
        <div class="chart-container"><canvas id="chart-horas-todos"></canvas></div>
      </div>
    </div>

    <div class="filter-bar">
      <label>Colaborador:</label>
      <select>
        <option>Todos</option>
        ${DB.users.filter(u=>u.role==='colaborador').map(u=>`<option>${u.name}</option>`).join('')}
      </select>
      <label>Projeto:</label>
      <select>
        <option>Todos</option>
        ${DB.projects.map(p=>`<option>${p.name}</option>`).join('')}
      </select>
      <label>De:</label>
      <input type="date" value="2026-04-01">
      <label>Até:</label>
      <input type="date" value="2026-04-27">
      <button class="btn btn-primary btn-sm"><i data-lucide="filter"></i> Filtrar</button>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Colaborador</th>
              <th>Projeto</th>
              <th>Horas</th>
              <th>Justificativa</th>
              <th>Status</th>
              <th style="text-align:center;">Evidência</th>
            </tr>
          </thead>
          <tbody>
            ${DB.timeEntries.map(e => {
              const u = DB.users.find(x=>x.id===e.userId);
              const p = DB.projects.find(x=>x.id===e.projectId);
              const evKey = `${e.userId}_${e.projectId}`;
              const temEv = !!DB.evidencias[evKey];
              return `
                <tr>
                  <td class="text-sm" style="font-family:monospace;">${e.date}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div class="avatar avatar-sm ${getAvatarClass(u?.role)}">${u?.initials}</div>
                      <span class="text-sm">${u?.name}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-primary">${p?.name}</span></td>
                  <td><strong>${e.hours}h</strong></td>
                  <td class="text-sm text-muted" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.justification}</td>
                  <td><span class="badge badge-accent">✓ ${e.status}</span></td>
                  <td style="text-align:center;">
                    ${temEv
                      ? `<button class="btn btn-ghost btn-sm" onclick="modalVerEvidencias(${e.userId})">
                           <i data-lucide="paperclip"></i>
                         </button>`
                      : '<span class="text-muted text-xs">—</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <span class="text-sm text-muted">
          Total: <strong>${DB.timeEntries.reduce((s,e)=>s+e.hours,0)}h</strong> lançadas no período
        </span>
      </div>
    </div>
  `;
}

function pageAlocacao() {
  const collabs = DB.users.filter(u => u.role === 'colaborador' && u.status === 'ativo');

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Alocação de Equipe</h1>
        <p class="page-subtitle">Gerencie quais colaboradores estão alocados em cada projeto</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Salvo','Alocações atualizadas com sucesso.')">
          <i data-lucide="save"></i> Salvar Alterações
        </button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="aloc-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              ${DB.projects.filter(p=>p.status==='ativo').map(p =>
                `<th class="center" style="min-width:120px;">${p.name.replace('Projeto ','')}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody>
            ${collabs.map(u => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="avatar avatar-sm av-colaborador">${u.initials}</div>
                    <span>${u.name}</span>
                  </div>
                </td>
                ${DB.projects.filter(p=>p.status==='ativo').map(p => `
                  <td class="center">
                    <input type="checkbox" class="aloc-cell"
                      ${p.members.includes(u.id)?'checked':''}
                      onchange="toggleAlloc(${u.id},${p.id},this.checked)">
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <span class="text-sm text-muted">
          Marque/desmarque para alocar ou remover colaboradores dos projetos.
          Alterações só são salvas ao clicar em "Salvar".
        </span>
      </div>
    </div>
  `;
}

function toggleAlloc(userId, projectId, checked) {
  const p = DB.projects.find(x => x.id === projectId);
  if (!p) return;
  if (checked && !p.members.includes(userId)) p.members.push(userId);
  if (!checked) p.members = p.members.filter(id => id !== userId);
}

function pageDashboardColaborador() {
  const user  = DEMO_USERS.colaborador;
  const now   = new Date();
  const meusMes = DB.timeEntries.filter(e => {
    if (e.userId !== user.id) return false;
    const p = e.date.split('/');
    return p.length === 3 && parseInt(p[1],10) === (now.getMonth()+1) && parseInt(p[2],10) === now.getFullYear();
  });
  const meus  = DB.timeEntries.filter(e => e.userId === user.id);
  const total = meusMes.reduce((s, e) => s + e.hours, 0);
  const projs = getProjectsForUser(user.id);
  const mesLabel = now.toLocaleDateString('pt-BR', { month: 'long' });

  return `
    <div class="welcome-card">
      <div style="display:flex;align-items:center;gap:var(--space-lg);">
        <div class="avatar av-colaborador">${user.initials}</div>
        <div>
          <div class="welcome-title">Olá, ${user.name.split(' ')[0]}! 👋</div>
          <div class="welcome-sub">Bem-vindo ao Sistema de Controle de Horas — P&D</div>
        </div>
      </div>
      <div class="welcome-stats">
        <div class="welcome-stat">
          <div class="welcome-stat-value">${total}h</div>
          <div class="welcome-stat-label">Horas em ${mesLabel}</div>
        </div>
        <div class="welcome-stat">
          <div class="welcome-stat-value">${projs.length}</div>
          <div class="welcome-stat-label">Projetos ativos</div>
        </div>
        <div class="welcome-stat">
          <div class="welcome-stat-value">${meus.length}</div>
          <div class="welcome-stat-label">Lançamentos totais</div>
        </div>
      </div>
    </div>

    <div class="lancar-cta" onclick="navigate('lancar-horas')">
      <div class="lancar-cta-icon"><i data-lucide="folder-open"></i></div>
      <div class="lancar-cta-text">
        <div class="lancar-cta-title">Lançar Horas do Mês</div>
        <div class="lancar-cta-sub">Registre suas horas de ${mesLabel.charAt(0).toUpperCase()+mesLabel.slice(1)} · Submissão mensal</div>
      </div>
      <button class="lancar-cta-btn" onclick="event.stopPropagation();navigate('lancar-horas')">
        <i data-lucide="plus-circle"></i> Lançar Horas
      </button>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Horas por Mês</span>
          <span class="badge badge-primary">Últimos 7 meses</span>
        </div>
        <div class="card-body">
          <div class="chart-container-sm"><canvas id="chart-colab-weekly"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Meus Projetos</span>
        </div>
        <div class="card-body" style="padding:0 var(--space-lg);">
          ${projs.map(p => {
            const hMes = DB.timeEntries.filter(e => {
              if (e.userId !== user.id || e.projectId !== p.id) return false;
              const d = e.date.split('/');
              return d.length === 3 && parseInt(d[1],10) === (now.getMonth()+1) && parseInt(d[2],10) === now.getFullYear();
            }).reduce((s,e)=>s+e.hours,0);
            return `
            <div class="recent-item" style="cursor:pointer;" onclick="navigate('lancar-horas')">
              <div class="kpi-icon" style="width:36px;height:36px;border-radius:var(--radius);"><i data-lucide="folder"></i></div>
              <div class="recent-item-info">
                <div class="recent-item-title">${p.name}</div>
                <div class="recent-item-sub">${hMes}h lançadas em ${mesLabel}</div>
              </div>
              ${statusBadge(p.status)}
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Últimos Lançamentos</span>
        <button class="btn btn-ghost btn-sm" onclick="navigate('historico')">Ver todos →</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Data</th><th>Projeto</th><th>Horas</th><th>Justificativa</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${meus.slice(0,5).map(e => {
              const p = DB.projects.find(x=>x.id===e.projectId);
              return `
                <tr>
                  <td class="text-sm" style="font-family:monospace;">${e.date}</td>
                  <td><span class="badge badge-primary">${p?.name}</span></td>
                  <td><strong>${e.hours}h</strong></td>
                  <td class="text-sm text-muted" style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.justification}</td>
                  <td><span class="badge badge-accent">✓ Confirmado</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function pageLancarHoras() {
  const user = DEMO_USERS[state.profile] || DEMO_USERS.colaborador;
  const projs = getProjectsForUser(user.id);

  const now = new Date();
  const mesAtualValue = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mesAtualLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const horasLancadas = {};
  DB.timeEntries.filter(e => e.userId === user.id).forEach(e => {
    horasLancadas[e.projectId] = (horasLancadas[e.projectId] || 0) + e.hours;
  });

  if (!projs.length) {
    return `
      <div class="page-header"><h1 class="page-title">Lançar Horas</h1></div>
      <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="folder-x"></i></div>
        <div class="empty-state-title">Nenhum projeto alocado</div>
        <p class="text-muted text-sm">Você não está alocado em nenhum projeto ativo. Contate o gestor.</p>
      </div>
    `;
  }

  // Calculate initial total
  const initialTotal = projs.reduce((s, p) => s + (horasLancadas[p.id] || 0), 0);
  const maxHoras = 220;

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Lançar Horas</h1>
        <p class="page-subtitle">Submissão mensal de horas — ${mesAtualLabel}</p>
      </div>
    </div>

    <div class="alert alert-info">
      <i data-lucide="calendar"></i>
      <span>Registre o total de horas trabalhadas em cada projeto durante o mês. A submissão mensal deve ser feita até o último dia útil do mês.</span>
    </div>

    <!-- Dynamic Hours Summary Bar -->
    <div class="hours-summary" id="hours-summary">
      <div>
        <div class="hours-summary-value ${initialTotal > maxHoras ? 'over' : ''}" id="hours-total">${initialTotal}h</div>
        <div class="hours-summary-label">Total lançado</div>
      </div>
      <div class="hours-summary-progress">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span class="text-xs text-muted">${projs.length} projeto${projs.length>1?'s':''}</span>
          <span class="text-xs font-semibold" id="hours-pct">${Math.round(initialTotal/maxHoras*100)}%</span>
        </div>
        <div class="progress" style="height:10px;">
          <div class="progress-bar ${initialTotal > maxHoras ? 'over' : initialTotal > maxHoras*0.85 ? 'near' : 'ok'}" id="hours-bar" style="width:${Math.min(initialTotal/maxHoras*100,100)}%"></div>
        </div>
        <div class="text-xs text-muted" style="margin-top:4px;">Máximo recomendado: ${maxHoras}h/mês</div>
      </div>
    </div>

    <form onsubmit="submitLancamento(event)">
      <div class="form-group">
        <label class="form-label required" for="mes-ref">Mês de referência</label>
        <input class="form-input" type="month" id="mes-ref" value="${mesAtualValue}" style="max-width:220px;">
        <span class="form-hint">Selecione o mês para o qual está lançando as horas</span>
      </div>

      ${projs.map((p, i) => {
        const jaPossuiHoras = (horasLancadas[p.id] || 0);
        return `
        <div class="lancamento-card">
          <div class="lancamento-card-header">
            <i data-lucide="folder"></i>
            <span class="lancamento-projeto-tag">${p.name}</span>
            <span class="text-muted text-xs">${p.desc.slice(0,60)}...</span>
            ${jaPossuiHoras > 0 ? `<span class="badge badge-accent" style="margin-left:auto">${jaPossuiHoras}h já registradas</span>` : ''}
          </div>
          <div class="form-row">
            <div class="form-group" style="margin:0;">
              <label class="form-label required" for="hours-${i}">Total de horas no mês</label>
              <input class="form-input hours-input" type="number" min="0" max="220" step="0.5"
                placeholder="Ex: 80" id="hours-${i}" value="${jaPossuiHoras || ''}"
                oninput="updateHoursSummary(${projs.length})">
              <span class="form-hint">Horas totais dedicadas a este projeto no mês · Máx. 220h/mês</span>
            </div>
            <div></div>
          </div>
          <div class="form-group" style="margin-top:var(--space-md);margin-bottom:0;">
            <label class="form-label required" for="just-${i}">Resumo das atividades realizadas no mês</label>
            <textarea class="form-textarea" rows="3" placeholder="Descreva as principais atividades realizadas neste projeto durante o mês..." id="just-${i}"></textarea>
          </div>
          <div class="form-group" style="margin-top:var(--space-md);margin-bottom:0;">
            <label class="form-label" for="evidencia-${i}">
              Evidência &nbsp;<span class="badge badge-gray" style="font-weight:400;font-size:11px;">opcional</span>
            </label>
            <div class="evidencia-upload" id="evidencia-drop-${i}"
              onclick="document.getElementById('evidencia-file-${i}').click()"
              ondragover="event.preventDefault();this.style.borderColor='var(--primary)'"
              ondragleave="this.style.borderColor=''"
              ondrop="event.preventDefault();this.style.borderColor='';handleEvidencia(${i},${p.id},{files:event.dataTransfer.files})">
              <i data-lucide="paperclip"></i>
              <span>Clique ou arraste um arquivo</span>
              <span class="text-xs" style="color:var(--text-muted);">Imagem, PDF, Word ou vídeo &nbsp;·&nbsp; Máx. 10 MB</span>
              <input type="file" id="evidencia-file-${i}"
                accept="image/*,.pdf,.doc,.docx,video/mp4,video/webm"
                style="display:none;" onchange="handleEvidencia(${i},${p.id},this)">
            </div>
            <div id="evidencia-preview-${i}" class="evidencia-preview" style="display:none;"></div>
          </div>
        </div>
      `}).join('')}

      <div class="alert alert-warning" style="margin-top:var(--space-lg);">
        <i data-lucide="alert-triangle"></i>
        <span><strong>Atenção:</strong> Após confirmar, o lançamento será registrado e notificado ao gestor. Alterações posteriores precisam de aprovação.</span>
      </div>

      <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-md);">
        <button type="submit" class="btn btn-primary btn-lg">
          <i data-lucide="check-circle"></i> Submeter Horas do Mês
        </button>
        <button type="button" class="btn btn-ghost btn-lg" onclick="navigate('dashboard-colaborador')">
          Cancelar
        </button>
      </div>
    </form>
  `;
}

/* Dynamic hours summary updater */
function updateHoursSummary(count) {
  let total = 0;
  for (let i = 0; i < count; i++) {
    const el = document.getElementById('hours-' + i);
    if (el) total += parseFloat(el.value) || 0;
  }
  const max = 220;
  const pct = Math.round(total / max * 100);
  const color = total > max ? 'over' : total > max * 0.85 ? 'near' : 'ok';

  const totalEl = document.getElementById('hours-total');
  const pctEl = document.getElementById('hours-pct');
  const barEl = document.getElementById('hours-bar');
  if (totalEl) {
    totalEl.textContent = total + 'h';
    totalEl.className = 'hours-summary-value' + (total > max ? ' over' : '');
  }
  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) {
    barEl.style.width = Math.min(pct, 100) + '%';
    barEl.className = 'progress-bar ' + color;
  }
}

window._pendingEvidencias = {};

function _evidenciaIcon(type) {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type === 'application/pdf') return 'file-text';
  return 'file';
}

function handleEvidencia(idx, projectId, input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showToast('Arquivo muito grande', 'O arquivo não pode exceder 10 MB.', 'error');
    if (input.value !== undefined) input.value = '';
    return;
  }
  const allowed = ['image/', 'video/mp4', 'video/webm', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ok = allowed.some(t => file.type.startsWith(t) || file.type === t);
  if (!ok) {
    showToast('Formato não suportado', 'Use imagem, PDF, Word ou vídeo MP4/WebM.', 'error');
    if (input.value !== undefined) input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    const key = `${DEMO_USERS.colaborador.id}_${projectId}`;
    window._pendingEvidencias[key] = { name: file.name, type: file.type, size: file.size, dataURL: ev.target.result };
    const iconName = _evidenciaIcon(file.type);
    const preview = document.getElementById('evidencia-preview-' + idx);
    const drop    = document.getElementById('evidencia-drop-' + idx);
    if (preview) {
      preview.style.display = 'flex';
      preview.innerHTML = `
        <div class="evidencia-file-icon"><i data-lucide="${iconName}"></i></div>
        <div class="evidencia-file-info">
          <span class="evidencia-file-name">${file.name}</span>
          <span class="evidencia-file-size">${(file.size/1024).toFixed(0)} KB · ${file.type.split('/')[1].toUpperCase()}</span>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="removeEvidencia(${idx},${projectId})">
          <i data-lucide="x"></i>
        </button>`;
      lucide.createIcons();
    }
    if (drop) drop.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function removeEvidencia(idx, projectId) {
  const key = `${DEMO_USERS.colaborador.id}_${projectId}`;
  delete window._pendingEvidencias[key];
  const preview = document.getElementById('evidencia-preview-' + idx);
  const drop    = document.getElementById('evidencia-drop-' + idx);
  const inp     = document.getElementById('evidencia-file-' + idx);
  if (preview) preview.style.display = 'none';
  if (drop)    drop.style.display = 'flex';
  if (inp)     inp.value = '';
}

function modalVerEvidencias(userId) {
  const user = DB.users.find(u => u.id === userId);
  const prefix = userId + '_';
  const evs = Object.entries(DB.evidencias)
    .filter(([k]) => k.startsWith(prefix))
    .map(([k, v]) => ({ projectId: parseInt(k.split('_')[1]), ...v }));
  if (!evs.length) {
    showToast('Sem evidências', 'Este colaborador não anexou evidências nesta sessão.', 'info');
    return;
  }
  const rows = evs.map(ev => {
    const proj = DB.projects.find(p => p.id === ev.projectId);
    let mediaHtml = '';
    if (ev.type.startsWith('image/')) {
      mediaHtml = `<img src="${ev.dataURL}" alt="${ev.name}" style="max-width:100%;border-radius:var(--radius);margin-top:8px;">`;
    } else if (ev.type.startsWith('video/')) {
      mediaHtml = `<video src="${ev.dataURL}" controls style="max-width:100%;border-radius:var(--radius);margin-top:8px;"></video>`;
    } else if (ev.type === 'application/pdf') {
      mediaHtml = `<iframe src="${ev.dataURL}" style="width:100%;height:320px;border-radius:var(--radius);border:1px solid var(--border);margin-top:8px;"></iframe>`;
    } else {
      mediaHtml = `<div class="alert alert-info" style="margin-top:8px;"><i data-lucide="file"></i><span>Pré-visualização não disponível para este formato.</span></div>`;
    }
    return `
      <div style="margin-bottom:var(--space-lg);padding-bottom:var(--space-lg);border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:var(--space-sm);flex-wrap:wrap;">
          <span class="badge badge-primary">${proj?.name || '—'}</span>
          <span class="text-sm" style="font-weight:600;">${ev.name}</span>
          <span class="text-xs text-muted">${(ev.size/1024).toFixed(0)} KB</span>
          <a href="${ev.dataURL}" download="${ev.name}" class="btn btn-ghost btn-sm" style="margin-left:auto;">
            <i data-lucide="download"></i> Baixar
          </a>
        </div>
        ${mediaHtml}
      </div>`;
  }).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-evidencias" onclick="if(event.target===this)closeModalEvidencias()">
      <div class="modal" style="max-width:660px;width:92%;max-height:85vh;display:flex;flex-direction:column;">
        <div class="modal-header">
          <span class="modal-title"><i data-lucide="paperclip" style="width:16px;height:16px;margin-right:6px;vertical-align:middle;"></i>Evidências — ${user?.name}</span>
          <button class="btn btn-ghost btn-sm" onclick="closeModalEvidencias()"><i data-lucide="x"></i></button>
        </div>
        <div class="modal-body" style="overflow-y:auto;">${rows}</div>
      </div>
    </div>`);
  lucide.createIcons();
}

function closeModalEvidencias() {
  const m = document.getElementById('modal-evidencias');
  if (m) m.remove();
}

function submitLancamento(e) {
  e.preventDefault();
  if (window._pendingEvidencias && Object.keys(window._pendingEvidencias).length) {
    Object.assign(DB.evidencias, window._pendingEvidencias);
    window._pendingEvidencias = {};
  }
  navigate('confirmacao-lancamento');
}

function pageConfirmacaoLancamento() {
  const now = new Date();
  const mesLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return `
    <div class="success-page">
      <div class="success-icon"><i data-lucide="check-circle-2"></i></div>
      <h1 class="success-title">Horas do mês submetidas!</h1>
      <p class="success-sub">Sua submissão de horas de <strong>${mesLabel}</strong> foi registrada com sucesso. O gestor foi notificado e pode visualizar no dashboard gerencial.</p>
      <div style="display:flex;gap:var(--space-md);">
        <button class="btn btn-primary btn-lg" onclick="navigate('lancar-horas')">
          <i data-lucide="edit-3"></i> Editar Lançamento
        </button>
        <button class="btn btn-secondary btn-lg" onclick="navigate('historico')">
          <i data-lucide="list"></i> Ver Histórico
        </button>
      </div>
    </div>
  `;
}

function pageHistorico() {
  const user    = DEMO_USERS[state.profile] || DEMO_USERS.colaborador;
  const entries = getEntriesForUser(user.id);
  const total   = entries.reduce((s,e)=>s+e.hours,0);

  return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Meu Histórico</h1>
        <p class="page-subtitle">${entries.length} lançamentos · ${total}h no total</p>
      </div>
    </div>

    <div class="filter-bar">
      <label>Projeto:</label>
      <select>
        <option>Todos</option>
        ${DB.projects.map(p=>`<option>${p.name}</option>`).join('')}
      </select>
      <label>De:</label>
      <input type="date" value="2026-04-01">
      <label>Até:</label>
      <input type="date" value="2026-04-27">
      <button class="btn btn-primary btn-sm"><i data-lucide="search"></i> Buscar</button>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Data</th><th>Projeto</th><th>Horas</th><th>Justificativa</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${entries.map(e => {
              const p = DB.projects.find(x=>x.id===e.projectId);
              return `
                <tr>
                  <td class="text-sm" style="font-family:monospace;">${e.date}</td>
                  <td><span class="badge badge-primary">${p?.name}</span></td>
                  <td><strong>${e.hours}h</strong></td>
                  <td class="text-sm text-muted">${e.justification}</td>
                  <td><span class="badge badge-accent">✓ Confirmado</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <span class="text-sm text-muted">Total no período: <strong>${total}h</strong></span>
      </div>
    </div>
  `;
}

function pagePerfil() {
  const user  = DEMO_USERS[state.profile] || DEMO_USERS.colaborador;
  const projs = getProjectsForUser(user.id);
  const total = getTotalHoursThisMonth(user.id);

  return `
    <div class="profile-hero">
      <div class="avatar avatar-lg ${getAvatarClass(user.role)}">${user.initials}</div>
      <div>
        <div class="profile-name">${user.name}</div>
        <div class="profile-role">${{admin:'Administrador',gestor:'Gestor',colaborador:'Colaborador'}[user.role]}</div>
        <div class="profile-dept">${user.dept} — Envision</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Dados Pessoais</span></div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Nome completo</label>
            <input class="form-input" value="${user.name}" type="text">
          </div>
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input class="form-input" value="${user.email}" type="email">
          </div>
          <div class="form-group">
            <label class="form-label">Departamento</label>
            <input class="form-input" value="${user.dept}" disabled>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Perfil salvo','Dados atualizados com sucesso.')">
            <i data-lucide="save"></i> Salvar
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Resumo de Atividade</span></div>
        <div class="card-body">
          <div class="stat-row" style="margin-bottom:var(--space-lg);">
            <div class="stat-row-item">
              <div class="stat-row-value">${total}</div>
              <div class="stat-row-label">Horas no mês</div>
            </div>
            <div class="stat-row-item">
              <div class="stat-row-value">${projs.length}</div>
              <div class="stat-row-label">Projetos ativos</div>
            </div>
            <div class="stat-row-item">
              <div class="stat-row-value">${getEntriesForUser(user.id).length}</div>
              <div class="stat-row-label">Lançamentos</div>
            </div>
          </div>
          <div class="card-title text-sm font-semibold mb-md" style="margin-bottom:var(--space-sm);">Projetos alocados</div>
          ${projs.map(p => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">
              <span class="text-sm">${p.name}</span>
              ${statusBadge(p.status)}
            </div>
          `).join('')}
          ${!projs.length ? '<p class="text-muted text-sm">Nenhum projeto ativo.</p>' : ''}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Histórico de Acesso Recente</span></div>
      <div class="card-body">
        ${[
          ['27/04/2026 09:15', 'Chrome 124', 'São Paulo, BR', 'Sucesso'],
          ['26/04/2026 08:30', 'Chrome 124', 'São Paulo, BR', 'Sucesso'],
          ['25/04/2026 09:00', 'Firefox 125','São Paulo, BR', 'Sucesso'],
        ].map(([dt, browser, loc, status]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:var(--text-sm);">
            <span style="font-family:monospace;color:var(--text-muted);">${dt}</span>
            <span>${browser}</span>
            <span class="text-muted">${loc}</span>
            <span class="badge badge-accent">✓ ${status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

const _originalRenderPage = renderPage;

document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
  }

  lucide.createIcons();

  window.submitLancamento = function(e) {
    e.preventDefault();
    navigate('confirmacao-lancamento');
  };
});
