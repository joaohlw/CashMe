import type { MerchantOffer } from '@/types/merchant'

export const merchantOffers: MerchantOffer[] = [
  { id: 1, name: 'Pão francês', desc: 'Leve 10, pague 8', valid: '30/06/2026', active: true },
  { id: 2, name: 'Bolo do dia', desc: '10% de desconto', valid: '25/06/2026', active: true },
  { id: 3, name: 'Café especial', desc: 'Ganhe 1 ponto extra', valid: '30/06/2026', active: false },
]
