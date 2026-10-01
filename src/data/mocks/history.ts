import type { Transaction } from '@/types/consumer'

export const history: Transaction[] = [
  {
    id: 1,
    type: 'earn',
    store: 'Padaria Real',
    pts: '+50',
    date: '22/05/2026',
    value: 'R$ 50,00',
    balance: '1.250 pts',
  },
  {
    id: 2,
    type: 'redeem',
    store: 'Mercado Bom Preço',
    pts: '-300',
    date: '21/05/2026',
    value: 'Resgate',
    balance: '1.200 pts',
  },
  {
    id: 3,
    type: 'earn',
    store: 'Farmácia Saúde',
    pts: '+100',
    date: '20/05/2026',
    value: 'R$ 50,00',
    balance: '1.500 pts',
  },
  {
    id: 4,
    type: 'earn',
    store: 'Padaria Real',
    pts: '+200',
    date: '18/05/2026',
    value: 'R$ 200,00',
    balance: '1.400 pts',
  },
  {
    id: 5,
    type: 'redeem',
    store: 'Boutique Estilo',
    pts: '-500',
    date: '15/05/2026',
    value: 'Resgate',
    balance: '1.200 pts',
  },
]
