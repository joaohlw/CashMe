# 📊 Relatório de Análise Exploratória — CashMe Front

> Gerado em: 01/09/2026 · Modelo: Claude Sonnet 4.6 (Thinking)

---

## 1. Visão Geral do Projeto

**Cash Me** é uma plataforma de fidelidade e cashback para comércios locais. O produto atual é um **protótipo de alta fidelidade** — um app mobile simulado rodando no browser, com frame de smartphone (390×844px) e duas visões de usuário:

| Visão              | Cor de marca    | Função                                                     |
| ------------------ | --------------- | ---------------------------------------------------------- |
| 🟢 **Consumidor**  | Verde `#008D4C` | Acumular pontos, descobrir lojas/ofertas, carteira digital |
| 🟣 **Comerciante** | Roxo `#6F35B5`  | Dashboard, campanhas, clientes, vitrine de ofertas         |

O projeto **não consome nenhuma API real** — toda a data layer é composta por mocks estáticos.

---

## 2. Stack Tecnológica

| Categoria           | Tecnologia                       | Versão            |
| ------------------- | -------------------------------- | ----------------- |
| **Runtime**         | React                            | 18.3.1 (peer)     |
| **Build Tool**      | Vite                             | 6.3.5             |
| **Linguagem**       | TypeScript                       | via Vite plugin   |
| **Estilização**     | Tailwind CSS v4                  | 4.1.12            |
| **Design System**   | Shadcn UI / Radix UI             | múltiplos pacotes |
| **Gráficos**        | Recharts                         | 2.15.2            |
| **Ícones**          | lucide-react                     | 0.487.0           |
| **Animações**       | motion (Framer Motion v12)       | 12.23.24          |
| **Feedback visual** | sonner (toasts), canvas-confetti | —                 |
| **Package Manager** | pnpm (workspace)                 | —                 |

> [!NOTE]
> O `package.json` lista React como `peerDependency optional`, o que é incomum. Isso provavelmente é herança da configuração padrão do Figma Make — a dependência real deve ser adicionada como `dependency` direto quando o projeto for para produção.

---

## 3. Arquitetura e Estrutura de Pastas

```
src/                          (111 arquivos · 269 KB total)
├── app/
│   ├── App.tsx               # Orquestrador do frame mobile (127 linhas)
│   └── components/
│       ├── figma/            # ImageWithFallback (utilitário de assets)
│       └── ui/               # 48 componentes Shadcn/Radix (design system)
│
├── features/                 # Arquitetura orientada a domínios
│   ├── landing/
│   │   └── screens/LandingScreen.tsx
│   ├── consumer/
│   │   ├── ConsumerApp.tsx   # Orquestrador: 5 tabs, 9 telas
│   │   └── screens/          # 9 telas (HomeScreen → ProfileScreen)
│   └── merchant/
│       ├── MerchantApp.tsx   # Orquestrador: 5 tabs, 11 telas
│       └── screens/          # 11 telas (DashboardScreen → SettingsScreen)
│
├── components/
│   └── common/               # 21 componentes reutilizáveis
│
├── types/                    # Contratos TypeScript
│   ├── consumer.ts           # Loja, Oferta, Transacao, ItemCategoria
│   ├── merchant.ts           # Cliente, OfertaComerciante, Campanha, PontoGrafico
│   └── navigation.ts         # AppMode, ConsumerScreen, MerchantScreen
│
├── data/
│   └── mocks/                # 7 arquivos de dados estáticos
│
├── constants/
│   └── theme.ts              # Paleta de cores da marca (G, P, GOLD, etc.)
│
└── styles/
    ├── theme.css             # CSS vars + tokens do design system (182 linhas)
    ├── globals.css           # Reset global
    ├── fonts.css             # Tipografia
    ├── tailwind.css          # Diretivas Tailwind v4
    └── index.css             # Entry point de estilos
```

---

## 4. Módulos de Negócio

### 4.1 Módulo do Consumidor (9 telas)

| Tela              | Arquivo                 | Tamanho    | Descrição                                                 |
| ----------------- | ----------------------- | ---------- | --------------------------------------------------------- |
| Home              | `HomeScreen.tsx`        | 112 linhas | Saldo de pontos, carrossel de ofertas, categorias rápidas |
| Categorias        | `CategoriesScreen.tsx`  | 55 linhas  | Grade de categorias de estabelecimentos                   |
| Lojas             | `StoresScreen.tsx`      | 102 linhas | Lista de lojas parceiras com busca                        |
| Detalhe da Loja   | `StoreDetailScreen.tsx` | 81 linhas  | Info da loja, regras de pontuação                         |
| Ofertas           | `OffersScreen.tsx`      | —          | Catálogo de cupons                                        |
| Detalhe da Oferta | `OfferDetailScreen.tsx` | —          | Detalhes do cupom                                         |
| Carteira          | `WalletScreen.tsx`      | 89 linhas  | Saldo total, extrato de transações                        |
| QR Code           | `QRCodeScreen.tsx`      | 74 linhas  | QR Code SVG do consumidor para scan no caixa              |
| Perfil            | `ProfileScreen.tsx`     | —          | Dados do usuário                                          |

