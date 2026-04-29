---
name: implementacao-stack-horas
description: 'Implementar funcionalidades do Sistema de Controle de Horas seguindo a stack do projeto. Use quando trabalhar com React, TypeScript, NestJS, PostgreSQL, Keycloak, ExcelJS, Jest, Playwright, GitHub Actions, logs estruturados, dashboards, formulario de horas, relatorios e configuracao de ambientes.'
argument-hint: 'Descreva a funcionalidade, camada ou integracao que quer implementar'
user-invocable: true
---

# Implementacao da Stack do Projeto

## Quando usar

- Implementar ou revisar funcionalidade frontend, backend, dados ou infraestrutura.
- Garantir que uma solucao tecnica siga a stack decidida na proposta.
- Orientar scaffold, testes e configuracao base do produto.

## Defaults tecnicos do projeto

- React + TypeScript no frontend.
- NestJS + Node.js no backend.
- PostgreSQL para persistencia.
- Keycloak para SSO.
- ExcelJS para exportacao.
- Jest e Playwright para testes.
- GitHub Actions para pipeline.
- Winston ou Pino para logging estruturado.

## Guardrails do projeto

- Nao criar workflow de aprovacao de horas.
- Respeitar os campos fixos de lancamento.
- Garantir autorizacao por perfil em toda escrita sensivel.
- Registrar auditoria e evitar logs com dados sigilosos.
- Separar configuracao de `dev`, `staging` e `prod`.

## Procedimento

1. Identificar a camada e o slice funcional que sera alterado.
2. Conferir a [checklist de implementacao](./assets/checklist-implementacao.md).
3. Implementar o menor fluxo util de ponta a ponta, sem extrapolar escopo.
4. Adicionar validacoes, testes e observabilidade proporcionais ao slice tocado.
5. Atualizar docs, mocks ou exemplos quando o comportamento do produto mudar.

## Saida esperada

- Plano tecnico enxuto ou implementacao pronta.
- Regras de negocio preservadas.
- Lista de testes e configuracoes impactadas.

## Recurso

- [Checklist de implementacao](./assets/checklist-implementacao.md)