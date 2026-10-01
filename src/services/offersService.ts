import { offers } from '@/data/mocks'
import type { Oferta } from '@/types/consumer'

export const offersService = {
  /**
   * Obtém todas as ofertas/cupons disponíveis para o consumidor
   */
  async getAll(): Promise<Oferta[]> {
    return Promise.resolve([...offers])
  },

  /**
   * Busca uma oferta específica pelo identificador
   */
  async getById(id: number): Promise<Oferta | undefined> {
    return Promise.resolve(offers.find((o) => o.id === id))
  },
}
