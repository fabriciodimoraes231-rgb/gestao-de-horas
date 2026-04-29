# Plano de Revisão: Proposta Técnica — Sistema de Controle de Horas



xdg-open "/media/manuel/MeusDados/documentação/projeto XL/wireframes/index.html"

## O que está bem
- Estrutura clara e profissional
- Escopo com entradas e saídas bem definidas
- Cronograma realista (10 semanas)
- Riscos mapeados com mitigações
- Stack tecnológico coerente

---

## Lacunas identificadas

### Fase 1 — Atualizar decisões já tomadas

1. **Seção 8 — Pontos em Aberto**: os pontos 1, 3 e 4 foram respondidos — devem sair da seção de pendências e ser incorporados ao documento como decisões formais. Pontos 2 e 5 continuam em aberto.
2. **Seção 3.1 (Módulos)**: detalhar que *apenas o Gestor* cadastra projetos; que os campos são *fixos*; e que *não há fluxo de aprovação* de horas.
3. **Seção 3.2 (Fluxo Principal)**: remover qualquer sugestão de aprovação implícita — o fluxo finaliza no lançamento + validação automática.

### Fase 2 — Adicionar o que está faltando

4. **Nova Seção: Requisitos Não-Funcionais (RNF)**
   - Tempo de resposta esperado (ex: < 2s para lançamentos)
   - Uptime/SLA (ex: 99,5% em horário comercial)
   - Estimativa de usuários simultâneos
   - Volume de dados projetado (lançamentos/mês)
   - Compatibilidade de navegadores

5. **Nova Seção: Conformidade e Segurança**
   - LGPD: dados de colaboradores são dados pessoais — política de retenção, responsabilidade, anonimização/exclusão
   - Política de backup e recuperação de desastres (RPO/RTO básico)
   - Níveis de acesso detalhados por perfil (Admin, Gestor, Colaborador)

6. **Melhorar Seção 3.3 (Tecnologias)**
   - Testes: Jest (unit/integration), Playwright ou Cypress (E2E)
   - CI/CD: GitHub Actions com pipeline de lint, testes e deploy
   - Ambientes: dev local, staging (homologação), produção — com separação clara
   - Logging/Monitoramento: logging estruturado (Winston/Pino) + health checks

7. **Melhorar Seção 3.1 — Dashboard**: especificar os KPIs e visualizações:
   - Total de horas por projeto (período selecionável)
   - Horas por colaborador
   - Projetos com mais/menos horas
   - Filtros: período, projeto, colaborador

8. **Adicionar esboço do Modelo de Dados** com as entidades principais:
   - `User`, `Project`, `ProjectMember`, `TimeEntry`, `AuditLog`

9. **Melhorar Seção 5 (Cronograma)**: adicionar coluna "Definition of Done" por sprint — evita disputa sobre o que é "entregue" ao fim de cada sprint.

10. **Seção 3.3 — Hospedagem**: separar ambientes (staging vs. produção) e descrever estratégia de deploy (ex: Docker Compose em VPS como opção mínima viável, com caminho para cloud futuramente).

---

## Decisões capturadas (incorporar ao documento)

| # | Decisão |
|---|---------|
| 1 | **Apenas o Gestor** pode cadastrar projetos |
| 3 | Campos são **fixos**: projeto + horas + justificativa |
| 4 | **Sem fluxo de aprovação** — lançamento é definitivo após validação automática |

---

## Pontos ainda em aberto (manter na Seção 8)

| # | Questão | Impacto |
|---|---------|---------|
| 2 | A planilha de custos existente será o template de saída? | Impacta diretamente o Sprint 3 (ExcelJS) — o formato deve ser documentado antes do Sprint 3 começar |
| 5 | O sistema atenderá apenas este departamento ou múltiplas equipes/empresas? | Impacta a arquitetura de banco (multi-tenant vs. schema único) e pode alterar o Sprint 0 |

---

## Checklist de Revisão do Documento Final

- [ ] Seção 8 atualizada com apenas os 2 pontos ainda em aberto (2 e 5)
- [ ] Fluxo principal (Seção 3.2) sem menção de aprovação de horas
- [ ] Seção de RNF preenchida com ao menos 5 critérios
- [ ] Cada sprint com coluna de Definition of Done
- [ ] Modelo de dados com as 5 entidades principais listadas
- [ ] Seção de Conformidade e Segurança (LGPD + backup) adicionada
- [ ] Stack de testes e CI/CD incluída na Seção 3.3
