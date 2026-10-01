# 📚 Central de Documentação — Cash Me

Bem-vindo à documentação técnica e de produto do ecossistema **Cash Me**. Aqui você encontra as diretrizes de arquitetura, guias de implementação, decisões de engenharia (ADRs), especificações de regras de negócio e backlog.

---

## 🗂️ Estrutura da Documentação

### 1. 📖 Guias Técnicos (`docs/guides/`)

- [**Guia do Backend (AdonisJS v7)**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/guides/BACKEND.md) — Documentação completa da API RESTful, autenticação OAT, ciclo de vida de requisições, endpoints Swagger e orquestração de banco de dados.
- [**Guia do Frontend Web (React + Vite)**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/guides/FRONTEND.md) — Catálogo das 21 telas, arquitetura de componentes, contextos (`AuthContext` e `AppContext`), design system e integração de serviços.

---

### 2. 🏛️ Arquitetura & Banco de Dados (`docs/architecture/`)

- [**Arquitetura do Sistema**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/architecture/ARCHITECTURE.md) — Visão geral da arquitetura de software, camadas e fluxos.
- [**Modelagem de Banco de Dados**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/architecture/MODELAGEM-BANCO-DE-DADOS.md) — Dicionário de tabelas, tipos de dados e relacionamentos.
- [**Estrutura de Dados do Comércio**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/architecture/ESTRUTURA-DADOS-COMERCIO.md) — Especificação dos dados de estabelecimentos, endereços e identificadores fiscais.
- [**Sistema de Pontos e Regras**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md) — Especificação do Ledger Imutável, versionamento de regras de pontos e diagrama ERD.

---

### 3. ⚖️ Decisões de Arquitetura — ADRs (`docs/adr/`)

- [**ADR-001: Scraping Assíncrono Event-Driven**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/adr/ADR-001-scraping-assincrono-event-driven.md) — Justificativa técnica e desenho do pipeline assíncrono de consulta fiscal na SEFAZ.
- [**ADR-002: Isolamento Multi-Tenant Lógico**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/adr/ADR-002-isolamento-multi-tenant-logico.md) — Modelo de isolamento lógico de carteiras e saldos de fidelidade por estabelecimento comercial.

---

### 4. 📦 Produto & Regras de Negócio (`docs/product/`)

- [**Regras de Negócio do Sistema**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/product/REGRAS-DE-NEGOCIO.md) — Regras RN01 a RN07 (janela fiscal de 48h, anti-fraude, cálculo de pontos, isolamento geográfico SC/PR).
- [**Planejamento do Consumidor**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/product/PLANEJAMENTO-CONSUMIDOR.md) — Backlog de 14 épicos com critérios de aceite para o módulo consumidor.

---

### 5. 📋 Backlog de Tarefas Originais (`docs/tasks/`)

- [Task 01 — Cadastro e Aprovação de Lojistas](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/01-cadastro-e-aprovacao-de-lojistas-onboarding.md)
- [Task 02 — Cadastro Global de Consumidor](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/02-cadastro-global-de-consumidor.md)
- [Task 03 — Submissão de QR Code e Validação de Entrada](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/03-submissao-de-qr-code-e-validacao-de-entrada.md)
- [Task 04 — Worker Assíncrono de Scraping na SEFAZ](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/04-worker-assincrono-de-scraping-na-sefaz.md)
- [Task 05 — Motor de Cômputo de Pontos e Multi-Tenant](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/05-motor-de-computo-de-pontos-e-isolamento-multi-tenant.md)
- [Task 06 — Configuração Customizável de Regras de Conversão](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/06-configuracao-customizavel-de-regras-de-conversao.md)
- [Task 07 — Proteção de Inadimplência e Manutenção do Saldo](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/07-protecao-de-inadimplencia-e-manutencao-do-saldo.md)
- [Task 08 — Dashboard Lojista com Filtro de Privacidade](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/08-dashboard-lojista-com-filtro-de-privacidade.md)
- [Task 09 — Notificações Push de Conclusão FCM](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/tasks/09-notificacoes-push-de-conclusao-fcm.md)

---

### 6. 👥 Equipe & Governança

- [**Matriz de Contribuições & Atribuições**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/CONTRIBUICOES.md) — Mapeamento detalhado dos módulos desenvolvidos por Vitor Camargo, Hugo Batista e Stela Oliveira.
- [**Attributions & Licenses**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/ATTRIBUTIONS.md) — Créditos de autoria e licenças de software.
- [**Glossário de Domínio**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/glossary/GLOSSARIO-DOMINIO.md) — Terminologia oficial do projeto.
- [**Relatório Exploratório**](file:///home/vitto2099/Área de trabalho/dev/CashMe/docs/RELATORIO_EXPLORATORIO.md) — Diagnóstico técnico das integrações.
