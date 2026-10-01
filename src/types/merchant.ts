/**
 * Modelo de Cliente Fidelizado na visão do Comerciante
 */
export interface Cliente {
  id: number
  name: string
  pts: number
  last: string
  active: boolean
  purchases: string
}

/**
 * Modelo de Oferta criada pelo Comerciante na Vitrine
 */
export interface OfertaComerciante {
  id: number
  name: string
  desc: string
  valid: string
  active: boolean
}

/**
 * Modelo de Campanha Promocional do Lojista
 */
export interface Campanha {
  name: string
  period: string
  rule: string
  active: boolean
}

/**
 * Ponto de dados para o gráfico de evolução de faturamento/pontos
 */
export interface PontoGrafico {
  d: string
  v: number
}

// Aliases para compatibilidade
export type Customer = Cliente
export type MerchantOffer = OfertaComerciante
export type Campaign = Campanha
export type ChartPoint = PontoGrafico
