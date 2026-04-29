---
name: alinhamento-doc-wireframe
description: 'Alinhar proposta tecnica, README e wireframe do Sistema de Controle de Horas. Use quando atualizar textos, papeis, fluxo de horas, copy de interface, KPIs, permissao de gestor, README, index.html, app.js ou quando houver divergencia entre documento e prototipo.'
argument-hint: 'Descreva a tela, trecho, papel ou divergencia que precisa alinhar'
user-invocable: true
---

# Alinhamento entre Documento e Wireframe

## Quando usar

- Atualizar README, copy da interface ou textos de ajuda.
- Comparar comportamento do wireframe com a proposta tecnica.
- Corrigir inconsistencias entre perfis, fluxos, KPIs e mensagens da UI.

## Guardrails do projeto

- Em caso de conflito, a regra formal do projeto vence o texto de demonstracao do wireframe.
- Nao mantenha textos de aprovacao de horas se o escopo atual diz que nao ha aprovacao.
- Diferencie claramente responsabilidades de `admin`, `gestor` e `colaborador`.

## Procedimento

1. Identificar qual artefato estabelece a regra oficial para o trecho em analise.
2. Passar pela [checklist de alinhamento](./assets/checklist-alinhamento.md).
3. Procurar termos e estados obsoletos no README, `index.html`, `app.js` e dados mockados.
4. Atualizar documento e wireframe em conjunto quando a divergencia for visivel para o usuario.
5. Encerrar listando o que ficou sincronizado e o que ainda esta apenas como mock ou placeholder.

## Saida esperada

- Divergencias encontradas.
- Ajustes recomendados ou aplicados.
- Lista de telas e textos que ainda precisam de confirmacao.

## Recurso

- [Checklist de alinhamento](./assets/checklist-alinhamento.md)