---
name: "Modelar Dados e API"
description: "Modele entidades, relacoes, validacoes e endpoints do Sistema de Controle de Horas com foco em autorizacao, auditoria e contratos claros."
argument-hint: "Descreva a entidade, fluxo ou endpoint que quer modelar"
agent: "arquiteto-horas"
---

Modele dados e API para o fluxo solicitado considerando:

- stack oficial do projeto
- papeis `admin`, `gestor` e `colaborador`
- entidades principais `User`, `Project`, `ProjectMember`, `TimeEntry` e `AuditLog`
- regra de lancamento sem aprovacao manual

Entregue:

- entidades e relacionamentos
- constraints e validacoes
- endpoints ou contratos de payload
- pontos abertos que impactam arquitetura