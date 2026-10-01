import { customers } from '@/data/mocks'
import type { Cliente } from '@/types/merchant'

export const customersService = {
  /**
   * Obtém a lista de clientes fidelizados do comerciante
   */
  async getAll(): Promise<Cliente[]> {
    return Promise.resolve([...customers])
  },

  /**
   * Busca um cliente específico pelo identificador
   */
  async getById(id: number): Promise<Cliente | undefined> {
    return Promise.resolve(customers.find((c) => c.id === id))
  },
}
