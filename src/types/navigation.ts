/**
 * Modos de entrada da aplicação:
 * - 'landing': Tela inicial de seleção de perfil
 * - 'consumer': Aplicativo na visão do Consumidor
 * - 'merchant': Aplicativo na visão do Comerciante / Lojista
 */
export type AppMode = 'landing' | 'consumer' | 'merchant'

/**
 * Identificadores de tela do módulo do Consumidor
 */
export type TelaConsumidor =
  | 'home'
  | 'categories'
  | 'stores'
  | 'store-detail'
  | 'offers'
  | 'offer-detail'
  | 'wallet'
  | 'qr-code'
  | 'profile'

/**
 * Identificadores de tela do módulo do Comerciante
 */
export type TelaComerciante =
  | 'dashboard'
  | 'campaigns'
  | 'new-campaign'
  | 'scoring-rules'
  | 'points-conversion'
  | 'qr-store'
  | 'customers'
  | 'customer-detail'
  | 'vitrine'
  | 'new-offer'
  | 'settings'

// Aliases para compatibilidade
export type ConsumerScreen = TelaConsumidor
export type MerchantScreen = TelaComerciante
export type ModoAplicativo = AppMode
