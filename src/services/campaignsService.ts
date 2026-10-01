import { merchantOffers } from '@/data/mocks'
import type { OfertaComerciante } from '@/types/merchant'

let localOffers = [...merchantOffers]

export const campaignsService = {
  /**
   * Obtém as ofertas e campanhas da vitrine do comerciante
   */
  async getOffers(): Promise<OfertaComerciante[]> {
    return Promise.resolve([...localOffers])
  },

  /**
   * Atualiza o status ativo/inativo de uma oferta na vitrine
   */
  async toggleOffer(id: number): Promise<OfertaComerciante | undefined> {
    const item = localOffers.find((o) => o.id === id)
    if (item) {
      item.active = !item.active
    }
    return Promise.resolve(item)
  },

  /**
   * Cria uma nova oferta/campanha
   */
  async createOffer(offer: Omit<OfertaComerciante, 'id'>): Promise<OfertaComerciante> {
    const newOffer: OfertaComerciante = {
      ...offer,
      id: Date.now(),
    }
    localOffers = [newOffer, ...localOffers]
    return Promise.resolve(newOffer)
  },
}
