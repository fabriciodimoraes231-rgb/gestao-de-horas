# Instrucoes para IA - Projeto XL

## Fonte de verdade

- Priorize `proposta_tecnica.tex` e `# Plano de Revisão: Proposta Técnica — S.prompt.md` ao decidir regras de produto, escopo e arquitetura.
- Trate `wireframes/README.md`, `wireframes/index.html` e `wireframes/js/app.js` como materiais de apoio que podem conter textos de demonstração desatualizados.
- Se houver conflito entre proposta e wireframe, preserve a decisão formal da proposta e sinalize a divergência.

## Regras imutaveis do produto

- Apenas o perfil `gestor` pode cadastrar e editar projetos.
- O lançamento de horas tem campos fixos: `projeto`, `horas`, `justificativa`.
- Nao existe fluxo de aprovacao de horas. Depois da validacao automatica, o lancamento e definitivo.
- Se o colaborador estiver em varios projetos, o sistema deve tratar cada projeto como um registro/bloco separado de lancamento.
- O login previsto para o produto e SSO com Keycloak.
- Operacoes relevantes devem ser rastreaveis via auditoria e logs estruturados.

## Quando a IA estiver editando documentos

- Mantenha o cronograma principal em `10 semanas / 5 sprints`; se aparecer `7 semanas`, trate como inconsistencia a corrigir ou destacar.
- Nao reintroduza aprovacao manual de horas por gestor em texto, README, wireframe ou fluxo funcional sem confirmacao explicita do usuario.
- Ao revisar a proposta, preserve ou complemente estes blocos: RNF, conformidade e seguranca, modelo de dados, cronograma com Definition of Done e separacao de ambientes.
- Ao sugerir backlog ou implementacao, destaque os dois pontos em aberto que afetam arquitetura: template da planilha de custos e single-tenant vs. multi-tenant.

## Defaults tecnicos esperados

- Frontend: React + TypeScript.
- Backend: Node.js + NestJS.
- Banco de dados: PostgreSQL.
- Autenticacao: Keycloak.
- Exportacao: ExcelJS.
- Testes: Jest e Playwright.
- Pipeline: GitHub Actions.
- Logging: Winston ou Pino.
- Ambientes: `dev`, `staging`, `prod` com separacao explicita.

## Checklist mental da IA

- A solucao respeita as regras de autorizacao por perfil?
- Ha alguma mencao indevida a aprovacao de horas?
- A resposta separa claramente o que esta decidido do que ainda depende de validacao?
- O que foi proposto cabe no escopo do projeto e no cronograma de 5 sprints?