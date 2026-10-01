import { api } from './api'
import { stores } from '@/data/mocks'
import type { Loja } from '@/types/consumer'

export const storesService = {
  /**
   * Obtém todas as lojas parceiras cadastradas (busca na API e enriquece com mocks se necessário)
   */
  async getAll(): Promise<Loja[]> {
    try {
      const res = await api.get<{
        data: Array<{
          id: number
          nome: string
          razaoSocial: string
          cnpj: string
          fatorConversao: number
          status: string
        }>
      }>('/api/v1/establishments')

      if (res?.data && res.data.length > 0) {
        // Mapeia estabelecimentos do banco
        const apiStores: Loja[] = res.data.map((s, idx) => ({
          id: s.id,
          name: s.nome || s.razaoSocial,
          cat: idx % 2 === 0 ? 'Alimentação & Café' : 'Supermercado',
          loc: 'Centro • 1.2 km',
          rule: `R$ 1,00 = ${s.fatorConversao} pt`,
          pts: Math.floor(100 * s.fatorConversao),
          color: idx % 2 === 0 ? '#D97706' : '#2563EB',
          bg: idx % 2 === 0 ? '#FEF3C7' : '#DBEAFE',
        }))

        // Junta com as lojas de amostra que ainda não estão cadastradas
        const existingNames = new Set(apiStores.map((s) => s.name.toLowerCase()))
        const uniqueMocks = stores.filter((s) => !existingNames.has(s.name.toLowerCase()))
        return [...apiStores, ...uniqueMocks]
      }
    } catch {
      // Fallback gracioso para dados locais se a API estiver offline
    }

    return Promise.resolve([...stores])
  },

  /**
   * Busca uma loja específica pelo identificador
   */
  async getById(id: number): Promise<Loja | undefined> {
    const all = await this.getAll()
    return all.find((s) => s.id === id)
  },
}
