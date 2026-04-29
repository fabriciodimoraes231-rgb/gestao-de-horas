---
name: revisao-proposta-tecnica
description: 'Revisar a proposta tecnica do Sistema de Controle de Horas. Use quando precisar identificar lacunas, inconsistencias, decisoes pendentes, requisitos nao funcionais, seguranca, LGPD, cronograma, Definition of Done e ajustes entre proposta, prompt de revisao e materiais do projeto.'
argument-hint: 'Informe a secao, objetivo da revisao ou o tipo de ajuste esperado'
user-invocable: true
---

# Revisao de Proposta Tecnica

## Quando usar

- Revisar `proposta_tecnica.tex` antes de apresentacao, aprovacao ou refinamento.
- Transformar feedback solto em uma lista objetiva de correcoes.
- Conferir se a proposta esta coerente com o prompt de revisao e com o escopo aprovado.

## Guardrails do projeto

- Considere `proposta_tecnica.tex` e o prompt de revisao como fonte principal.
- Preserve as decisoes ja tomadas: apenas gestor cadastra projetos, campos fixos, sem aprovacao de horas.
- Se encontrar divergencias entre o documento e o wireframe, classifique como inconsistencia e proponha ajuste explicito.

## Procedimento

1. Ler a secao alvo da proposta e o feedback relacionado.
2. Conferir a [checklist de revisao](./assets/checklist-revisao.md).
3. Classificar cada ponto como `contradicao`, `lacuna`, `decisao aberta`, `risco` ou `melhoria editorial`.
4. Propor texto substituto ou aplicar correcoes enxutas, preservando a estrutura do documento.
5. Encerrar com o que foi resolvido, o que continua em aberto e quais decisoes bloqueiam proximos passos.

## Saida esperada

- Achados priorizados.
- Texto sugerido ou patch objetivo.
- Perguntas pendentes que ainda dependem de stakeholder.

## Recurso

- [Checklist de revisao](./assets/checklist-revisao.md)