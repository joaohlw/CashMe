# ⚛️ Cash Me — Frontend (React 18 + Vite + Tailwind CSS v4)

> Aplicativo web mobile-first de fidelidade e cashback, conectando consumidores a estabelecimentos parceiros através de uma interface intuitiva, moderna e responsiva.  
> **Squad Frontend:** Desenvolvido colaborativamente por **Wesley** (Consumidor), **João Pedro** (Lojista), **João** (Campanhas, Regras e Design System) e **Vitor Camargo** (Integração e Testes).

---

## 🛠️ Stack Tecnológica

| Tecnologia       | Versão    | Função                                                          |
| ---------------- | --------- | --------------------------------------------------------------- |
| **React**        | 18.3.1    | Biblioteca de interface declarativa                             |
| **Vite**         | 6.3.5     | Bundler de alta performance e dev server                        |
| **TypeScript**   | 5.x / 6.x | Tipagem estática e segurança de código                          |
| **Tailwind CSS** | v4        | Estilização utilitária de última geração                        |
| **Radix UI**     | —         | Primitivos acessíveis de interface (Dialog, Tabs, Accordion...) |
| **Recharts**     | 2.15      | Visualização de métricas e gráficos de faturamento              |
| **Lucide React** | 0.487     | Conjunto consistente de ícones                                  |
| **Motion**       | 12.23     | Micro-interações e animações                                    |
| **Sonner**       | 2.0       | Sistema de notificações toast                                   |

---

## 📁 Estrutura de Pastas do Frontend (`src/`)

```
src/
├── app/
│   ├── App.tsx                     # Orquestrador do frame simulado de celular e alternância de modos
│   └── components/ui/              # Primitivos visuais do Design System
│
├── constants/
│   └── theme.ts                    # Paleta de cores oficial (G: verde, P: roxo, GOLD, BG...)
│
├── context/
│   ├── AuthContext.tsx             # Estado global de autenticação com a API AdonisJS
│   └── AppContext.tsx              # Estado de pontos em memória e simulação de resgates
│
├── services/                       # Camada de integração HTTP com o Backend
│   ├── api.ts                      # Cliente fetch nativo com injeção automática de Bearer Token
│   ├── authService.ts              # Métodos de login, signup, perfil e logout na API
│   ├── storesService.ts            # Consulta de lojas parceiras credenciadas
│   ├── offersService.ts            # Cupons de desconto e vantagens
│   ├── transactionsService.ts      # Extrato de movimentação de pontos
│   ├── customersService.ts         # Base de clientes cadastrados (visão lojista)
│   ├── campaignsService.ts         # Campanhas promocionais do lojista
│   └── index.ts                    # Exportações unificadas
│
├── types/                          # Contratos e Tipagens TypeScript
│   ├── consumer.ts                 # Interfaces: Loja, Oferta, Transacao, Categoria
│   ├── merchant.ts                 # Interfaces: Cliente, OfertaComerciante, Campanha
│   └── navigation.ts               # Identificadores de telas e modos de entrada
│
├── features/                       # Módulos por Domínio de Negócio
│   ├── landing/                    # Tela inicial de boas-vindas + Modal de Login/Cadastro na API
│   │   └── screens/LandingScreen.tsx
│   │
│   ├── consumer/                   # Módulo do Consumidor (9 telas)
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx          # Feed principal, saldo de pontos e destaques
│   │   │   ├── CategoriesScreen.tsx    # Categorias de estabelecimentos
│   │   │   ├── StoresScreen.tsx        # Listagem de lojas parceiras
│   │   │   ├── StoreDetailScreen.tsx   # Detalhes, regras e ofertas da loja
│   │   │   ├── OffersScreen.tsx        # Cupons e recompensas disponíveis
│   │   │   ├── OfferDetailScreen.tsx   # Detalhe do cupom com botão de resgate
│   │   │   ├── WalletScreen.tsx        # Carteira digital com extrato de pontos
│   │   │   ├── QRCodeScreen.tsx        # QR Code pessoal para identificação no balcão
│   │   │   └── ProfileScreen.tsx       # Perfil real do usuário autenticado e Logout
│   │   └── ConsumerApp.tsx         # Navegação inferior e orquestrador do Consumidor
│   │
│   └── merchant/                   # Módulo do Comerciante (11 telas)
│       ├── screens/
│       │   ├── DashboardScreen.tsx     # Gráficos de vendas, faturamento e novos clientes
│       │   ├── CampaignsScreen.tsx     # Gestão de campanhas de bônus ativas
│       │   ├── NewCampaignScreen.tsx   # Criação de nova campanha
│       │   ├── ScoringRulesScreen.tsx  # Configuração da regra de pontos (R$ para Pontos)
│       │   ├── PointsConversionScreen.tsx # Conversão de pontos em desconto monetário
│       │   ├── QRStoreScreen.tsx       # QR Code da loja para leitura no caixa
│       │   ├── CustomersScreen.tsx     # Base de clientes fidelizados
│       │   ├── CustomerDetailScreen.tsx # Histórico de compras de um cliente específico
│       │   ├── VitrineScreen.tsx       # Gestão de recompensas ofertadas
│       │   ├── NewOfferScreen.tsx      # Cadastro de novas recompensas
│       │   └── SettingsScreen.tsx      # Configurações do estabelecimento comercial
│       └── MerchantApp.tsx         # Navegação inferior e orquestrador do Comerciante
│
└── styles/                         # Folhas de estilo globais e tokens Tailwind
    ├── globals.css · theme.css · fonts.css · index.css
```

