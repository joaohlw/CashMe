# 👥 Matriz de Contribuições & Atribuições de Código — Cash Me

Este documento registra a divisão de papéis, responsabilidades e entregas técnicas realizadas pelos desenvolvedores e colaboradores do ecossistema **Cash Me**:

- ⚙️ **Squad Backend, Arquitetura & Domínio Fiscal:**
  - 👤 **Hugo Batista** ([@hugobatista27](https://github.com/hugobatista27)) — Arquiteto de Requisitos/Tarefas e criador do [hugobatista27/cash-me-api](https://github.com/hugobatista27/cash-me-api) e [hugobatista27/web-scrap-app](https://github.com/hugobatista27/web-scrap-app)
  - 👤 **Stela Oliveira** ([@stela-oliveira](https://github.com/stela-oliveira)) & **Nayara** — Trabalho em conjunto na modelagem e arquitetura de fidelidade (`SISTEMA-DE-PONTOS-E-REGRAS.md`) e no núcleo de autenticação e contas da API base [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)
- 🎨 **Squad Frontend, Mobile, Integração & Testes:**
  - 👤 **Wesley** — Desenvolvimento e aprimoramento da interface do Módulo Consumidor (Home, Lojas, Ofertas, Carteira, QR Code)
  - 👤 **João Pedro** — Desenvolvimento e aprimoramento da interface do Módulo Lojista (Dashboard com Recharts, Gestão de Clientes, Vitrine, Configurações)
  - 👤 **João** — Telas de gestão de campanhas promocionais, parametrização de regras de pontuação/conversão e componentes do Design System
  - 👤 **Vitor Camargo** ([@vitto2099](https://github.com/vitto2099)) — Integração geral dos módulos (Backend, Frontend e Mobile), suíte de testes automatizados (56 testes no Japa), organização do repositório e consolidação da documentação

---

## 📊 Quadro Sinóptico de Entregas

| Área / Módulo                     | Hugo Batista (@hugobatista27)                                                           | Stela Oliveira (@stela-oliveira) & Nayara                                                                                           | Wesley, João Pedro & João (Frontend)                                                         | Vitor Camargo (@vitto2099) (Integração & Testes)                                                               |
| :-------------------------------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Arquitetura & ADRs**            | Elaborou ADR-001 (Scraping Event-Driven) e ADR-002 (Multi-Tenant)                       | Desenvolveram `SISTEMA-DE-PONTOS-E-REGRAS.md` (PR #10), ERD Mermaid com 12 entidades, versionamento de regras e ciclo de lotes FIFO | Estruturação de componentes e padrões visuais da interface web                               | Orquestração do monorepo, suporte de integração e alinhamento arquitetural                                     |
| **Backlog & Requisitos**          | Criou as 9 Tasks e Critérios de Aceite originais (#1 a #9)                              | Especificação das regras de integridade e constraints de dados                                                                      | Refinamento dos fluxos de tela e usabilidade para Consumidor e Lojista                       | Mapeamento do planejamento do Consumidor (14 épicos) e regras RN01-RN08                                        |
| **Backend Base (API)**            | Repositório original `cash-me-api`, controllers de faturas, pontos e regras             | Estrutura base de Auth (Signup, Login, Logout, Tokens OAT) e fork colaborativo                                                      | Consumo da API via services e contextos do frontend                                          | Unificação full-stack, proxy reverso, Swagger OpenAPI e banco SQLite                                           |
| **Perfis de Usuário**             | Especificação teórica dos papéis                                                        | Model `User`, autenticação OAT e ciclo de vida de tokens                                                                            | Telas de perfil do cliente (`ProfileScreen`) e da loja (`SettingsScreen`)                    | Migrations e controllers de `UserCustomer` e `UserEstablishment`                                               |
| **Modelagem de Dados**            | Migrations de `establishments`, `invoices`, `points`, `loyalty_rules` e endereços       | Modelagem conceitual completa de pontos/regras, tabela `users` e `auth_access_tokens`                                               | Tipos TypeScript espelhando contratos de domínio (`types/`)                                  | Consolidação relacional, schemas tipados e modelos Lucid integrados                                            |
| **Motor Fiscal & Pontos**         | Criou `PointsEngineService`, `CustomerInvoicesController` e `DuplicateInvoiceException` | Especificaram regras de cálculo base, tetos, arredondamento e lotes de expiração                                                    | Visualização de pontos e extrato em tempo real no frontend                                   | Port para API backend (`NfceService`/`NfceController`), endpoint `submit`, anti-fraude RN02 e regras RN01-RN07 |
| **Frontend — Consumidor**         | —                                                                                       | —                                                                                                                                   | **Wesley**: 9 telas do Consumidor (Home, Lojas, Ofertas, Detalhes, Carteira e QR Code)       | Integração com `pointsService`, `storesService` e autenticação real                                            |
| **Frontend — Lojista**            | Protótipos HTML em `example/establishment/`                                             | —                                                                                                                                   | **João Pedro**: Dashboard com gráficos Recharts, Clientes e Vitrine                          | Integração de dados reais de faturamento e clientes                                                            |
| **Frontend — Campanhas & Regras** | —                                                                                       | —                                                                                                                                   | **João**: Telas de Nova Campanha, Regras de Pontuação, Conversão em Desconto e Design System | Validação e sincronização das regras com a API                                                                 |
| **Mobile (Expo / RN)**            | Protótipo independente `web-scrap-app` (WebView Captcha e parser inicial)               | —                                                                                                                                   | Revisão de interface e feedback de usabilidade móvel                                         | Port para Expo SDK 57, TypeScript estrito, câmera, WebView Captcha e submissão à API                           |
| **Testes Automatizados**          | Teste `customer_invoice_process.spec.ts`, onboarding, regras e unitários                | Testes funcionais iniciais de autenticação                                                                                          | Testes manuais de usabilidade nas 21 telas web                                               | Execução e garantia da suíte completa com **56 testes automatizados no Japa (100% aprovados)**                 |
| **Documentação Técnica**          | Issues, ADRs e especificações técnicas de negócio                                       | Documentação arquitetural do sistema de pontos e regras, e docs de autenticação                                                     | Documentação visual e guias das telas do frontend                                            | Consolidação do README central, Swagger OpenAPI, guias de Backend/Frontend e relatórios                        |

---

## 🛠️ Detalhamento por Contribuidor e Squad

---

### 1. Hugo Batista ([@hugobatista27](https://github.com/hugobatista27)) — Repositórios [hugobatista27/cash-me-api](https://github.com/hugobatista27/cash-me-api) e [hugobatista27/web-scrap-app](https://github.com/hugobatista27/web-scrap-app)

Hugo atuou fortemente como **arquiteto técnico de software, autor dos requisitos de negócio e criador da API original e da prova de conceito fiscal**:

1. **Repositório Original da API (`hugobatista27/cash-me-api`):**
   - **Concepção Inicial e Repositório:** Inicializou o repositório base da API em AdonisJS v7 e estruturou os workflows e diretrizes de desenvolvimento.
   - **Backlog das 9 Tasks Oficiais:** Estruturou detalhadamente as **9 issues e critérios de aceite técnicos** em `docs/tasks/`:
     - Issue #1: Cadastro e Aprovação de Lojistas (Onboarding).
     - Issue #2: Cadastro Global de Consumidor.
     - Issue #3: Submissão de QR Code e Validação de Entrada.
     - Issue #4: Worker Assíncrono de Scraping na SEFAZ.
     - Issue #5: Motor de Cômputo de Pontos e Isolamento Multi-Tenant.
     - Issue #6: Configuração Customizável de Regras de Conversão.
     - Issue #7: Proteção de Inadimplência e Manutenção do Saldo.
     - Issue #8: Dashboard Lojista com Filtro de Privacidade.
     - Issue #9: Notificações Push de Conclusão FCM.
   - **Decisões de Arquitetura de Software (ADRs):**
     - Redigiu o **ADR-001** (Processamento Assíncrono de Notas Fiscais via Event-Driven Design).
     - Redigiu o **ADR-002** (Isolamento Multi-Tenant Lógico).
   - **Modelagem de Dados e Migrations Originais:**
     - `create_establishments_table.ts` e `add_establishment_fk_to_user_establishments_table.ts`.
     - `add_contact_fields_to_establishments_table.ts` e `create_establishment_addresses_table.ts` (endereço e contatos do lojista).
     - `create_invoices_tables.ts` (tabelas de `invoices` e `invoice_items`).
     - `create_points_tables.ts` (tabelas de `point_balances` e `point_transactions`).
     - `create_loyalty_rules_tables.ts` e `add_rule_reference_to_point_transactions_table.ts` (regras customizadas de pontuação do lojista).
   - **Motor de Cômputo de Pontos e Controladores REST:**
     - `PointsEngineService`: Implementou o motor de cômputo com validação anti-fraude de chave duplicada (`DuplicateInvoiceException`).
     - `CustomerInvoicesController` (`POST /api/v1/customer/invoices/process`): Validação com `processInvoiceValidator` e serialização com `InvoiceTransformer`.
     - `CustomerPointsController`: Rotas de consulta de saldos e transações do consumidor com `PointBalanceTransformer`.
     - `EstablishmentsController` e `EstablishmentRulesController`: Gestão cadastral de estabelecimentos e parametrização de regras de conversão com `EstablishmentTransformer`.
   - **Testes Automatizados:**
     - Criou os testes funcionais de faturas em `tests/functional/invoices/customer_invoice_process.spec.ts`.
   - **Prototipação Web para Lojistas:**
     - Desenvolveu telas de exemplo para lojistas em `example/establishment/` (`cadastro.html`, `index.html`, `list.html`).
2. **Prova de Conceito de Scraping Fiscal (`hugobatista27/web-scrap-app`):**
   - Desenvolveu o protótipo móvel inicial em Expo com leitura de QR Code da NFC-e.
   - Criou o mecanismo de WebView para contornar Captchas nos portais da SEFAZ.
   - Escreveu o algoritmo de parsing de HTML de NFC-e (`utils/nfce-parser.ts`) validando os portais da SEFAZ de Santa Catarina (`sat.sef.sc.gov.br`) e Paraná (`fazenda.pr.gov.br`).

---

### 2. Stela Oliveira ([@stela-oliveira](https://github.com/stela-oliveira)) & Nayara — Repositório [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)

Stela e Nayara trabalharam em conjunto na **arquitetura do sistema de pontos e regras personalizáveis** (incorporada ao repositório upstream via Pull Request #10) e na **fundação do núcleo de autenticação e contas da API**:

1. **Arquitetura e Modelagem do Sistema de Pontos (`docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md` — PR #10):**
   - **Concepção do Domínio de Fidelidade:**
     - Estabeleceram o princípio do **extrato de pontos como razão imutável (ledger auditável)** e o saldo por consumidor/estabelecimento como uma projeção rápida atualizada na mesma transação.
     - Desenharam o mecanismo de **versionamento de regras**: congelamento da versão da regra no momento do lançamento, impedindo recálculo retroativo de compras passadas.
     - Definiram o isolamento multi-tenant lógico (pontos pertencentes estritamente ao par `consumidor + estabelecimento`, sem compartilhamento entre lojas).
     - Estabeleceram o princípio de cálculo executado **exclusivamente no backend**, garantindo segurança e integridade das pontuações.
   - **Diagrama de Entidade-Relacionamento Completo (Mermaid ERD):**
     - Mapearam 12 entidades essenciais para o ecossistema de fidelidade: `ESTABELECIMENTOS`, `PROGRAMAS_FIDELIDADE`, `CAMPANHAS_PONTOS`, `RECOMPENSAS`, `SALDOS_PONTOS`, `EXTRATOS_PONTOS`, `RESGATES_PONTOS`, `LOTES_PONTOS`, `NFCES`, `NFCE_ITENS`, `MODELOS_REGRAS_PONTOS` e `REGRAS_PONTOS`.
   - **Estrutura de Regras Configuráveis em JSON:**
     - Especificaram o formato padronizado de regras (`tipo: "POR_VALOR"`, `reais_base`, `pontos_por_base`, `arredondamento`, `valor_minimo_compra`, `limite_pontos_por_compra`, `expiracao`, `acumula_com_campanhas`).
     - Criaram o catálogo de templates para lojistas (`BASICO_1_POR_REAL`, etc.).
   - **Gestão de Lotes e Expiração de Pontos:**
     - Modelaram a entidade `lotes_pontos` para suporte a expiração cronológica e débito prioritário por vencimento (estratégia FIFO).
   - **Índices de Performance e Regras de Integridade:**
     - Mapearam chaves únicas compostas (`UNIQUE(estabelecimento_id, nome)`, `UNIQUE(programa_id, versao)`, `UNIQUE(extrato_credito_id)`).
     - Mapearam índices de busca rápida para vigência, saldos e extratos.
2. **Módulo de Autenticação Segura com AdonisJS v7:**
   - Configuração de `@adonisjs/auth` com estratégia OAT (Access Tokens / Bearer Token).
   - Implementação do model `User` e tabela `users` com hash seguro de senhas (Argon2 / Scrypt).
   - Implementação da tabela e ciclo de vida de `access_tokens`.
3. **Endpoints REST de Acesso:**
   - `POST /api/v1/auth/signup` (`NewAccountController`): Cadastro de novos usuários com validação VineJS.
   - `POST /api/v1/auth/login` (`AccessTokensController`): Autenticação de credenciais e emissão de tokens.
   - `GET /api/v1/account/profile` (`ProfileController`): Retorno do perfil autenticado.
   - `POST /api/v1/account/logout`: Revogação e exclusão do token no banco.
4. **Validação & Transformer:**
   - Esquemas de validação de entrada de dados com VineJS (`app/validators/user.ts`).
   - Serializador seguro de resposta (`app/transformers/user_transformer.ts`) mascarando senhas e gerando iniciais de avatar.
5. **Testes Funcionais Iniciais:**
   - Criação da suíte funcional inicial de autenticação com o framework Japa (`tests/functional/auth.spec.ts`).

---

### 3. Squad Frontend Web — Wesley, João Pedro & João

O squad de frontend foi responsável pelo desenvolvimento, melhorias e polimento da interface do usuário em **React 18 + Vite + Tailwind CSS v4**, dividindo responsabilidades entre as personas e jornadas do sistema:

#### 👤 Wesley — Módulo Consumidor

- Desenvolvimento e refinamento das **9 telas do Consumidor**:
  - `HomeScreen`: Dashboard do cliente com saldo consolidado de pontos, banners promocionais e categorias rápidas.
  - `StoresScreen` & `StoreDetailScreen`: Catálogo de lojas parceiras com busca, filtros e detalhes do estabelecimento (regras de pontuação, telefone e endereço).
  - `OffersScreen` & `OfferDetailScreen`: Vitrine de cupons e benefícios disponíveis para resgate.
  - `WalletScreen`: Carteira digital com extrato auditável de transações (créditos e resgates).
  - `QRCodeScreen`: QR Code pessoal do cliente para identificação rápida no caixa.
  - `ProfileScreen`: Perfil do consumidor com dados cadastrais e preferências.
- Responsividade e usabilidade mobile-first no navegador.

#### 👤 João Pedro — Módulo Lojista / Comerciante

- Desenvolvimento e refinamento das **telas principais do Comerciante**:
  - `DashboardScreen`: Painel gerencial com gráficos analíticos (Recharts) de volume de faturamento e pontos distribuídos.
  - `CustomersScreen` & `CustomerDetailScreen`: Gestão de clientes fidelizados com histórico individual de pontuação e compras.
  - `VitrineScreen`: Gestão da vitrine de ofertas da loja e visualização de cupons ativos.
  - `SettingsScreen`: Configurações cadastrais da loja, dados de contato e parâmetros operacionais.

#### 👤 João — Campanhas, Regras de Fidelidade & Design System

- Desenvolvimento e refinamento das telas de engajamento e regras:
  - `CampaignsScreen` & `NewCampaignScreen`: Gestão e cadastro de novas campanhas promocionais e cupons de recompensa.
  - `ScoringRulesScreen`: Configuração visual das regras de conversão de pontos (ex: R$ 1,00 = 1 Ponto).
  - `PointsConversionScreen`: Definição de regras para troca de pontos por desconto e vouchers.
- Criação e padronização dos componentes reutilizáveis de UI (`components/common/`), formulários (`CampoFormulario`), botões (`BotaoVoltar`), controles segmentados e variáveis visuais do Design System (`src/styles/theme.css`).

---

### 4. Vitor Camargo ([@vitto2099](https://github.com/vitto2099)) — Integração, Testes & Documentação

Vitor Camargo atuou com foco em **integração dos módulos, testes automatizados, organização da estrutura e documentação**, unificando o trabalho de Hugo, Stela, Nayara, Wesley, João Pedro e João em uma plataforma única e testada:

1. **Consolidação e Integração Monorepo Full-Stack:**
   - Unificou a API AdonisJS v7, o Frontend React 18 e o Mobile Expo em uma raiz única e organizada.
   - Criou o script integrado de desenvolvimento `scripts/dev.mjs` (`npm run dev`) que executa Backend (`:3333`) e Frontend (`:5173`) simultaneamente com cores no terminal e proxy reverso `/api` configurado no Vite.
2. **Conexão Frontend-Backend:**
   - Implementou `AuthContext` conectando o frontend à API real (cadastro, login, logout e persistência do Bearer token).
   - Conectou `AppContext`, `pointsService`, `storesService` e `transactionsService` ao backend relacional, eliminando dados mockados quando autenticado.
3. **Persistência Relacional Core & Motor de Submissão:**
   - Criou migrations e models para `establishments`, `nfces`, `nfce_items`, `point_balances` e `point_transactions`.
   - Implementou o endpoint transacional `POST /api/v1/nfce/submit`, validando emissão < 48h (**RN01**), unicidade anti-fraude no SQLite (**RN02**), match de CNPJ da loja (**RN03**), cômputo dinâmico de pontos (**RN04**), status do lojista (**RN05**) e aceitação geográfica SC/PR (**RN07**).
   - Criou endpoints de saldo `/account/points/balance`, extrato `/account/points/transactions`, resgate de pontos `/account/points/redeem` e listagem de lojas `/establishments`.
4. **Integração do Módulo Mobile Nativo (`mobile/`):**
   - Portou e atualizou a solução do `hugobatista27/web-scrap-app` para o ecossistema moderno do Expo (SDK 57, React Native 0.86, React 19 e TypeScript estrito).
   - Implementou componentes `QrScannerModal` (com `expo-camera`, lanterna e haptics), `NfceResultView` (resumo de itens, total e pontos com sincronização na API via `submitNfce`), WebView para contornar Captchas da SEFAZ e aba dedicada de scanner com histórico de leituras.
5. **Garantia de Qualidade & Testes Automatizados:**
   - Orquestrou e expandiu a cobertura de testes no Japa para **56 testes automatizados (unitários e funcionais) com 100% de aprovação**, cobrindo autenticação, perfis, onboarding, regras versionadas, motor de pontos, faturas e parsing SEFAZ.
6. **Documentação Técnica & Governança:**
   - Elaborou e centralizou os documentos de especificação [README.md](../README.md), [FRONTEND.md](guides/FRONTEND.md), [BACKEND.md](guides/BACKEND.md), [PLANEJAMENTO-CONSUMIDOR.md](product/PLANEJAMENTO-CONSUMIDOR.md) e Swagger OpenAPI interativo em `/docs`.

---

## 🔗 Referências dos Repositórios Oficiais

- 🌐 **Repositório Unificado:** [vitto2099/CashMe](https://github.com/vitto2099/CashMe)
- 🔧 **API Original:** [hugobatista27/cash-me-api](https://github.com/hugobatista27/cash-me-api)
- 🔑 **API Auth Base:** [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)
- 📱 **Web Scrap Mobile:** [hugobatista27/web-scrap-app](https://github.com/hugobatista27/web-scrap-app)
