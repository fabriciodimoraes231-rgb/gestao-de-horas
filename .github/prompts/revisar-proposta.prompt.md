---
name: "Revisar Proposta Tecnica"
description: "Revise a proposta tecnica do Sistema de Controle de Horas contra o plano de revisao e as regras imutaveis do projeto."
argument-hint: "Informe a secao, o foco da revisao ou a profundidade desejada"
agent: "guardiao-escopo"
---

Revise a proposta tecnica do projeto usando como referencia principal:

- `proposta_tecnica.tex`
- `# Plano de Revisao: Proposta Tecnica — S.prompt.md`
- `.github/copilot-instructions.md`

Objetivo:

- encontrar contradicoes, lacunas e decisoes tratadas como fechadas sem validacao formal
- checar cronograma, RNF, seguranca, LGPD, modelo de dados e separacao de ambientes
- preservar as regras imutaveis do produto

Formato da resposta:

- achados priorizados
- trechos ou secoes que precisam mudar
- pendencias que ainda dependem de stakeholder