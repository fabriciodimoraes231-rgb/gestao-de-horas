# Matriz de Requisitos Nao Funcionais

## Performance

- Pergunta: qual o tempo maximo para um lancamento de horas?
- Valor ou criterio sugerido: `< 2s`
- Como validar: teste funcional e monitoramento.

## Disponibilidade

- Pergunta: qual SLA em horario comercial?
- Valor ou criterio sugerido: `99,5%`
- Como validar: monitoramento e historico de uptime.

## Capacidade

- Pergunta: quantos usuarios simultaneos o MVP deve suportar?
- Valor ou criterio sugerido: definir.
- Como validar: teste de carga basico.

## Volume de dados

- Pergunta: quantos lancamentos por mes sao esperados?
- Valor ou criterio sugerido: definir.
- Como validar: estimativa validada com o negocio.

## Compatibilidade

- Pergunta: quais navegadores e versoes sao obrigatorios?
- Valor ou criterio sugerido: definir.
- Como validar: matriz de testes.

## Acesso

- Pergunta: o que cada perfil pode ler, criar e exportar?
- Valor ou criterio sugerido: definir por role.
- Como validar: tabela de autorizacao.

## LGPD

- Pergunta: como funciona retencao, anonimização e exclusao?
- Valor ou criterio sugerido: politica explicita.
- Como validar: processo documentado.

## Backup

- Pergunta: qual frequencia e retencao de backup?
- Valor ou criterio sugerido: diario, 30 dias.
- Como validar: rotina automatizada.

## Recuperacao

- Pergunta: quais sao RPO e RTO?
- Valor ou criterio sugerido: `24h` / `4h`.
- Como validar: teste de restauracao.

## Observabilidade

- Pergunta: quais logs, metricas e health checks existem?
- Valor ou criterio sugerido: definir.
- Como validar: checklist operacional.

## Observacoes

- Substitua `Definir` por valores confirmados com stakeholder.
- Prefira sempre medidas objetivas e auditaveis.

