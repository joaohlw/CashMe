import type { Offer } from '@/types/consumer'

export const offers: Offer[] = [
  {
    id: 1,
    store: 'Padaria Real',
    pts: 500,
    discount: 'R$ 10,00',
    valid: '30/06/2026',
    bg: 'linear-gradient(135deg,#92400E,#B45309)',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 2,
    store: 'Mercado Bom Preço',
    pts: 300,
    discount: 'R$ 7,00',
    valid: '25/06/2026',
    bg: 'linear-gradient(135deg,#166534,#15803D)',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=220&fit=crop&auto=format',
  },
  {
    id: 3,
    store: 'Farmácia Saúde',
    pts: 400,
    discount: 'R$ 8,00',
    valid: '20/06/2026',
    bg: 'linear-gradient(135deg,#1E40AF,#2563EB)',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=220&fit=crop&auto=format',
  },
]