**Navegação:** `useState` simples com um `Set` de telas com bottom nav visível. A função `back()` retorna sempre para a tab ativa corrente.

### 4.2 Módulo do Comerciante (11 telas)

| Tela                | Arquivo                      | Tamanho   | Descrição                                                     |
| ------------------- | ---------------------------- | --------- | ------------------------------------------------------------- |
| Dashboard           | `DashboardScreen.tsx`        | 89 linhas | KPIs do dia + gráfico de área (Recharts) + feed de atividades |
| Campanhas           | `CampaignsScreen.tsx`        | —         | Listagem de campanhas ativas                                  |
| Nova Campanha       | `NewCampaignScreen.tsx`      | 77 linhas | Formulário de criação de campanha                             |
| Regras de Pontuação | `ScoringRulesScreen.tsx`     | —         | Configuração da taxa de conversão R$→pts                      |
| Conversão de Pontos | `PointsConversionScreen.tsx` | —         | Configuração de resgate pts→desconto                          |
| QR da Loja          | `QRStoreScreen.tsx`          | —         | QR Code do estabelecimento para o balcão                      |
| Clientes            | `CustomersScreen.tsx`        | —         | Base de clientes fidelizados                                  |
| Detalhe do Cliente  | `CustomerDetailScreen.tsx`   | —         | Histórico de compras do cliente                               |
| Vitrine             | `VitrineScreen.tsx`          | —         | Gestão de ofertas cadastradas                                 |
| Nova Oferta         | `NewOfferScreen.tsx`         | 66 linhas | Formulário de criação de oferta                               |
| Configurações       | `SettingsScreen.tsx`         | 62 linhas | Configurações gerais da loja                                  |

**Navegação:** Mesma estratégia de `useState` com lógica adicional para mapear tabs "qr" → "qr-store" e "more" → "vitrine".

---

## 5. Design System & Paleta de Cores

O projeto possui **dois sistemas de tokens paralelos**:

```
theme.ts (JavaScript)          theme.css (CSS vars)
─────────────────────          ────────────────────
G  = "#008D4C"                 --primary: #008D4C
GD = "#006B3A"                 --secondary-foreground: #006B3A
P  = "#6F35B5"                 --accent-foreground: #6F35B5
GOLD = "#F5B800"               (sem equivalente CSS var)
ERR = "#D64545"                --destructive: #D64545
```

> [!WARNING]
> **Dualidade de tokens**: Os estilos inline usam as constantes JS (`G`, `P`) enquanto os componentes Shadcn usam as CSS vars (`--primary`, `--accent`). Isso cria dois sistemas paralelos que precisam ser mantidos sincronizados manualmente — risco de desincronização a longo prazo.

### Componentes Common (21 itens)

Os componentes estão **duplicados com aliases bilíngues**:

| Nome PT            | Nome EN      | Propósito                      |
| ------------------ | ------------ | ------------------------------ |
| BarraNavegacao     | BottomNav    | Tab bar inferior               |
| BarraStatus        | StatusBar    | Status bar do celular simulado |
| BotaoVoltar        | BackBtn      | Botão de retorno               |
| AvatarUsuario      | UserAvatar   | Avatar circular                |
| ChaveAlternadora   | SwitchToggle | Switch animado                 |
| ControleSegmentado | SegControl   | Tabs segmentadas               |
| QRCodeVetorial     | QRCodeSVG    | Renderizador SVG de QR         |
| IconeLoja          | StoreIcon    | Ícone com inicial da loja      |

---

## 6. Dados e Tipagem

### Mocks Disponíveis

| Arquivo             | Registros     | Tipo exportado    |
| ------------------- | ------------- | ----------------- |
| `stores.ts`         | 5 lojas       | `Store[]`         |
| `offers.ts`         | ~3 ofertas    | `Offer[]`         |
| `customers.ts`      | ~5 clientes   | `Customer[]`      |
| `history.ts`        | ~5 transações | `Transaction[]`   |
| `chartData.ts`      | ~7 pontos     | `ChartPoint[]`    |
| `merchantOffers.ts` | ~3 ofertas    | `MerchantOffer[]` |

