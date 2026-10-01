import type { ComponentType } from 'react'

/**
 * Modelo de Loja Parceira
 */
export interface Loja {
  id: number
  name: string
  cat: string
  loc: string
  rule: string
  pts: number
  color: string
  bg: string
}

/**
 * Modelo de Oferta / Cupom de Desconto
 */
export interface Oferta {
  id: number
  store: string
  pts: number
  discount: string
  valid: string
  bg: string
  img: string
}

/**
 * Modelo de Transação / Extrato de Pontos
 */
export interface Transacao {
  id: number
  type: 'earn' | 'redeem'
  store: string
  pts: string
  date: string
  value: string
  balance: string
}

/**
 * Categoria de Estabelecimentos
 */
export interface ItemCategoria {
  name: string
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  color: string
  bg: string
}

// Aliases para compatibilidade
export type Store = Loja
export type Offer = Oferta
export type Transaction = Transacao
export type CategoryItem = ItemCategoria
