---
name: modelagem-dados-api
description: 'Modelar dados e API do Sistema de Controle de Horas. Use quando precisar definir entidades, relacoes, constraints, migrations, DTOs, endpoints, autorizacao por perfil, validacao de TimeEntry, auditoria, relatorios e contratos entre frontend e backend.'
argument-hint: 'Descreva a entidade, fluxo, endpoint ou regra que quer modelar'
user-invocable: true
---

# Modelagem de Dados e API

## Quando usar

- Desenhar schema PostgreSQL, migrations ou contratos de API.
- Refinar entidades como `User`, `Project`, `ProjectMember`, `TimeEntry` e `AuditLog`.
- Definir validacoes e autorizacao por papel.

## Guardrails do projeto

- `TimeEntry` nao deve nascer com maquina de estados de aprovacao.
- Campos do lancamento sao fixos e nao devem ser flexibilizados sem decisao de escopo.
- Escrita em `Project` deve ser restrita ao gestor.
- Auditoria e rastreabilidade sao parte do desenho, nao um extra opcional.
- Se a decisao single-tenant versus multi-tenant nao estiver confirmada, explicite a suposicao usada.

## Procedimento

1. Confirmar o fluxo funcional que a modelagem precisa suportar.
2. Preencher o [template de entidades e endpoints](./assets/template-entidades-endpoints.md).
3. Definir relacoes, constraints, indices e regras de autorizacao.
4. Derivar endpoints, payloads, validacoes e efeitos de auditoria.
5. Marcar claramente o que e decisao fechada e o que ainda depende de stakeholder.

## Saida esperada

- Modelo de dados ou contrato de API objetivo.
- Lista de constraints e validacoes obrigatorias.
- Pendencias arquiteturais que afetam a implementacao.

## Recurso

- [Template de entidades e endpoints](./assets/template-entidades-endpoints.md)