### Tipagem TypeScript

A tipagem está bem organizada. Cada domínio tem suas interfaces com aliases bilíngues para compatibilidade:

```typescript
// consumer.ts
export interface Loja {
  id
  name
  cat
  loc
  rule
  pts
  color
  bg
}
export type Store = Loja // alias EN

// merchant.ts
export interface Cliente {
  id
  name
  pts
  last
  active
  purchases
}
export type Customer = Cliente // alias EN
```

> [!NOTE]
> Os modelos são enxutos mas **sem validação em runtime** — todos os campos aceitam tipos primitivos sem guardrails. Para produção, seria recomendado o uso de Zod ou similar para validação de schema.

---

## 7. Fluxo de Navegação

```
App.tsx (AppMode: landing | consumer | merchant)
│
├── [landing] → LandingScreen → onSelect(mode)
│
├── [consumer] → ConsumerApp
│   ├── Tab: home     → HomeScreen → go("offer-detail" | "categories" | "stores")
│   ├── Tab: stores   → StoresScreen → go("store-detail")
│   ├── Tab: wallet   → WalletScreen → go("qr-code") [sem back nav]
│   ├── Tab: offers   → OffersScreen → go("offer-detail")
│   └── Tab: profile  → ProfileScreen
│
└── [merchant] → MerchantApp
    ├── Tab: dashboard  → DashboardScreen → go("campaigns")
    ├── Tab: campaigns  → CampaignsScreen → go("new-campaign")
    ├── Tab: qr         → QRStoreScreen
    ├── Tab: customers  → CustomersScreen → go("customer-detail")
    └── Tab: more       → VitrineScreen → go("new-offer") | go("settings") | go("scoring-rules") | go("points-conversion")
```

> [!IMPORTANT]
> A navegação **não usa react-router** (que está instalado mas não utilizado). Todo o roteamento é feito via `useState` — sem histórico do browser, sem URLs diretas, sem possibilidade de deep-link ou compartilhamento de URL.

---

## 8. Componentes UI (Shadcn) — Inventário de Uso

**48 componentes** estão disponíveis em `src/app/components/ui/`, mas a maioria **não está sendo utilizada** nas telas atuais — as telas usam principalmente elementos HTML nativos com estilos inline.

| Status     | Componentes ativos estimados                                                         |
| ---------- | ------------------------------------------------------------------------------------ |
| ✅ Em uso  | `chart`, `button`, `input`, `select`, `tabs`, `dialog`, `avatar` (estimado)          |
| ❌ Ociosos | `sidebar`, `carousel`, `menubar`, `context-menu`, `command`, `navigation-menu`, etc. |

---

## 9. Análise de Qualidade de Código

### ✅ Pontos Positivos

- **Arquitetura feature-based** bem definida e documentada no README
- **Separação de domínios** clara: consumer / merchant / landing
- **Tipagem TypeScript** presente em todos os contratos de domínio
- **Constantes de tema** centralizadas em `theme.ts`
- **Mocks isolados** em `src/data/mocks/` (separados das views)
- **App.tsx enxuto** (~127 linhas) após a refatoração documentada
- **Documentação interna rica**: README detalhado, PLANO_DE_OTIMIZACAO.md, PLANEJAMENTO_CONSUMIDOR.md

### ⚠️ Pontos de Atenção

| Problema                                                                                                      | Severidade | Arquivo(s)                              |
| ------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| **Estilos inline excessivos** — 100% das telas usam `style={{}}` inline                                       | 🔴 Alta    | Todos os screens                        |
| **Componentes duplicados bilíngues** — mesmo componente com nome PT e EN                                      | 🟡 Média   | `src/components/common/`                |
| **react-router instalado mas não usado**                                                                      | 🟡 Média   | `package.json`                          |
| **Dados hardcoded nas telas** — algumas telas ainda definem dados localmente (ex: categories em HomeScreen)   | 🟡 Média   | `HomeScreen.tsx`, `DashboardScreen.tsx` |
| **Sem gerenciamento de estado global** — estados das telas são todos locais, sem persistência entre navegação | 🟡 Média   | Todas as features                       |
| **package.json com React como peerDependency optional**                                                       | 🟠 Baixa   | `package.json`                          |
| **48 componentes UI ociosos** no bundle (aumenta o tamanho desnecessariamente)                                | 🟠 Baixa   | `src/app/components/ui/`                |
| **Frame fixo 390×844px** — não responsivo para mobile real                                                    | 🟠 Baixa   | `App.tsx`                               |
| **Sem testes automatizados** — nenhum arquivo `.test.*` ou `.spec.*`                                          | 🔵 Info    | —                                       |
| **Sem camada de serviços** — sem `src/services/` para isolamento da API                                       | 🔵 Info    | —                                       |

