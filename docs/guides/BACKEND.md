# 🔧 Cash Me — Backend (API REST AdonisJS v7 + TypeScript)

> API RESTful robusta, desenvolvida em **AdonisJS v7** com **Lucid ORM**, banco de dados **SQLite** e validação com **VineJS**, projetada para atender ao ecossistema de fidelidade e processamento de notas fiscais (NFC-e).

---

## 🛠️ Stack Tecnológica

| Tecnologia                  | Versão | Função                                                     |
| --------------------------- | ------ | ---------------------------------------------------------- |
| **AdonisJS**                | v7.4   | Framework MVC Node.js moderno e opinativo                  |
| **TypeScript**              | ~6.0   | Tipagem estática ponta a ponta                             |
| **Lucid ORM**               | v22.4  | Mapeador objeto-relacional e gerenciador de migrations     |
| **SQLite / better-sqlite3** | v13.0  | Banco de dados local embutido de alta velocidade           |
| **VineJS**                  | v4.4   | Validador de esquemas de entrada de dados ultra-rápido     |
| **@adonisjs/auth**          | v10.1  | Autenticação baseada em Access Tokens (Bearer Token / OAT) |
| **Japa**                    | v5.3   | Framework oficial de testes automatizados                  |

---

## 📁 Estrutura de Pastas do Backend

```
cash-me/
├── app/
│   ├── controllers/
│   │   ├── access_tokens_controller.ts  # POST /auth/login e POST /account/logout
│   │   ├── new_account_controller.ts    # POST /auth/signup
│   │   └── profile_controller.ts        # GET /account/profile
│   ├── models/
│   │   └── user.ts                      # Model Lucid com integração de hash e tokens
│   ├── transformers/
│   │   └── user_transformer.ts         # Serializador de saída com campos seguros e iniciais
│   ├── validators/
│   │   └── user.ts                      # Validação de signup e login (VineJS)
│   └── middleware/                      # Middlewares de autenticação e autorização
│
├── config/                              # Configurações do framework
│   ├── app.ts · auth.ts · cors.ts · database.ts · hash.ts · session.ts · shield.ts
│
├── database/
│   ├── migrations/
│   │   ├── ..._create_users_table.ts           # Tabela de usuários
│   │   └── ..._create_access_tokens_table.ts   # Tabela de tokens de acesso
│   └── schema.ts                               # Schemas tipados gerados automaticamente
│
├── start/
│   ├── routes.ts                        # Definição dos endpoints REST
│   └── kernel.ts                        # Middlewares registrados no ciclo de vida HTTP
│
├── tests/
│   ├── bootstrap.ts                     # Configuração do runner Japa com plugins Adonis
│   └── functional/
│       └── auth.spec.ts                 # Testes funcionais automatizados da API
│
├── ace.js                               # CLI do AdonisJS (comandos make, migration, etc.)
├── adonisrc.ts                          # Manifesto de providers, preloads e hooks
└── .env                                 # Variáveis de ambiente da API
```

---

## 🔌 Documentação dos Endpoints REST

Base URL: `http://localhost:3333/api/v1`

### 1. Cadastro de Usuário (`POST /auth/signup`)

Cria um novo usuário na base de dados e gera imediatamente um token de acesso.

- **Corpo da Requisição (JSON):**

```json
{
  "fullName": "João Silva",
  "email": "joao.silva@exemplo.com",
  "password": "password123",
  "passwordConfirmation": "password123"
}
```

- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": {
    "user": {
      "id": 1,
      "fullName": "João Silva",
      "email": "joao.silva@exemplo.com",
      "initials": "JS",
      "createdAt": "2026-09-02T20:00:00.000Z",
      "updatedAt": "2026-09-02T20:00:00.000Z"
    },
    "token": "oat_eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. Login (`POST /auth/login`)

Valida as credenciais do usuário com hash seguro (Argon2/Scrypt) e emite um novo token.

- **Corpo da Requisição (JSON):**

```json
{
  "email": "joao.silva@exemplo.com",
  "password": "password123"
}
```

- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": {
    "user": {
      "id": 1,
      "fullName": "João Silva",
      "email": "joao.silva@exemplo.com",
      "initials": "JS"
    },
    "token": "oat_eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. Perfil do Usuário (`GET /account/profile`)

Rota autenticada que retorna os dados do usuário dono do token.

- **Headers:** `Authorization: Bearer <token>`
- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": {
    "id": 1,
    "fullName": "João Silva",
    "email": "joao.silva@exemplo.com",
    "initials": "JS",
    "createdAt": "2026-09-02T20:00:00.000Z",
    "updatedAt": "2026-09-02T20:00:00.000Z"
  }
}
```

---

### 4. Logout (`POST /account/logout`)

Invalida e revoga o token de acesso na tabela `auth_access_tokens`.

- **Headers:** `Authorization: Bearer <token>`
- **Resposta de Sucesso (`200 OK`):**

```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Submissão e Crédito de NFC-e (`POST /nfce/submit`)

Rota autenticada que valida, processa e credita pontos de uma NFC-e na carteira do consumidor (**RN01 a RN07**).

- **Headers:** `Authorization: Bearer <token>`
- **Corpo da Requisição (JSON):**

```json
{
  "accessKey": "42260912345678000199650010000554431000998811",
  "url": "https://sat.sef.sc.gov.br/nfce/consulta?p=...",
  "factor": 1.0
}
```

- **Resposta de Sucesso (`201 Created`):**

