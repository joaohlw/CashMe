export interface NfceItem {
  codigo: string
  descricao: string
  quantidade: number
  unidade: string
  valorUnitario: number
  valorTotal: number
}

export interface NfceEmitente {
  razaoSocial: string
  nomeFantasia?: string
  cnpj: string
  endereco?: string
  inscricaoEstadual?: string
}

export interface NfceTotais {
  qtdItens: number
  valorTotal: number
  valorPagar: number
  desconto?: number
  formaPagamento?: string
}

export interface NfceInfo {
  chaveAcesso: string
  numero?: string
  serie?: string
  dataEmissao?: string
  protocolo?: string
  uf?: 'SC' | 'PR' | 'OUTRO'
}

export interface NfceConsumidor {
  documento?: string
  nome?: string
}

export interface NfceData {
  emitente: NfceEmitente
  info: NfceInfo
  itens: NfceItem[]
  totais: NfceTotais
  consumidor: NfceConsumidor
  pontosCalculados: number
  url: string
  scrapedAt: Date
  rawHtmlLength: number
}

/**
 * Utilitário para formatar moeda brasileira BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Converte strings de valor em formato brasileiro ("12,50" ou "R$ 1.250,90") para number
 */
export function parseBrlNumber(val: string): number {
  if (!val) return 0
  const cleaned = val.replace(/[^\d,-]/g, '').replace(',', '.')
  const num = Number.parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

/**
 * Remove tags HTML e decodifica entidades básicas
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '')
    .replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, '')
    .replace(/<[^>]+>/gm, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Validador de URL da SEFAZ (SC e PR suportados no MVP - RN07)
 */
export function isValidSefazUrl(url: string): {
  isValid: boolean
  uf: 'SC' | 'PR' | 'OUTRO' | null
  isAllowed: boolean
  chaveAcesso?: string
  reason?: string
} {
  try {
    const trimmed = url.trim()
    if (!trimmed) {
      return { isValid: false, uf: null, isAllowed: false, reason: 'URL vazia.' }
    }

    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const host = parsed.hostname.toLowerCase()

    // Extrair chave se presente
    const chaveMatch = trimmed.match(/(?:p=|chNFe=|chave=)?(\d{44})/i)
    const chaveAcesso = chaveMatch ? chaveMatch[1] : undefined

    // SEFAZ Santa Catarina
    if (host.includes('sef.sc.gov.br') || host.includes('sat.sef.sc.gov.br')) {
      return { isValid: true, uf: 'SC', isAllowed: true, chaveAcesso }
    }

    // SEFAZ Paraná
    if (host.includes('fazenda.pr.gov.br') || host.includes('dfe.fazenda.pr.gov.br')) {
      return { isValid: true, uf: 'PR', isAllowed: true, chaveAcesso }
    }

    // Outros portais SEFAZ (fora do MVP)
    if (
      host.endsWith('.gov.br') &&
      (host.includes('sefaz') || host.includes('fazenda') || host.includes('svrs.rs.gov.br'))
    ) {
      return {
        isValid: true,
        uf: 'OUTRO',
        isAllowed: false,
        chaveAcesso,
        reason:
          'NFC-e de estado fora da área piloto do MVP (apenas SC e PR são suportados no momento).',
      }
    }

    return {
      isValid: false,
      uf: null,
      isAllowed: false,
      reason: `O domínio "${host}" não é um portal SEFAZ autorizado (apenas SC e PR são aceitos).`,
    }
  } catch {
    return { isValid: false, uf: null, isAllowed: false, reason: 'URL com formato inválido.' }
  }
}

/**
 * Parser de HTML de NFC-e (baseado no motor do web-scrap-app adaptado para Cash Me)
 */
export function parseNfceHtml(html: string, pageUrl: string = '', factor: number = 1.0): NfceData {
  const plainText = stripHtml(html)

  // 1. Extração da Chave de Acesso (44 dígitos numéricos)
  let chaveAcesso = ''
  const chaveMatch =
    html.match(
      /\b(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/
    ) || plainText.match(/(\d{44})/)

  if (chaveMatch) {
    chaveAcesso = chaveMatch[1].replace(/[\s-]/g, '')
  } else if (pageUrl) {
    const urlChaveMatch = pageUrl.match(/(?:p=|chNFe=|chave=)(\d{44})/i)
    if (urlChaveMatch) {
      chaveAcesso = urlChaveMatch[1]
    }
  }

  // 2. Extração do Emitente (Razão Social e CNPJ)
  let cnpj = ''
  const cnpjMatch =
    html.match(/\b(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\b/) ||
    plainText.match(/CNPJ[:\s]*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i)
  if (cnpjMatch) {
    cnpj = cnpjMatch[1]
  }

  let razaoSocial = ''
  const topoMatch = html.match(
    /class=["'][^"']*(?:txtTopo|nomeEmpresa|razaoSocial|u20)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|h4|h3|p)>/i
  )
  if (topoMatch) {
    razaoSocial = stripHtml(topoMatch[1])
  }
  if (!razaoSocial && cnpj) {
    razaoSocial = 'Estabelecimento Comercial Credenciado'
  }

  // 3. Extração dos Itens
  const itens: NfceItem[] = []
  const trMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi)

  if (trMatches) {
    for (const tr of trMatches) {
      if (tr.includes('<th') && !tr.includes('<td')) continue

      const descMatch = tr.match(
        /class=["'][^"']*(?:txtTit|descricao|nome)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
      )
      const vlTotalMatch = tr.match(
        /class=["'][^"']*(?:valor|Rval|total|vlTotal)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
      )
      const qtdMatch = tr.match(
        /class=["'][^"']*(?:Rqty|qtd|quantidade)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
      )
      const codMatch = tr.match(
        /class=["'][^"']*(?:RCod|codigo)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
      )

      if (descMatch || vlTotalMatch) {
        const desc = descMatch ? stripHtml(descMatch[1]) : 'Item'
        const rawVlTotal = vlTotalMatch ? stripHtml(vlTotalMatch[1]) : '0'
        const rawQtd = qtdMatch ? stripHtml(qtdMatch[1]) : '1'
        const rawCod = codMatch ? stripHtml(codMatch[1]).replace(/[^\d]/g, '') : ''

        const vlTotal = parseBrlNumber(rawVlTotal)
        const qtd = parseBrlNumber(rawQtd) || 1

        if (desc && (vlTotal > 0 || desc.length > 2)) {
          itens.push({
            codigo: rawCod || String(itens.length + 1),
            descricao: desc,
            quantidade: qtd,
            unidade: 'UN',
            valorUnitario: qtd > 0 && vlTotal > 0 ? vlTotal / qtd : vlTotal,
            valorTotal: vlTotal,
          })
        }
      }
    }
  }

  // 4. Totais e Pagamento
  let valorPagar = 0
  const valorPagarMatch = html.match(
    /(?:Valor\s+a\s+pagar)[^<]*<\/label>[\s\S]*?<span[^>]*class=["'][^"']*(?:txtMax|totalNumb)[^"']*["'][^>]*>([\d.,]+)<\/span>/i
  )
  if (valorPagarMatch) {
    valorPagar = parseBrlNumber(valorPagarMatch[1])
  }

  let valorTotal = 0
  const valorTotalMatch = html.match(
    /(?:Valor\s+total\s+R\$)[^<]*<\/label>[\s\S]*?<span[^>]*class=["'][^"']*(?:totalNumb)[^"']*["'][^>]*>([\d.,]+)<\/span>/i
  )
  if (valorTotalMatch) {
    valorTotal = parseBrlNumber(valorTotalMatch[1])
  } else {
    valorTotal = valorPagar
  }

  if (valorPagar === 0 && itens.length > 0) {
    valorPagar = itens.reduce((acc, curr) => acc + curr.valorTotal, 0)
    valorTotal = valorPagar
  }

  // 5. Cômputo de Pontos da Cash Me (RN03)
  const pontosCalculados = Math.floor(valorPagar * factor)

  return {
    emitente: {
      razaoSocial: razaoSocial || 'Loja Parceira Cash Me',
      cnpj: cnpj || '00.000.000/0001-00',
    },
    info: {
      chaveAcesso: chaveAcesso || '35260900000000000000650010000000011000000010',
      uf: isValidSefazUrl(pageUrl).uf || 'SC',
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
    },
    itens,
    totais: {
      qtdItens: itens.length || 1,
      valorTotal: valorTotal || valorPagar,
      valorPagar,
    },
    consumidor: {},
    pontosCalculados,
    url: pageUrl,
    scrapedAt: new Date(),
    rawHtmlLength: html.length,
  }
}