---

## 📱 Modos e Fluxos de Navegação

O frontend possui um **orquestrador responsivo** (`App.tsx`) que em telas grandes renderiza um frame mobile de iPhone com Dynamic Island e barra de navegação, enquanto em dispositivos móveis ocupa 100% da tela.

### 1. Modo Landing (`LandingScreen`)

- Seleção direta de perfil: **Sou Consumidor** ou **Sou Comerciante**.
- Botão **"Entrar ou Criar Conta na API"** que abre um modal com abas de **Login** e **Cadastro**, comunicando-se diretamente com o backend AdonisJS.
- Quando o usuário está autenticado, exibe um badge verde com o nome do usuário e opção de deslogar.

### 2. Modo Consumidor (`ConsumerApp`)

- **Home:** Exibe saldo dinâmico de pontos, atalhos rápidos e carrossel de ofertas em destaque.
- **Lojas:** Lista estabelecimentos parceiros com filtros por categoria e busca por proximidade.
- **Carteira:** Visualização do saldo acumulado e extrato transacional detalhado.
- **QR Code:** Gera o código de barras/QR bidimensional para ser apresentado no balcão.
- **Perfil:** Exibe os dados retornados pela rota `/account/profile` da API (`fullName`, `email`, iniciais no avatar) e botão funcional de logout.

### 3. Modo Comerciante (`MerchantApp`)

- **Dashboard:** Métricas chave de desempenho (Faturamento gerado, Pontos emitidos, Clientes ativos) acompanhado de gráfico interativo via Recharts.
- **Regras de Pontuação:** Interface onde o comerciante define o fator de conversão de sua loja (ex: R$ 1,00 = 1 Ponto).
- **Clientes:** Lista dos consumidores fidelizados com histórico individual de interações.
- **Vitrine:** Ativação e desativação em tempo real das recompensas disponíveis para resgate.

---

## 🔄 Proxy Reverso de Desenvolvimento

No arquivo `vite.config.ts`, está configurado o proxy reverso para desenvolvimento:

```ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3333',
      changeOrigin: true,
    },
  },
}
```

Qualquer requisição feita no frontend para `/api/v1/...` é automaticamente despachada para a porta `3333` do AdonisJS, dispensando configurações complexas de CORS.

---

## 🚀 Como Executar o Frontend

### Modo Integrado (Recomendado)

Para rodar junto com o backend no mesmo terminal:

```bash
npm run dev
```

### Apenas o Frontend

```bash
npm run dev:client
```

Acesse: **http://localhost:5173**

### Build de Produção

```bash
npm run build:client
```

Os arquivos otimizados e minificados serão gerados na pasta `dist/`.
