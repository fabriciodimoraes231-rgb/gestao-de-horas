# Sistema de Controle de Horas e Atividades — Envision P&D

Wireframe interativo de alta fidelidade desenvolvido para o projeto **Envision P&D**.  
Protótipo front-end completo em HTML/CSS/JS puro, sem dependências de framework.

---

## Sobre o projeto

O **Envision P&D** é um sistema interno de gestão de horas e atividades voltado a equipes de Pesquisa & Desenvolvimento. Ele permite que colaboradores registrem mensalmente as horas dedicadas a cada projeto, que gestores acompanhem a distribuição de esforço em tempo real, e que administradores tenham visibilidade completa sobre as submissões, prazos e desvios orçamentários de horas.

---

## Perfis de acesso

O wireframe simula três perfis distintos, acessíveis pela barra de alternância no topo:

- **Administrador** — Manuel Moraes: visão global, relatórios, exportação CSV e gestão de usuários.
- **Gestor** — Ana Silva: cadastro de projetos, alocação de equipe e acompanhamento por projeto.
- **Colaborador** — Carlos Pereira: lançamento mensal de horas e histórico pessoal.

---

## Funcionalidades implementadas

- **Login com SSO** — tela de entrada com opção de acesso via conta corporativa
- **Dashboard por perfil** — KPIs, gráficos mensais e resumos contextualizados para cada papel
- **Lançamento mensal de horas** — formulário por projeto com campos fixos de projeto, horas e justificativa, além de barra de progresso dinâmica
- **Gestão de projetos** — cards com progresso, membros alocados e status; página de detalhe com KPIs e histórico da equipe
- **Visualização de horas** — tabela completa com filtros por colaborador, projeto e período
- **Submissões mensais** — visão administrativa com exportação para CSV
- **Relatórios** — tabela consolidada de horas realizadas vs. previstas por projeto
- **Alocação de equipe** — painel de distribuição de colaboradores por projeto
- **Associação com pioneiras da computação** — cada projeto é associado a uma especialista histórica da TI, exibida como chip ao lado do nome em todas as telas

### Especialistas associadas aos projetos

- **Projeto Alpha** — Ada Lovelace, Programação.
- **Projeto Beta** — Grace Hopper, Compiladores & COBOL.
- **Projeto Gamma** — Barbara Liskov, Engenharia de Software.
- **Projeto Delta** — Margaret Hamilton, Engenharia de Software.
- **Projeto Epsilon** — Katherine Johnson, Computação Científica.

---

## Estrutura de arquivos

```text
wireframes/
├── index.html          # Shell da SPA — login, sidebar, topbar, roteador
├── css/
│   ├── variables.css   # Design tokens (cores, espaçamentos, tipografia)
│   ├── layout.css      # Grid, sidebar, topbar, breakpoints responsivos
│   ├── components.css  # Componentes reutilizáveis (badges, cards, modais…)
│   └── pages.css       # Estilos específicos por página
└── js/
    ├── data.js         # Banco de dados mock + funções auxiliares
    ├── charts.js       # Inicialização dos gráficos com Chart.js
    └── app.js          # Roteador SPA + funções de renderização de página
```

---

## Tecnologias utilizadas

- [Chart.js](https://www.chartjs.org/) — versão 4.4.2, usada para gráficos de barras e rosca.
- [Lucide Icons](https://lucide.dev/) — versão 0.363.0, usada para ícones SVG.
- [Inter (Google Fonts)](https://fonts.google.com/specimen/Inter) — usada como tipografia.

Sem framework JavaScript. Roteamento feito via `navigate()` e `renderPage()` com manipulação direta de `innerHTML`.

---

## Como executar

Basta abrir o arquivo `index.html` diretamente no navegador — não é necessário servidor web ou instalação de dependências.

```bash
# Exemplo no Linux
xdg-open wireframes/index.html

# Exemplo no macOS
open wireframes/index.html
```

---

## Design

- **Cor primária:** `#1A5298` (azul corporativo)
- **Acento:** `#27AE60` (verde — ações principais)
- **Fundo:** `#F5F6F8` | **Superfície:** `#FFFFFF`
- Layout responsivo com breakpoints em 1100px e 768px
