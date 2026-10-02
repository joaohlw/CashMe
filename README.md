# 🛍️ Cash Me — Plataforma Full-Stack Integrada

> Sistema completo de fidelidade e cashback baseado no escaneamento de **NFC-e (Notas Fiscais de Consumidor Eletrônica)** da SEFAZ, conectando **consumidores** e **comerciantes locais** com isolamento lógico multi-tenant.

---

## 📖 O Que É o Projeto Cash Me?

O **Cash Me** é uma solução tecnológica full-stack desenvolvida para transformar compras rotineiras no comércio local em pontos de fidelidade e recompensas reais.

### Como Funciona:

1. **O Consumidor** faz uma compra em qualquer estabelecimento parceiro de Santa Catarina (SC) ou Paraná (PR) e recebe sua NFC-e (com QR Code).
2. **Pelo App Mobile ou Web**, o consumidor escaneia o QR Code ou insere a Chave de Acesso de 44 dígitos da nota fiscal.
3. **O Motor Fiscal** valida a autenticidade e regras da SEFAZ:
   - Rejeita notas emitidas há mais de 48 horas (**RN01**).
   - Impede o reaproveitamento de notas já lidas através de checagem única de chave no banco (**RN02 - Anti-Fraude**).
   - Identifica o estabelecimento pelo CNPJ emitente (**RN03**).
   - Computa os pontos aplicando a taxa de conversão configurada pelo comerciante (**RN04**).
   - Bloqueia novas pontuações caso o lojista esteja inativo, preservando o saldo anterior do cliente (**RN05**).
   - Aceita notas fiscais da SEFAZ de SC e PR (**RN07**).
4. **O Saldo de Pontos** é creditado diretamente na carteira digital do consumidor no banco de dados e pode ser resgatado por vouchers, descontos e brindes cadastrados na vitrine do comerciante.
5. **O Comerciante** acessa um dashboard web completo com métricas de retenção, volume de faturamento, gestão de campanhas promocionais e regras de fidelização.

---

## 👥 Equipe & Divisão de Tarefas

O ecossistema **Cash Me** é desenvolvido colaborativamente em squads especializados:

### ⚙️ Backend, Arquitetura & Domínio Fiscal

