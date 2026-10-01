# 📱 [CM-19] Planejamento do Aplicativo do Consumidor — Backlog de Épicos

Este documento registra os épicos e o backlog de telas e funcionalidades futuras do aplicativo do consumidor na plataforma **Cash Me**.

---

## 📌 Diretrizes de Escopo & Critérios de Aceite

> [!IMPORTANT]
> **Critérios de Isolamento do Escopo:**
>
> 1. **Independência do MVP:** O escopo do consumidor está completamente isolado e não bloqueia nem compete com o desenvolvimento do MVP do Comerciante.
> 2. **Status de Backlog:** Todas as tarefas e épicos listados abaixo estão com status **`Backlog (Post-MVP)`**, sem prioridade de execução imediata.
> 3. **Gatilho de Início:** O desenvolvimento deste módulo só será iniciado após a validação e estabilização do MVP do Comerciante.

---

## 📦 Mapeamento de Épicos & Histórias de Usuário

### 🏷️ [EP01] Autenticação & Acesso

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Permitir que o consumidor realize login seguro e recupere o acesso à sua conta.
- **Itens executáveis:**
  - [ ] Tela de login via número de telefone / e-mail.
  - [ ] Autenticação por código OTP (SMS / WhatsApp).
  - [ ] Fluxo de recuperação e redefinição de credenciais.
  - [ ] Sessão persistente com armazenamento seguro de token JWT.

---

### 🏷️ [EP02] Cadastro & Onboarding

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Fluxo de entrada para novos usuários com coleta de dados essenciais e concessão de bônus de boas-vindas.
- **Itens executáveis:**
  - [ ] Formulário de cadastro simplificado (Nome, CPF/Telefone, Data de Nascimento).
  - [ ] Seleção de categorias de interesse e permissões de notificação/geolocalização.
  - [ ] Crédito automático de pontos bônus de boas-vindas.
  - [ ] Tutorial interativo (onboarding) demonstrando como pontuar e resgatar.

---

### 🏷️ [EP03] Home & Feed Principal

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Visão inicial centralizada com resumo de saldo, campanhas ativas e atalhos de navegação.
- **Itens executáveis:**
  - [ ] Card de saldo consolidado de pontos do usuário.
  - [ ] Carrossel de banners com ofertas e campanhas promocionais em destaque.
  - [ ] Atalhos rápidos: Ler QR Code, Ver Lojas, Catálogo de Ofertas.
  - [ ] Seção de lojas recentes onde o usuário acumulou pontos.

---

### 🏷️ [EP04] Categorias & Descoberta

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Segmentação dos estabelecimentos parceiros por nicho de mercado para facilitar a busca.
- **Itens executáveis:**
  - [ ] Grade/lista de categorias (Alimentação, Supermercados, Farmácias, Moda, Pet Shop, etc.).
  - [ ] Filtro por categoria com contagem de parceiros cadastrados.
  - [ ] Destaques de estabelecimentos por nicho com melhores taxas de pontuação.

---

### 🏷️ [EP05] Lojas Parceiras

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Catálogo completo de lojas locais credenciadas na rede Cash Me.
- **Itens executáveis:**
  - [ ] Lista de lojas com busca por texto (nome do estabelecimento, bairro ou produto).
  - [ ] Ordenação por proximidade geográfica (distância em km) e avaliação.
  - [ ] Exibição rápida da regra de pontuação no card da loja (ex: _1 pt a cada R$ 1,00_).

---

### 🏷️ [EP06] Detalhes da Loja

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Tela completa do estabelecimento parceiro com todas as informações e regras locais.
- **Itens executáveis:**
  - [ ] Cabeçalho com logo, fotos, endereço, horário de funcionamento e contato.
  - [ ] Exibição detalhada da regra de conversão de compras em pontos.
  - [ ] Lista de vouchers e descontos exclusivos daquele estabelecimento.
  - [ ] Saldo atual de pontos que o consumidor possui exclusivamente nessa loja.

