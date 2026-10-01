import type { Customer } from '@/types/merchant'

export const customers: Customer[] = [
  {
    id: 1,
    name: 'Leandro Silva',
    pts: 1250,
    last: '22/05/2026',
    active: true,
    purchases: 'R$ 2.450,00',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    pts: 980,
    last: '21/05/2026',
    active: true,
    purchases: 'R$ 1.960,00',
  },
  {
    id: 3,
    name: 'Carlos Ferreira',
    pts: 730,
    last: '20/05/2026',
    active: true,
    purchases: 'R$ 1.460,00',
  },
  {
    id: 4,
    name: 'Juliana Costa',
    pts: 560,
    last: '18/05/2026',
    active: false,
    purchases: 'R$ 1.120,00',
  },
  {
    id: 5,
    name: 'Rafael Lima',
    pts: 430,
    last: '15/05/2026',
    active: true,
    purchases: 'R$ 860,00',
  },
]
