---
name: rnf-seguranca-lgpd
description: 'Especificar requisitos nao funcionais, seguranca e LGPD do Sistema de Controle de Horas. Use quando escrever RNF, SLA, desempenho, usuarios simultaneos, backup, RPO, RTO, navegadores, controle de acesso, logging, monitoramento, retencao de dados e conformidade.'
argument-hint: 'Informe a area nao funcional que quer detalhar ou revisar'
user-invocable: true
---

# RNF, Seguranca e LGPD

## Quando usar

- Escrever ou revisar seções de RNF e compliance.
- Definir limites operacionais, acesso, backup e observabilidade.
- Converter exigencias difusas em criterios verificaveis.

## Guardrails do projeto

- Dados de colaboradores devem ser tratados como dados pessoais.
- RPO, RTO, politica de backup e auditoria devem aparecer de forma objetiva.
- Requisitos nao funcionais precisam ser mensuraveis, nao genericos.
- Controle de acesso deve respeitar ao menos os perfis `admin`, `gestor` e `colaborador`.

## Procedimento

1. Identificar qual area nao funcional esta faltando ou esta fraca.
2. Preencher a [matriz de RNF](./assets/matriz-rnf.md) com valores mensuraveis.
3. Separar requisitos de desempenho, seguranca, privacidade, disponibilidade e operacao.
4. Validar se existe impacto no wireframe, na arquitetura ou no cronograma.
5. Fechar com criterios de aceite ou perguntas objetivas para o stakeholder responder.

## Saida esperada

- Tabela ou secao de RNF pronta para documento.
- Lacunas de compliance explicitadas.
- Lista curta de validacoes que a equipe precisa comprovar.

## Recurso

- [Matriz de RNF](./assets/matriz-rnf.md)