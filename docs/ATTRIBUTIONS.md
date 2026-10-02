# 📜 Atribuições de Código & Licenças — Cash Me

Consulte o documento completo com o histórico detalhado e quadro comparativo em **[docs/CONTRIBUICOES.md](./CONTRIBUICOES.md)**.

## 👥 Contribuidores do Projeto

- **Hugo Batista ([@hugobatista27](https://github.com/hugobatista27))**: Arquiteto dos requisitos e tarefas originais (#1 a #9), autor dos ADRs (ADR-001 e ADR-002), desenvolvedor da API original (`hugobatista27/cash-me-api`) com o motor `PointsEngineService`, `CustomerInvoicesController`, controllers de pontos e regras, migrations originais de faturas/pontos/regras/endereços, protótipos de interface para lojistas (`example/establishment/`) e criador da prova de conceito de scraping fiscal de NFC-e (`hugobatista27/web-scrap-app`).
- **Stela Oliveira ([@stela-oliveira](https://github.com/stela-oliveira)) & Nayara**: Co-autoras da arquitetura do sistema de pontos e regras customizáveis (`docs/architecture/SISTEMA-DE-PONTOS-E-REGRAS.md`), concebendo o modelo de extrato como razão imutável (ledger), versionamento de regras congeladas por transação, ERD Mermaid completo com 12 entidades, modelagem de lotes de expiração FIFO e templates em JSON. Também responsáveis pela fundação do módulo de autenticação e contas na API (`stela-oliveira/cash-me-api`), incluindo `@adonisjs/auth`, tokens OAT Bearer, model `User` e suíte de testes de auth.
- **Wesley**: Desenvolvimento e melhorias no frontend do módulo Consumidor (telas de Home, catálogo de Lojas parceiras, Ofertas, Carteira digital e visualização de QR Code).
- **João Pedro**: Desenvolvimento e melhorias no frontend do módulo Lojista/Comerciante (Dashboard com métricas e gráficos Recharts de faturamento, Gestão de Clientes fidelizados, Vitrine de Ofertas e Configurações).
- **João**: Criação de fluxos de campanhas promocionais, telas de configuração de regras de pontuação (R$ para Pontos), conversão em descontos e componentes compartilhados de UI (Design System).
- **Vitor Camargo ([@vitto2099](https://github.com/vitto2099))**: Responsável pela integração geral dos módulos (Backend, Frontend e Mobile), organização e padronização da estrutura do projeto, execução e validação da suíte de 56 testes automatizados no Japa (100% de sucesso) e consolidação da documentação técnica e guias de execução.

## 📦 Bibliotecas e Recursos Externos

- **[shadcn/ui](https://ui.shadcn.com/)**: Componentes visuais sob licença MIT.
- **[Lucide Icons](https://lucide.dev)**: Pacote de ícones sob licença ISC.
- **[Tailwind CSS](https://tailwindcss.com)**: Framework CSS sob licença MIT.
- **[Unsplash](https://unsplash.com)**: Fotografias utilizadas sob licença Unsplash.
