import { api } from './api'

export interface EstablishmentBalance {
  establishmentId: number
  establishmentName: string
  saldoAtual: number
  totalAcumulado: number
}

export interface BalanceResponse {
  totalBalance: number
  totalAccumulated: number
  byEstablishment: EstablishmentBalance[]
}

export interface TransactionItem {
  id: number
  tipo: string
  pontos: number
  descricao: string
  valorCompra: number | null
  fatorConversao: number | null
  establishment: {
    id: number
    nome: string
  } | null
  nfceChaveAcesso: string | null
  createdAt: string
}

export const pointsService = {
  /**
   * Obtém saldos de pontos do usuário autenticado da API
   */
  async getBalance(): Promise<BalanceResponse> {
    const res = await api.get<{ data: BalanceResponse }>('/api/v1/account/points/balance')
    return res.data
  },

  /**
   * Obtém extrato de movimentações (créditos e resgates) da API
   */
  async getTransactions(): Promise<TransactionItem[]> {
    const res = await api.get<{ data: TransactionItem[] }>('/api/v1/account/points/transactions')
    return res.data
  },

  /**
   * Realiza resgate de pontos na API
   */
  async redeem(payload: {
    establishmentId: number
    pontos: number
    descricao?: string
  }): Promise<any> {
    const res = await api.post<{ data: any; message: string }>(
      '/api/v1/account/points/redeem',
      payload
    )
    return res.data
  },
}