- 👤 **Hugo Batista ([@hugobatista27](https://github.com/hugobatista27))** — Requisitos técnicos originais (#1 a #9), ADRs de arquitetura (ADR-001 e ADR-002), concepção da API base em AdonisJS, motor `PointsEngineService` e prova de conceito do scraping fiscal (`web-scrap-app`).
- 👤 **Stela Oliveira ([@stela-oliveira](https://github.com/stela-oliveira)) & Nayara** — Trabalho em conjunto na arquitetura do sistema de pontos e regras personalizáveis (`SISTEMA-DE-PONTOS-E-REGRAS.md`), modelagem do extrato como ledger imutável, versionamento de regras congeladas, modelagem de dados e desenvolvimento da base de autenticação OAT e contas da API (`cash-me-api`).

### 🎨 Frontend Web, Mobile, Integração & Testes

- 👤 **Wesley** — Desenvolvimento e aprimoramento da interface do **Módulo Consumidor** (Home com saldo e carrosséis, catálogo de Lojas parceiras, Vitrine de Ofertas, Carteira digital e QR Code do cliente).
- 👤 **João Pedro** — Desenvolvimento e aprimoramento da interface do **Módulo Lojista/Comerciante** (Dashboard de métricas com gráficos Recharts de faturamento, Gestão de Clientes fidelizados, Vitrine de Ofertas e Configurações da Loja).
- 👤 **João** — Desenvolvimento e refinamento das telas de gestão de campanhas promocionais, telas de parametrização de regras de pontuação (R$ para Pontos), conversão em descontos e componentes compartilhados de UI (Design System).
- 👤 **Vitor Camargo ([@vitto2099](https://github.com/vitto2099))** — **Integração, Testes e Documentação**: unificação das camadas (Backend, Frontend Web e Mobile Expo), integração das APIs com o frontend, execução e validação da suíte de 56 testes automatizados no Japa (100% aprovados), organização do repositório e consolidação de toda a documentação técnica.

Consulte o detalhamento completo em **[docs/CONTRIBUICOES.md](./docs/CONTRIBUICOES.md)** e **[docs/ATTRIBUTIONS.md](./docs/ATTRIBUTIONS.md)**.

---

## 🎯 O Que Já Está Feito (Status das Entregas)

### 🔧 1. Backend RESTful (AdonisJS v7 + Lucid ORM + SQLite)

- ✅ **Autenticação Segura (OAT)**: Cadastro, Login com hash seguro, Logout com revogação de tokens e perfil autenticado.
- ✅ **Perfis Especializados**: Modelos e controllers para Consumidor (`UserCustomer`) e Lojista (`UserEstablishment`).
- ✅ **Banco de Dados Relacional (9 Tabelas Migradas)**:
  - `users` & `auth_access_tokens`
  - `user_customers` & `user_establishments`
  - `establishments` (lojas parceiras com CNPJ único, status e fator de conversão)
  - `nfces` (notas com chave de 44 dígitos `UNIQUE` no banco)
  - `nfce_items` (itens da compra)
  - `point_balances` (saldo por loja multi-tenant)
  - `point_transactions` (ledger imutável de extrato de créditos e débitos)
- ✅ **Motor Fiscal NFC-e Transacional**:
  - `POST /api/v1/nfce/validate`: Validação estrutural de URL e Chave SEFAZ.
  - `POST /api/v1/nfce/parse`: Extração de produtos, valores e totais.
  - `POST /api/v1/nfce/submit`: Submissão autenticada com crédito de pontos no banco de dados.
- ✅ **Carteira e Ledger de Pontos**:
  - `GET /api/v1/account/points/balance`: Consulta de saldo consolidado e por loja.
  - `GET /api/v1/account/points/transactions`: Extrato auditável de transações.
  - `POST /api/v1/account/points/redeem`: Resgate de pontos com validação de saldo e débito.
  - `GET /api/v1/establishments`: Catálogo de lojas cadastradas.
- ✅ **Documentação Interativa Swagger**: Disponível em `/docs` e JSON em `/swagger`.

### ⚛️ 2. Frontend Web (React 18 + Vite + Tailwind CSS v4)

- ✅ **21 Telas Completas e Funcionais**:
  - **9 Telas do Consumidor:** Home, Lojas, Detalhe da Loja, Ofertas, Detalhe da Oferta, Carteira com extrato, Leitor/Simulador de NFC-e com itens, QR Code pessoal e Perfil.
  - **11 Telas do Comerciante:** Dashboard com gráficos Recharts de faturamento, Gestão de Campanhas, Nova Campanha, Regras de Pontuação, Conversão em Desconto, QR da Loja, Clientes fidelizados, Detalhe do Cliente, Vitrine de Ofertas, Nova Oferta e Configurações da Loja.
  - **Landing Page SaaS:** Apresentação da plataforma com alternância rápida de perfis e modal de login/cadastro.
- ✅ **Sincronização com o Backend**: O leitor de NFC-e grava na API oficial, a Carteira exibe o saldo real do usuário autenticado e o extrato consome dados do banco SQLite.

### 📱 3. Aplicativo Mobile Nativo (Expo SDK 57 + React Native 0.86)

- ✅ **Leitor de Câmera com QR Code**: Câmera nativa de alta performance com lanterna e feedback háptico (`expo-haptics`).
- ✅ **WebView Integrado para Captcha SEFAZ**: Permite ao usuário visualizar o portal oficial da SEFAZ SC, resolver captchas e extrair o HTML estruturado via injeção JavaScript automática.
- ✅ **Cliente de API Mobile**: Integrado com suporte a emulador Android (`10.0.2.2:3333`) e iOS/Web (`localhost:3333`).

### 🧪 4. Suíte de Testes Automatizados (Japa)

- ✅ **56 de 56 testes automatizados (unitários e funcionais) passando com 100% de sucesso (`npm test`)**:
  - **Testes Unitários (3)**: Motor de pontos (`PointsEngine`), motor de regras de fidelidade (`LoyaltyRuleEngine`) e modelo `User`.
  - **Autenticação, Perfis & Contas (15)**: Signup, login, logout revogando tokens, perfil de consumidor e perfil de lojista.
  - **Onboarding e Cadastro do Comércio (5)**: Registro atômico (usuário + loja + endereço + programa), aprovação por SUPER_ADMIN e endereçamento.
  - **Regras Customizáveis de Fidelidade (6)**: Versionamento de regras (Task #6), simulação em tempo real, sincronização do fator e RBAC de lojista.
  - **Processamento de Faturas & Isolamento Multi-Tenant (6)**: Cômputo em runtime, isolamento multi-tenant (ADR-002), anti-fraude RN02 (chave duplicada 409), expiração 48h RN01 e histórico.
  - **Submissão de NFC-e, Saldos & Resgates no Banco (4)**: Submissão, anti-fraude em banco, saldo multi-tenant e resgate com débito.
  - **Validação Fiscal e Parsing SEFAZ SC/PR (5)**: Validação de URLs oficiais da SEFAZ, chave de 44 dígitos e extração de HTML.
  - **Documentação OpenAPI & Swagger UI (1)**: Validação de endpoints e renderização da UI.

---

## 🚀 Como Fazer o Projeto Funcionar (Passo a Passo)

### 📋 Pré-requisitos

- **Node.js**: Versão 20+ (recomendada LTS) ou v22+.
- **npm**: Versão 9+.
- **Git** instalado.

---

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/vitto2099/CashMe.git
cd CashMe
```

---

### 2️⃣ Configurar o Arquivo de Ambiente (`.env`)

O projeto necessita de um arquivo `.env` na raiz com a chave secreta da aplicação (`APP_KEY`):

```bash
# Copia o exemplo
cp .env.example .env
```

Verifique se a variável `APP_KEY` está preenchida no arquivo `.env` (ex: chave base64 de 32 bytes gerada).

---

### 3️⃣ Instalar as Dependências

Instale todas as dependências do ecossistema:

```bash
npm install
```

---

### 4️⃣ Executar as Migrations do Banco de Dados (SQLite)

Gere a estrutura de tabelas relacionais do banco local:

```bash
npm run db:migrate
```

---

### 5️⃣ Executar o Projeto Completo

Inicie o Backend e o Frontend Web simultaneamente com o script integrado:

```bash
npm run dev
```

Pronto! Os serviços estarão disponíveis em:

- 🌐 **Frontend Web:** [http://localhost:5173](http://localhost:5173)
- 🔧 **Backend API:** [http://localhost:3333](http://localhost:3333)
- 📚 **Swagger UI (Documentação da API):** [http://localhost:3333/docs](http://localhost:3333/docs)

Logs de ambos os serviços serão exibidos no mesmo terminal (`[API]` em ciano e `[FRONT]` em verde).

---

### 🧪 6️⃣ Como Rodar os Testes Automatizados

Para rodar a suíte completa de testes funcionais no backend:

```bash
npm test
```

---

### 📱 7️⃣ Como Rodar o Aplicativo Mobile (Expo)

Para executar o app mobile com leitor nativo de QR Code e WebView de Captcha:

```bash
cd mobile
npm install
npm run start
```

- Pressione `a` para abrir no Android Emulator.
- Pressione `i` para abrir no simulador iOS.
- Pressione `w` para rodar na Web.
- Ou escaneie o QR Code no terminal com o aplicativo **Expo Go** no seu celular físico.

---

## 🛠️ Tabela de Scripts Disponíveis

| Comando              | Descrição                                                 |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Inicia o Backend Adonis e o Frontend Vite simultaneamente |
| `npm run dev:server` | Inicia apenas a API backend (`node ace serve --hmr`)      |
| `npm run dev:client` | Inicia apenas o frontend web (`vite`)                     |
| `npm run test`       | Executa todos os 56 testes automatizados com Japa         |
| `npm run db:migrate` | Executa as migrations do banco de dados SQLite            |
| `npm run build`      | Compila o backend e o frontend para produção              |
| `npm run typecheck`  | Validação de tipos TypeScript ponta a ponta               |

---

## 👥 Equipe & Contribuições

Este projeto é fruto do trabalho colaborativo de toda a equipe:

- 👤 **Hugo Batista ([@hugobatista27](https://github.com/hugobatista27))**: Autor dos requisitos e tarefas originais (#1 a #9), autor dos ADRs (ADR-001 e ADR-002), desenvolvedor da API original ([`cash-me-api`](https://github.com/hugobatista27/cash-me-api)) com o motor `PointsEngineService`, `CustomerInvoicesController`, controllers de pontos e regras de fidelidade, migrations de faturas/pontos/regras/endereços, protótipos de tela para lojistas (`example/establishment/`) e criador da prova de conceito de scraping fiscal de NFC-e ([`web-scrap-app`](https://github.com/hugobatista27/web-scrap-app)).
- 👤 **Stela Oliveira ([@stela-oliveira](https://github.com/stela-oliveira)) & Nayara**: Autoras em conjunto da arquitetura do sistema de pontos e regras personalizáveis ([`docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md`](./docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md)), modelando o extrato como ledger imutável, versionamento de regras congeladas, ERD Mermaid completo com 12 entidades e templates JSON. Também responsáveis pela fundação do módulo de autenticação e contas na API ([`stela-oliveira/cash-me-api`](https://github.com/stela-oliveira/cash-me-api)), configurando `@adonisjs/auth`, tokens OAT, model `User` e testes funcionais de acesso.
- 👤 **Wesley**: Desenvolvimento e melhorias no frontend do módulo Consumidor (telas de Home, Lojas, Ofertas, Carteira e visualização de QR Code).
- 👤 **João Pedro**: Desenvolvimento e melhorias no frontend do módulo Lojista (telas de Dashboard com gráficos Recharts de faturamento, Gestão de Clientes fidelizados, Vitrine de Ofertas e Configurações).
- 👤 **João**: Telas de gestão de campanhas promocionais, telas de configuração de regras de pontuação (R$ para Pontos), conversão em descontos e componentes compartilhados de UI (Design System).
- 👤 **Vitor Camargo ([@vitto2099](https://github.com/vitto2099))**: Responsável pela integração geral dos módulos (Backend, Frontend e Mobile), organização do repositório, execução e garantia da suíte de 56 testes automatizados no Japa (100% aprovados) e consolidação da documentação técnica e guias de uso.

> 📖 Para conferir o quadro comparativo completo e a divisão detalhada de commits, arquivos e responsabilidades, consulte **[docs/CONTRIBUICOES.md](./docs/CONTRIBUICOES.md)** e **[docs/ATTRIBUTIONS.md](./docs/ATTRIBUTIONS.md)**.

---

## 📚 Documentação Técnica & Guias

Toda a documentação técnica foi organizada no diretório [`docs/`](./docs/README.md):

- 📚 **[Central de Documentação (Índice Geral)](./docs/README.md)** — Mapa completo de todos os documentos do projeto.
- ⚛️ **[Guia do Frontend (React + Vite)](./docs/guides/FRONTEND.md)** — Detalhamento das 21 telas, componentes e serviços web.
- 🔧 **[Guia do Backend (AdonisJS v7)](./docs/guides/BACKEND.md)** — Documentação de endpoints REST, modelos de dados e regras de negócio.
- 👥 **[Matriz de Contribuições & Atribuições](./docs/CONTRIBUICOES.md)** — Detalhamento técnico por desenvolvedor.
- 📋 **[Planejamento do Consumidor](./docs/product/PLANEJAMENTO-CONSUMIDOR.md)** — Backlog completo de épicos do módulo consumidor.
- 🏛️ **[Modelagem do Banco de Dados](./docs/architecture/MODELAGEM-BANCO-DE-DADOS.md)** — Esquema conceitual e relacional das tabelas.
- ⚖️ **[Decisões de Arquitetura (ADRs)](./docs/adr/)** — ADR-001 (Scraping Event-Driven) e ADR-002 (Multi-Tenant).
