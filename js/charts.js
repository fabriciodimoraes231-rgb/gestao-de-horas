const CHART_COLORS = {
  primary:     '#1A5298',
  primaryAlpha:'rgba(26,82,152,0.15)',
  accent:      '#27AE60',
  warning:     '#F39C12',
  danger:      '#C0392B',
  purple:      '#8E44AD',
  teal:        '#16A085',
  border:      '#E2E8F0',
  grid:        'rgba(0,0,0,0.05)',
};

const PALETA = [
  CHART_COLORS.primary,
  CHART_COLORS.accent,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
];

const chartInstances = {};

function destroyAllCharts() {
  Object.keys(chartInstances).forEach(k => {
    if (chartInstances[k]) {
      chartInstances[k].destroy();
      delete chartInstances[k];
    }
  });
}

function baseOptions(extras = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1D2E',
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont:  { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: CHART_COLORS.grid },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
    },
    ...extras,
  };
}

function initPageCharts(pageId) {
  destroyAllCharts();
    requestAnimationFrame(() => {
    switch (pageId) {
      case 'dashboard-admin':       _initAdminCharts();       break;
      case 'dashboard-gestor':      _initGestorCharts();      break;
      case 'dashboard-colaborador': _initColaboradorCharts(); break;
      case 'relatorios':            _initRelatorioCharts();   break;
      case 'horas-todos':           _initHorasTodosChart();   break;
    }
  });
}

function _initAdminCharts() {
  const ctx = document.getElementById('chart-admin-activity');
  if (!ctx) return;

  chartInstances['admin-activity'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DB.chartData.atividadeDiaria.labels,
      datasets: [{
        label: 'Lançamentos',
        data: DB.chartData.atividadeDiaria.values,
        backgroundColor: DB.chartData.atividadeDiaria.values.map((_, i) =>
          i === 6 ? CHART_COLORS.primary : CHART_COLORS.primaryAlpha),
        borderColor: CHART_COLORS.primary,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      ...baseOptions(),
      plugins: {
        ...baseOptions().plugins,
        legend: { display: false },
      },
    },
  });
}

function _initGestorCharts() {
    const ctxBar = document.getElementById('chart-horas-projeto');
  if (ctxBar) {
    chartInstances['horas-projeto'] = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: DB.chartData.horasPorProjeto.labels,
        datasets: [{
          label: 'Horas lançadas',
          data: DB.chartData.horasPorProjeto.values,
          backgroundColor: PALETA.map(c => c + '28'),
          borderColor: PALETA,
          borderWidth: 2,
          borderRadius: 7,
          borderSkipped: false,
        }],
      },
      options: baseOptions(),
    });
  }

    const ctxDonut = document.getElementById('chart-dist-colab');
  if (ctxDonut) {
    chartInstances['dist-colab'] = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: DB.chartData.distribuicao.labels,
        datasets: [{
          data: DB.chartData.distribuicao.values,
          backgroundColor: PALETA,
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: { font: { family: 'Inter', size: 12 }, padding: 14, usePointStyle: true },
          },
          tooltip: baseOptions().plugins.tooltip,
        },
      },
    });
  }
}

function _initColaboradorCharts() {
  const ctx = document.getElementById('chart-colab-weekly');
  if (!ctx) return;

  chartInstances['colab-weekly'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DB.chartData.minhasHoras.labels,
      datasets: [{
        label: 'Horas',
        data: DB.chartData.minhasHoras.values,
        backgroundColor: DB.chartData.minhasHoras.labels.map((_, i) =>
          i === 6 ? CHART_COLORS.primary : CHART_COLORS.primaryAlpha),
        borderColor: CHART_COLORS.primary,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      ...baseOptions(),
      scales: {
        y: { beginAtZero: true, max: 12, grid: { color: CHART_COLORS.grid }, ticks: { stepSize: 4, font: { family: 'Inter', size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
      },
    },
  });
}

function _initRelatorioCharts() {
  const ctx = document.getElementById('chart-relatorio');
  if (!ctx) return;

  chartInstances['relatorio'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DB.projects.map(p => p.name.replace('Projeto ', '')),
      datasets: [
        {
          label: 'Horas Realizadas',
          data: DB.projects.map(p => p.total),
          backgroundColor: CHART_COLORS.primary + 'CC',
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          label: 'Horas Previstas',
          data: DB.projects.map(p => p.estimated),
          backgroundColor: CHART_COLORS.warning + '55',
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      ...baseOptions(),
      plugins: {
        ...baseOptions().plugins,
        legend: { display: true, position: 'top', labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true } },
      },
    },
  });
}

function _initHorasTodosChart() {
  const ctx = document.getElementById('chart-horas-todos');
  if (!ctx) return;

  const collabs = DB.users.filter(u => u.role === 'colaborador');

  chartInstances['horas-todos'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: collabs.map(u => u.name.split(' ')[0]),
      datasets: [{
        label: 'Horas no período',
        data: collabs.map(u => u.hours),
        backgroundColor: PALETA.concat(PALETA),
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: baseOptions().plugins.tooltip,
      },
      scales: {
        x: { beginAtZero: true, grid: { color: CHART_COLORS.grid }, ticks: { font: { family: 'Inter', size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 12, weight: '600' } } },
      },
    },
  });
}