```json
{
  "data": {
    "nfce": {
      "id": 1,
      "chaveAcesso": "42260912345678000199650010000554431000998811",
      "uf": "SC",
      "valorTotal": 50,
      "pontosGerados": 50,
      "dataEmissao": "2026-10-01T22:00:00.000Z"
    },
    "establishment": {
      "id": 1,
      "razaoSocial": "Padaria Bella Vista Ltda",
      "nomeFantasia": "Padaria Bella Vista",
      "cnpj": "12345678000199",
      "fatorConversao": 1
    },
    "saldo": {
      "anterior": 0,
      "atual": 50,
      "totalAcumulado": 50
    },
    "transaction": {
      "id": 1,
      "tipo": "CREDITO",
      "pontos": 50,
      "descricao": "Crédito NFC-e: Padaria Bella Vista",
      "createdAt": "2026-10-01T22:00:00.000Z"
    }
  },
  "message": "NFC-e processada e pontos creditados com sucesso!"
}
```

---

### 6. Consulta de Saldo de Pontos (`GET /account/points/balance`)

Retorna o saldo consolidado do consumidor e o desdobramento por loja parceira.

- **Headers:** `Authorization: Bearer <token>`
- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": {
    "totalBalance": 150,
    "totalAccumulated": 200,
    "byEstablishment": [
      {
        "establishmentId": 1,
        "establishmentName": "Padaria Bella Vista",
        "saldoAtual": 150,
        "totalAcumulado": 200
      }
    ]
  }
}
```

---

### 7. Extrato de Transações (`GET /account/points/transactions`)

Retorna o histórico de créditos e resgates do consumidor.

- **Headers:** `Authorization: Bearer <token>`
- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": [
    {
      "id": 1,
      "tipo": "CREDITO",
      "pontos": 50,
      "descricao": "Crédito NFC-e: Padaria Bella Vista",
      "valorCompra": 50,
      "fatorConversao": 1,
      "establishment": { "id": 1, "nome": "Padaria Bella Vista" },
      "createdAt": "2026-10-01T22:00:00.000Z"
    }
  ]
}
```

---

### 8. Resgate de Pontos (`POST /account/points/redeem`)

Realiza o resgate de pontos para troca por voucher ou recompensa.

- **Headers:** `Authorization: Bearer <token>`
- **Corpo da Requisição (JSON):**

```json
{
  "establishmentId": 1,
  "pontos": 50,
  "descricao": "Resgate de Voucher Desconto R$ 5,00"
}
```

- **Resposta de Sucesso (`200 OK`):**

```json
{
  "data": {
    "novoSaldo": 100,
    "pontosResgatados": 50,
    "establishment": "Padaria Bella Vista",
    "transactionId": 2
  },
  "message": "Resgate efetuado com sucesso!"
}
```

---

## 📜 Regras de Negócio e Arquitetura do Sistema

O backend foi arquitetado com base nas especificações oficiais documentadas em `docs/`:

1. **RN01 (Tempo de Emissão de 48h):** Notas fiscais com emissão superior a 48h no momento do escaneamento são rejeitadas.
2. **RN02 (Unicidade Anti-Fraude):** A chave de acesso de 44 dígitos da NFC-e é única em toda a plataforma (`UNIQUE` no banco).
3. **RN03 (Match de CNPJ):** Destinação de pontos feita pelo cruzamento automático do CNPJ Emitente com o cadastro do Lojista.
4. **RN04 (Cômputo Customizável):** O Fator de Conversão é configurável por estabelecimento (ex: R$ 1,00 = 1 Ponto).
5. **RN05 (Proteção ao Consumidor):** Inadimplência do lojista bloqueia novos pontos, mas mantém intocado o saldo histórico do cliente.
6. **RN06 (Onboarding):** Estabelecimentos iniciam com status `PENDENTE` até validação cadastral na SEFAZ.
7. **RN07 (Restrição Geográfica MVP):** Aceitação exclusiva de QR Codes da SEFAZ de **Santa Catarina (SC)** e **Paraná (PR)**.
8. **RN08 (Privacidade):** O lojista só visualiza dados de clientes que já pontuaram em sua loja.

---

## 🧪 Testes Automatizados com Japa

A suíte cobre autenticação, perfis de consumidor e lojista, motor de pontuação relacional em banco, validação anti-fraude, saldos, resgates e validações fiscais de SC e PR:

```bash
npm test
```

Saída:

```text
functional / Auth API — Testes Exploratórios (tests/functional/auth.spec.ts)
  ✔ 7 testes passando

functional / Functional | Customer Auth & Profile (tests/functional/customer.spec.ts)
  ✔ 3 testes passando

functional / Functional | Establishment Auth & Profile (tests/functional/establishment.spec.ts)
  ✔ 3 testes passando

functional / NFC-e Submission & Multi-Tenant Loyalty Ledger API (tests/functional/nfce_submit.spec.ts)
  ✔ 4 testes passando

functional / NFC-e Validation & Parsing API (tests/functional/nfce.spec.ts)
  ✔ 5 testes passando

 PASSED: 22 testes passando (100% de sucesso)
```

---

## 🚀 Como Executar o Backend

### Modo Integrado (Recomendado)

Para rodar junto com o frontend:

```bash
npm run dev
```

### Apenas o Backend

```bash
npm run dev:server
```

Servidor disponível em: **http://localhost:3333**
Documentação Swagger UI: **http://localhost:3333/docs**

### Executar Migrations

```bash
npm run db:migrate
```
