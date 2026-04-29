# Checklist de Implementacao

## Antes de codificar

- Qual regra de negocio esta sendo alterada?
- Existe conflito com `sem aprovacao de horas`?
- O papel que executa a acao esta claro?
- Algum ponto aberto do projeto bloqueia a implementacao?

## Frontend

- A UI mostra apenas os campos previstos?
- Os textos da interface estao coerentes com a proposta?
- Existe validacao de formulario e feedback adequado?

## Backend e dados

- O endpoint aplica autorizacao por perfil?
- Existem constraints e validacoes suficientes?
- Auditoria/log foi considerada?

## Exportacao, relatorios e operacao

- A planilha de custos segue template confirmado?
- Existem logs estruturados e health checks?
- A mudanca afeta CI/CD, staging ou producao?

## Testes minimos

- Teste de regra principal.
- Teste de autorizacao.
- Teste do fluxo feliz do usuario.
- Atualizacao de mocks ou fixtures, quando necessario.
