import { history } from '@/data/mocks'
import { pointsService } from './pointsService'
import type { Transacao } from '@/types/consumer'

let localHistory = [...history]

export const transactionsService = {
  /**
   * Obtém o extrato de movimentações e transações da API (ou fallback para local)
   */
  async getAll(): Promise<Transacao[]> {
    try {
      const token = localStorage.getItem('@cashme:token')
      if (token) {
        const apiTxs = await pointsService.getTransactions()
        if (apiTxs && apiTxs.length > 0) {
          return apiTxs.map((t) => ({
            id: t.id,
            type: t.tipo === 'CREDITO' ? 'earn' : 'redeem',
            store: t.establishment?.nome || 'Loja Credenciada',
            pts: t.pontos > 0 ? `+${t.pontos} pts` : `${t.pontos} pts`,
            date: new Date(t.createdAt).toLocaleDateString('pt-BR'),
            value: t.valorCompra ? `R$ ${t.valorCompra.toFixed(2)}` : t.descricao,
            balance: `${t.pontos > 0 ? '+' : ''}${t.pontos} pts`,
          }))
        }
      }
    } catch {
      // Fallback para histórico local se deslogado ou offline
    }

    return Promise.resolve([...localHistory])
  },

  /**
   * Registra uma nova transação (resgate ou acúmulo de pontos) localmente
   */
  async add(transaction: Omit<Transacao, 'id'>): Promise<Transacao> {
    const newTx: Transacao = {
      ...transaction,
      id: Date.now(),
    }
    localHistory = [newTx, ...localHistory]
    return Promise.resolve(newTx)
  },
}
