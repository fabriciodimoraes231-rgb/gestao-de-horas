# Checklist de Revisao da Proposta

## Escopo e regras de negocio

- Apenas gestor cadastra e edita projetos.
- Campos de lancamento: projeto, horas, justificativa.
- Sem aprovacao de horas; validacao e automatica.
- Multi-projeto significa lancamentos separados por projeto.

## Secoes que nao podem ficar fracas

- Objetivo de negocio e problema atual.
- Fluxo principal sem aprovacao implicita.
- KPIs do dashboard.
- Modelo de dados com `User`, `Project`, `ProjectMember`, `TimeEntry`, `AuditLog`.
- RNF com performance, capacidade, navegadores, disponibilidade.
- Conformidade, LGPD, backup, RPO, RTO e niveis de acesso.
- Cronograma com entregas, dependencias e Definition of Done.

## Inconsistencias para procurar

- `7 semanas` versus `10 semanas`.
- Secoes que dizem que todos os pontos em aberto foram respondidos quando o prompt ainda aponta pendencias.
- Qualquer mencao a aprovacao manual de horas.
- Planilha de custos tratada como resolvida sem template definido.
- Arquitetura multi-tenant ou single-tenant assumida sem confirmacao.

## Fechamento minimo da revisao

- O que foi corrigido.
- O que continua em aberto.
- O impacto de cada ponto aberto no cronograma ou na arquitetura.
