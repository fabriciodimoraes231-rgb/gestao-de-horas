# Template de Entidades e Endpoints

## 1. Contexto do fluxo

- Objetivo do fluxo:
- Papel que executa a acao:
- Decisao de escopo relacionada:

## 2. Entidades envolvidas

| Entidade      | Responsabilidade | Campos obrigatorios | Observacoes |
| ------------- | ---------------- | ------------------- | ----------- |
| User          |                  |                     |             |
| Project       |                  |                     |             |
| ProjectMember |                  |                     |             |
| TimeEntry     |                  |                     |             |
| AuditLog      |                  |                     |             |

## 3. Constraints e validacoes

- Chaves e relacionamentos:
- Regras de horario e limite de horas:
- Regras por perfil:
- Regras de auditoria:
- Campos que nao podem existir:

## 4. Endpoints ou contratos

| Operacao         | Metodo | Rota | Papel permitido | Validacoes |
| ---------------- | ------ | ---- | --------------- | ---------- |
| Criar projeto    | POST   |      | Gestor          |            |
| Lancar horas     | POST   |      | Colaborador     |            |
| Listar relatorio | GET    |      | Gestor/Admin    |            |

## 5. Pontos abertos

- Template final da planilha de custos:
- Single-tenant ou multi-tenant:
- Outras suposicoes feitas:
