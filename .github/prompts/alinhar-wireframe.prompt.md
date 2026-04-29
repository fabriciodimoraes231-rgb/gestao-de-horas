---
name: "Alinhar Documento e Wireframe"
description: "Compare proposta, README e wireframe para remover copy desatualizada e garantir coerencia entre papeis, fluxo de horas e escopo."
argument-hint: "Informe a tela, arquivo ou divergencia que quer alinhar"
agent: "guardiao-escopo"
---

Compare os artefatos abaixo e alinhe o que for necessario:

- `proposta_tecnica.tex`
- `wireframes/README.md`
- `wireframes/index.html`
- `wireframes/js/app.js`
- `.github/copilot-instructions.md`

Prioridades:

- remover qualquer referencia a aprovacao de horas
- garantir que o gestor seja o unico perfil com cadastro de projetos
- manter o formulario de horas com campos fixos: projeto, horas e justificativa
- destacar o que e regra oficial e o que ainda esta como mock

Formato da resposta:

- divergencias encontradas
- arquivos que devem mudar
- risco residual, se houver