---

### 🏷️ [EP07] Vitrine de Ofertas & Detalhes

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Catálogo de cupons, descontos e recompensas disponíveis para troca por pontos.
- **Itens executáveis:**
  - [ ] Vitrine geral de ofertas de toda a rede e filtro por loja.
  - [ ] Tela de detalhe da oferta com imagem, descrição, validade e regras de uso.
  - [ ] Indicador visual se o saldo do usuário é suficiente para o resgate.
  - [ ] Botão de confirmação de resgate com modal de termos.

---

### 🏷️ [EP08] Carteira Digital (Wallet)

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Painel de controle financeiro dos pontos do usuário.
- **Itens executáveis:**
  - [ ] Visão geral dos pontos acumulados na rede.
  - [ ] Aba "Por Loja": desdobramento do saldo de pontos por estabelecimento parceiro.
  - [ ] Alertas de pontos próximos do vencimento.

---

### 🏷️ [EP09] Extrato & Histórico de Transações

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Registro cronológico e auditável de todas as movimentações de pontos.
- **Itens executáveis:**
  - [ ] Listagem de lançamentos com diferenciação visual entre Crédito (+pts) e Débito (-pts).
  - [ ] Filtros por período (últimos 30 dias, 3 meses, ano) e por tipo de transação.
  - [ ] Detalhe do comprovante da transação (data, hora, operador/loja e valor da compra associada).

---

### 🏷️ [EP10] QR Code de Identificação

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Mecanismo de identificação ágil e seguro do consumidor no momento do pagamento.
- **Itens executáveis:**
  - [ ] Geração dinâmica de QR Code individual na tela do smartphone.
  - [ ] Opção de código numérico alternativo digitável (para casos de falha de leitura).
  - [ ] Renovação periódica de token de segurança do QR Code para prevenção de fraudes.

---

### 🏷️ [EP11] Motor de Acúmulo de Pontos

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Processamento de pontuação gerada a partir de compras no caixa do comerciante.
- **Itens executáveis:**
  - [ ] Confirmação de leitura do QR Code pelo operador de caixa do comerciante.
  - [ ] Cálculo automático de pontos de acordo com o valor da compra e a regra ativa da loja.
  - [ ] Notificação instantânea (push/toast) no celular do consumidor confirmando os novos pontos.

---

### 🏷️ [EP12] Motor de Resgate de Benefícios

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Fluxo de débito de pontos para obtenção de descontos no ato da compra.
- **Itens executáveis:**
  - [ ] Seleção da oferta/desconto e débito dos pontos da carteira do cliente.
  - [ ] Geração de voucher/token de resgate temporário com validação no caixa.
  - [ ] Queima e baixa automática do voucher no sistema do comerciante após a aplicação do desconto.

---

### 🏷️ [EP13] Perfil & Preferências

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Gestão dos dados pessoais e configurações de privacidade do usuário.
- **Itens executáveis:**
  - [ ] Edição de dados cadastrais (nome, telefone, foto de perfil).
  - [ ] Central de segurança (alteração de PIN/senha e dispositivos conectados).
  - [ ] Termos de Uso, Política de Privacidade e conformidade LGPD.
  - [ ] Canal de Ajuda e Suporte ao Consumidor (FAQ e chat).

---

### 🏷️ [EP14] Central de Notificações

- **Status:** `Backlog` | **Prioridade:** `Post-MVP`
- **Descrição:** Comunicação direta e relevante para retenção e engajamento do consumidor.
- **Itens executáveis:**
  - [ ] Notificações push de transações em tempo real (pontos recebidos e resgatados).
  - [ ] Alertas de campanhas sazonais e bônus em lojas favoritas.
  - [ ] Lembrete de ofertas salvas e pontos expirando.
  - [ ] Tela de histórico de notificações recebidas com marcação de lidas.
