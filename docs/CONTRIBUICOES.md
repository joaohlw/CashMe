# 👥 Matriz de Contribuições & Atribuições de Código — Cash Me

Este documento registra a divisão de papéis, responsabilidades e entregas técnicas realizadas pelos desenvolvedores e contribuidores do ecossistema **Cash Me**:

- 👤 **Hugo Batista** ([@hugobatista27](https://github.com/hugobatista27)) — Arquiteto de Requisitos/Tarefas e criador do [hugobatista27/web-scrap-app](https://github.com/hugobatista27/web-scrap-app) e [hugobatista27/cash-me-api](https://github.com/hugobatista27/cash-me-api)
- 👤 **Stela Oliveira** ([@stela-oliveira](https://github.com/stela-oliveira)) — Contribuidora da modelagem do sistema de pontos e regras, e da API base de autenticação [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)
- 👤 **Vitor Camargo** ([@vitto2099](https://github.com/vitto2099)) — Integração dos módulos, testes automatizados, organização e documentação no repositório unificado [vitto2099/CashMe](https://github.com/vitto2099/CashMe)

---

## 📊 Quadro Sinóptico de Entregas

| Área / Módulo                   | Hugo Batista (@hugobatista27)                                                           | Stela Oliveira (@stela-oliveira)                                                                                                       | Vitor Camargo (@vitto2099)                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Arquitetura & ADRs**          | Elaborou ADR-001 (Scraping Event-Driven) e ADR-002 (Multi-Tenant)                       | Desenvolveu `SISTEMA-DE-PONTOS-E-REGRAS.md` (PR #10), com ERD Mermaid, princípios de domínio, versionamento de regras e ciclo de lotes | Implementou a orquestração e integração no monorepo                                                                           |
| **Backlog & Requisitos**        | Criou as 9 Tasks e Critérios de Aceite originais (#1 a #9)                              | —                                                                                                                                      | Criou planejamento do Consumidor (14 épicos) e alinhamento das RNs                                                            |
| **Backend Base (API)**          | Repositório original `cash-me-api`, controllers de faturas, pontos e regras             | Estrutura base de Auth (Signup, Login, Logout, Tokens OAT) e fork colaborativo                                                         | Consolidação, unificação full-stack, Swagger UI, SQLite e proxy reverso                                                       |
| **Perfis de Usuário**           | Especificação teórica                                                                   | Model `User` e autenticação básica                                                                                                     | Migrations e Controllers de `UserCustomer` e `UserEstablishment`                                                              |
| **Modelagem de Dados**          | Migrations de `establishments`, `invoices`, `points`, `loyalty_rules` e endereços       | Modelagem conceitual completa de pontos/regras, tabela `users` e `auth_access_tokens`                                                  | Consolidação relacional, schemas tipados e modelos Lucid integrados                                                           |
| **Motor Fiscal & Pontos**       | Criou `PointsEngineService`, `CustomerInvoicesController` e `DuplicateInvoiceException` | Especificou regras de cálculo base, tetos, arredondamento e lotes de expiração                                                         | Port para API backend (`NfceService`/`NfceController`), endpoint `submit`, anti-fraude RN02 e regras RN01/RN03/RN04/RN05/RN07 |
| **Gestão de Pontos & Carteira** | `CustomerPointsController` e regras por estabelecimento                                 | Arquitetura de saldo rápido vs extrato imutável de transações                                                                          | Controllers e rotas de saldo `/points/balance`, extrato `/points/transactions` e resgate `/points/redeem`                     |
| **Frontend Web**                | Protótipos HTML em `example/establishment/`                                             | —                                                                                                                                      | Criação de 21 telas, Tailwind v4, Design System, Contexts, sincronização real com backend e Services                          |
| **Mobile (Expo / RN)**          | Protótipo independente `web-scrap-app` (WebView Captcha e parser inicial)               | —                                                                                                                                      | Port para Expo SDK 57, TypeScript estrito, câmera, WebView de Captcha e conexão de submissão com a API                        |
| **Testes Automatizados**        | Teste `customer_invoice_process.spec.ts`, onboarding, regras e unitários                | 6 testes funcionais iniciais de autenticação                                                                                           | Consolidação e expansão da suíte para 56 testes automatizados no Japa (100% aprovados)                                        |
| **Documentação Técnica**        | Issues, ADRs e especificações técnicas de negócio                                       | Documentação arquitetural do sistema de pontos e regras, e docs de autenticação                                                        | READMEs unificados, Swagger OpenAPI, relatórios de diagnóstico e guias                                                        |

---

## 🛠️ Detalhamento por Contribuidor

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

### 2. Stela Oliveira ([@stela-oliveira](https://github.com/stela-oliveira)) — Repositório [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)

Stela foi responsável pela **arquitetura do sistema de pontos e regras personalizáveis** (incorporada ao repositório upstream via Pull Request #10) e pela **fundação do núcleo de autenticação e contas da API**:

1. **Arquitetura e Modelagem do Sistema de Pontos (`docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md` — PR #10):**
   - **Concepção do Domínio de Fidelidade:**
     - Estabeleceu o princípio do **extrato de pontos como razão imutável (ledger auditável)** e o saldo por consumidor/estabelecimento como uma projeção rápida atualizada na mesma transação.
     - Desenhou o mecanismo de **versionamento de regras**: congelamento da versão da regra no momento do lançamento, impedindo recálculo retroativo de compras passadas.
     - Definiu o isolamento multi-tenant lógico (pontos pertencentes estritamente ao par `consumidor + estabelecimento`, sem compartilhamento entre lojas).
     - Estabeleceu o princípio de cálculo executado **exclusivamente no backend**, garantindo segurança e integridade das pontuações.
   - **Diagrama de Entidade-Relacionamento Completo (Mermaid ERD):**
     - Mapeou 12 entidades essenciais para o ecossistema de fidelidade: `ESTABELECIMENTOS`, `PROGRAMAS_FIDELIDADE`, `CAMPANHAS_PONTOS`, `RECOMPENSAS`, `SALDOS_PONTOS`, `EXTRATOS_PONTOS`, `RESGATES_PONTOS`, `LOTES_PONTOS`, `NFCES`, `NFCE_ITENS`, `MODELOS_REGRAS_PONTOS` e `REGRAS_PONTOS`.
   - **Estrutura de Regras Configuráveis em JSON:**
     - Especificou o formato padronizado de regras (`tipo: "POR_VALOR"`, `reais_base`, `pontos_por_base`, `arredondamento`, `valor_minimo_compra`, `limite_pontos_por_compra`, `expiracao`, `acumula_com_campanhas`).
     - Criou o catálogo de templates para lojistas (`BASICO_1_POR_REAL`, etc.).
   - **Gestão de Lotes e Expiração de Pontos:**
     - Modelou a entidade `lotes_pontos` para suporte a expiração cronológica e débito prioritário por vencimento (estratégia FIFO).
   - **Índices de Performance e Regras de Integridade:**
     - Mapeou chaves únicas compostas (`UNIQUE(estabelecimento_id, nome)`, `UNIQUE(programa_id, versao)`, `UNIQUE(extrato_credito_id)`).
     - Mapeou índices de busca rápida para vigência, saldos e extratos.
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
   - Criou a primeira suíte de 6 testes funcionais com o framework Japa (`tests/functional/auth.spec.ts`).

---

### 3. Vitor Camargo ([@vitto2099](https://github.com/vitto2099)) — Repositório Integrado [vitto2099/CashMe](https://github.com/vitto2099/CashMe)

Vitor Camargo atuou com foco em **integração dos módulos, testes automatizados, organização da estrutura e documentação**, unificando o trabalho de Hugo e Stela com as camadas de frontend web e mobile, garantindo que o sistema funcione de forma integrada e validada:

1. **Consolidação e Arquitetura Monorepo Full-Stack:**
   - Unificou a API AdonisJS v7, o Frontend React 18 e o Mobile Expo em uma raiz única e organizada.
   - Criou o script integrado de desenvolvimento `scripts/dev.mjs` (`npm run dev`) que executa Backend (`:3333`) e Frontend (`:5173`) simultaneamente com cores no terminal e proxy reverso `/api` configurado no Vite.
2. **Desenvolvimento Completo do Frontend Web (`React 18` + `Vite` + `Tailwind v4`):**
   - Criou e organizou **21 telas completas**:
     - **9 telas do Consumidor:** Home com saldo e banners, Lojas, Detalhe da Loja, Ofertas, Detalhe da Oferta, Carteira com extrato, Leitor/Simulador de NFC-e com tabela de itens, QR Code pessoal e Perfil.
     - **11 telas do Comerciante:** Dashboard com gráficos Recharts de faturamento, Gestão de Campanhas, Nova Campanha, Regras de Pontuação (R$ para Pontos), Conversão de Pontos em Desconto, QR da Loja, Clientes fidelizados, Detalhe do Cliente, Vitrine de Ofertas, Nova Oferta e Configurações da Loja.
     - **Landing Page:** Entrada com seleção de perfil e modal de autenticação.
   - Construiu a barra de navegação superior (`WebNavbar`) e rodapé corporativo (`WebFooter`) transformando o protótipo móvel em um web app responsivo para desktop e dispositivos móveis.
   - Implementou `AuthContext` conectando o frontend à API real (cadastro, login, logout e persistência do Bearer token).
   - Conectou `AppContext`, `pointsService`, `storesService` e `transactionsService` ao backend relacional, eliminando dados mockados quando autenticado.
3. **Persistência Relacional Core & Motor de Pontuação Backend:**
   - **Modelagem Relacional de Fidelidade:**
     - Criou migrations e models para `establishments` (tenants comerciais, CNPJ, fator de conversão e status), `nfces` (notas fiscais com chave de 44 dígitos `UNIQUE` no banco), `nfce_items` (linhas de produtos comprados), `point_balances` (saldo por loja multi-tenant) e `point_transactions` (ledger imutável de extrato).
   - **Segmentação de Perfis (RN04 e RN06):**
     - Criou migrations e models para `user_customers` (Consumidor: CPF, telefone, termos de aceite, device_token) e `user_establishments` (Lojista: cargo, vínculo de estabelecimento).
     - Criou controllers e rotas completas para `/customer/signup`, `/customer/profile`, `/establishment/signup` e `/establishment/profile`.
   - **Motor de Submissão e Crédito Fiscal de NFC-e:**
     - Implementou o endpoint transacional `POST /api/v1/nfce/submit`, validando emissão < 48h (**RN01**), unicidade anti-fraude no SQLite (**RN02**), match de CNPJ da loja (**RN03**), cômputo dinâmico de pontos (**RN04**), status do lojista (**RN05**) e aceitação geográfica SC/PR (**RN07**).
     - Criou endpoints de saldo `/account/points/balance`, extrato `/account/points/transactions`, resgate de pontos `/account/points/redeem` e listagem de estabelecimentos parceiros `/establishments`.
   - **Documentação Swagger/OpenAPI:**
     - Configurou o Adonis AutoSwagger gerando especificação OpenAPI em `/swagger` e interface interativa visual em `/docs`.
   - **Garantia de Qualidade e Testes Automatizados:**
     - Expandiu a cobertura de testes funcionais no Japa para **56 testes automatizados no Japa com 100% de aprovação**, cobrindo autenticação, perfis especializados, submissão de NFC-e com cômputo real em banco, rejeição de notas duplicadas (anti-fraude), consulta de saldo/extrato e resgate com débito.
4. **Integração do Módulo Mobile Nativo (`mobile/`):**
   - Portou e atualizou a solução do `hugobatista27/web-scrap-app` para o ecossistema moderno do Expo (SDK 57, React Native 0.86, React 19 e TypeScript estrito).
   - Implementou os componentes `QrScannerModal` (com `expo-camera`, lanterna e haptics), `NfceResultView` (resumo de itens, total e pontos com sincronização na API via `submitNfce`), WebView para contornar Captchas da SEFAZ e aba dedicada de scanner com histórico de leituras.
   - Criou o cliente de comunicação mobile em `mobile/src/services/api.ts` com suporte automático ao Android Emulator e iOS.
5. **Documentação e Guias Técnicos:**
   - Elaborou os documentos de especificação [README.md](../README.md), [FRONTEND.md](guides/FRONTEND.md), [BACKEND.md](guides/BACKEND.md) e [PLANEJAMENTO-CONSUMIDOR.md](product/PLANEJAMENTO-CONSUMIDOR.md).

---

## 🔗 Referências dos Repositórios Oficiais

- 🌐 **Repositório Unificado:** [vitto2099/CashMe](https://github.com/vitto2099/CashMe)
- 🔧 **API Original:** [hugobatista27/cash-me-api](https://github.com/hugobatista27/cash-me-api)
- 🔑 **API Auth Base:** [stela-oliveira/cash-me-api](https://github.com/stela-oliveira/cash-me-api)
- 📱 **Web Scrap Mobile:** [hugobatista27/web-scrap-app](https://github.com/hugobatista27/web-scrap-app)