---

## 10. Status do Plano de Otimização (PLANO_DE_OTIMIZACAO.md)

O plano define 5 fases. Avaliando o estado atual do código:

| Fase                                       | Status              | Observação                                                          |
| ------------------------------------------ | ------------------- | ------------------------------------------------------------------- |
| **Fase 1:** Extração de Tipos e Mocks      | ✅ **Concluída**    | `src/types/` e `src/data/mocks/` estão criados e populados          |
| **Fase 2:** Modularização de Telas         | ✅ **Concluída**    | Todas as telas estão em `features/*/screens/`. App.tsx < 133 linhas |
| **Fase 3:** Padronização Visual (Tailwind) | ❌ **Não iniciada** | 100% dos estilos ainda são inline. Componentes Shadcn subutilizados |
| **Fase 4:** Responsividade                 | ❌ **Não iniciada** | Frame fixo 390×844px mantido                                        |
| **Fase 5:** Estado Global & API            | ❌ **Não iniciada** | Sem Zustand/Context, sem `src/services/`                            |

---

## 11. Backlog de Épicos do Consumidor

O arquivo `PLANEJAMENTO_CONSUMIDOR.md` documenta **14 épicos** todos com status `Backlog (Post-MVP)`:

| Épico | Descrição                                  |
| ----- | ------------------------------------------ |
| EP01  | Autenticação & Acesso (OTP, JWT)           |
| EP02  | Cadastro & Onboarding                      |
| EP03  | Home & Feed Principal                      |
| EP04  | Categorias & Descoberta                    |
| EP05  | Lojas Parceiras (busca, geolocalização)    |
| EP06  | Detalhes da Loja                           |
| EP07  | Vitrine de Ofertas & Detalhes              |
| EP08  | Carteira Digital                           |
| EP09  | Extrato & Histórico de Transações          |
| EP10  | QR Code de Identificação (token renovável) |
| EP11  | Motor de Acúmulo de Pontos                 |
| EP12  | Motor de Resgate de Benefícios             |
| EP13  | Perfil & Preferências                      |
| EP14  | Central de Notificações                    |

> O desenvolvimento do módulo do Consumidor está bloqueado aguardando a **validação e estabilização do MVP do Comerciante**.

---

## 12. Recomendações de Próximos Passos

### 🔴 Prioridade Alta (antes de ir para produção)

1. **Executar Fase 3 do plano** — migrar estilos inline para classes Tailwind e usar componentes Shadcn nas telas
2. **Implementar react-router** — habilitar URLs diretas, histórico de navegação e deep links
3. **Corrigir React como dependency** — mover de `peerDependencies` para `dependencies` no `package.json`

### 🟡 Prioridade Média

4. **Resolver duplicação de componentes bilíngues** — consolidar em um único nome (preferencialmente PT ou EN, não ambos)
5. **Criar `src/services/`** — preparar a camada de API com `fetch`/`axios` + contratos de tipos
6. **Adicionar estado global** — Zustand ou Context API para sincronização entre as visões Consumer/Merchant
7. **Mover dados hardcoded das telas para mocks** — ex: `cats` em `HomeScreen.tsx`

### 🟠 Prioridade Baixa

8. **Responsividade** (Fase 4) — detectar viewport e renderizar em tela cheia no mobile
9. **Tree-shake os componentes UI ociosos** — remover os 30+ componentes Shadcn não usados do bundle
10. **Adicionar testes** — ao menos smoke tests com Vitest + Testing Library

---

## 13. Métricas do Projeto

| Métrica                                  | Valor                                               |
| ---------------------------------------- | --------------------------------------------------- |
| Total de arquivos `.tsx`/`.ts` em `src/` | **111 arquivos**                                    |
| Tamanho total do código-fonte            | **~269 KB**                                         |
| Maior arquivo de código de negócio       | `HomeScreen.tsx` (112 linhas)                       |
| Telas implementadas                      | **21 telas** (9 Consumer + 11 Merchant + 1 Landing) |
| Componentes comuns                       | **21 componentes**                                  |
| Componentes UI (Shadcn)                  | **48 componentes**                                  |
| Mocks de dados                           | **7 arquivos**                                      |
| Dependências totais                      | **~55 pacotes**                                     |
| App.tsx (ponto de entrada)               | **127 linhas** ✅                                   |

---

_Análise gerada com base em inspeção estática completa dos arquivos fonte._
