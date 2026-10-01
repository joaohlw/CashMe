import { Coffee, ShoppingBag, Pill, Shirt } from 'lucide-react'
import type { ItemCategoria } from '@/types/consumer'

export const categories: ItemCategoria[] = [
  { name: 'Alimentação', Icon: Coffee, color: '#92400E', bg: '#FEF3C7' },
  { name: 'Bebidas', Icon: ShoppingBag, color: '#1E40AF', bg: '#DBEAFE' },
  { name: 'Farmácias', Icon: Pill, color: '#166534', bg: '#DCFCE7' },
  { name: 'Moda', Icon: Shirt, color: '#6B21A8', bg: '#F3E8FF' },
]

// Alias para compatibilidade
export const categorias = categories
