import { api } from './api'
import type { NfceData } from '@/utils/nfceParser'

export interface NfceValidationResponse {
  isValid: boolean
  uf: 'SC' | 'PR' | 'OUTRO' | null
  chaveAcesso: string
  isEligible: boolean
  reasons: string[]
}

export interface NfceParseResponse {
  data: NfceData
  message: string
}

export const nfceService = {
  /**
   * Valida URL da SEFAZ ou Chave de Acesso no backend (RN02, RN07)
   */
  async validate(payload: { url?: string; accessKey?: string }): Promise<NfceValidationResponse> {
    const res = await api.post<{ data: NfceValidationResponse }>('/api/v1/nfce/validate', payload)
    return res.data
  },

  /**
   * Processa o HTML da NFC-e ou URL e extrai todos os dados estruturados
   */
  async parse(payload: {
    html?: string
    url?: string
    accessKey?: string
    factor?: number
  }): Promise<NfceParseResponse> {
    return api.post<NfceParseResponse>('/api/v1/nfce/parse', payload)
  },

  /**
   * Submete a NFC-e autenticado, credita pontos e salva a transação no banco
   */
  async submit(payload: {
    url?: string
    accessKey?: string
    html?: string
    factor?: number
  }): Promise<any> {
    const res = await api.post<{ data: any; message: string }>('/api/v1/nfce/submit', payload)
    return res.data
  },
}
