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
  url?: string
  scrapedAt: Date
  rawHtmlLength?: number
}

export interface SefazUrlValidation {
  isValid: boolean
  uf: 'SC' | 'PR' | 'OUTRO' | null
  isAllowed: boolean // Permitido no MVP (SC e PR - RN07)
  chaveAcesso?: string
  reason?: string
}

/**
 * Formata número para moeda brasileira BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0)
}

/**
 * Converte strings monetárias brasileiras ("R$ 1.250,90" ou "48,50") para number float
 */
export function parseBrlNumber(val: string | number | undefined | null): number {
  if (typeof val === 'number') return val
  if (!val) return 0
  const cleaned = String(val)
    .replace(/[^\d,-]/g, '')
    .replace(',', '.')
  const num = Number.parseFloat(cleaned)
  return Number.isNaN(num) ? 0 : num
}

/**
 * Remove tags HTML e decodifica entidades básicas
 */
export function stripHtml(html: string): string {
  if (!html) return ''
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
 * Extrai a Chave de Acesso de 44 dígitos numéricos a partir de texto, URL ou HTML
 */
export function extractAccessKey(input: string): string | null {
  if (!input) return null

  // 1. Tenta extrair de parâmetros da query string da URL (ex: ?p=4226... ou ?chNFe=... ou ?chave=...)
  const urlParamMatch = input.match(/(?:[?&](?:p|chNFe|chave|ch)=)([0-9]{44})/i)
  if (urlParamMatch) {
    return urlParamMatch[1]
  }

  // 2. Tenta padrão de QR Code da SEFAZ com pipe (ex: 4226...|2|1|1|...)
  const pipeMatch = input.match(/\b([0-9]{44})\|/)
  if (pipeMatch) {
    return pipeMatch[1]
  }

  // 3. Tenta encontrar bloco de 44 dígitos sequenciais
  const rawKeyMatch = input.match(/\b([0-9]{44})\b/)
  if (rawKeyMatch) {
    return rawKeyMatch[1]
  }

  // 4. Tenta encontrar chave formatada com espaços ou traços (4 em 4 dígitos)
  const spacedMatch = input.match(
    /\b(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/
  )
  if (spacedMatch) {
    const cleaned = spacedMatch[1].replace(/[\s-]/g, '')
    if (cleaned.length === 44) return cleaned
  }

  return null
}

/**
 * Validador de URL da SEFAZ (Santa Catarina sat.sef.sc.gov.br e Paraná fazenda.pr.gov.br)
 * Atende às regras RN07 (restrição SC/PR) e RN02 (chave de 44 dígitos).
 */
export function isValidSefazUrl(rawUrl: string): SefazUrlValidation {
  try {
    const trimmed = rawUrl.trim()
    if (!trimmed) {
      return { isValid: false, uf: null, isAllowed: false, reason: 'URL vazia.' }
    }

    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    const parsed = new URL(normalized)
    const host = parsed.hostname.toLowerCase()
    const chave = extractAccessKey(rawUrl) || undefined

    // 1. SEFAZ Santa Catarina
    if (host.includes('sef.sc.gov.br') || host.includes('sat.sef.sc.gov.br')) {
      return {
        isValid: true,
        uf: 'SC',
        isAllowed: true,
        chaveAcesso: chave,
      }
    }

    // 2. SEFAZ Paraná
    if (
      host.includes('fazenda.pr.gov.br') ||
      (host.includes('dfe-portal.svrs.rs.gov.br') && rawUrl.includes('pr.gov.br'))
    ) {
      return {
        isValid: true,
        uf: 'PR',
        isAllowed: true,
        chaveAcesso: chave,
      }
    }

    // 3. Outros estados da SEFAZ
    if (
      host.endsWith('.gov.br') &&
      (host.includes('sefaz') ||
        host.includes('fazenda') ||
        host.includes('svrs.rs.gov.br') ||
        host.includes('receita'))
    ) {
      return {
        isValid: true,
        uf: 'OUTRO',
        isAllowed: false,
        chaveAcesso: chave,
        reason:
          'Portal SEFAZ fora da cobertura do MVP. No momento, são aceitas apenas NFC-e de Santa Catarina (SC) e Paraná (PR) [RN07].',
      }
    }

    return {
      isValid: false,
      uf: null,
      isAllowed: false,
      chaveAcesso: chave,
      reason: `O domínio "${host}" não é reconhecido como um portal oficial da SEFAZ (SC ou PR).`,
    }
  } catch {
    return {
      isValid: false,
      uf: null,
      isAllowed: false,
      reason: 'URL com formato inválido.',
    }
  }
}

/**
 * Validação de regras de negócio de NFC-e
 */
export function validateNfceBusinessRules(data: {
  chaveAcesso: string
  dataEmissao?: string | Date
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // RN02: Unicidade e formato da chave (44 dígitos)
  const cleanKey = data.chaveAcesso.replace(/\D/g, '')
  if (cleanKey.length !== 44) {
    errors.push(
      `Chave de acesso inválida (${cleanKey.length}/44 dígitos). Uma NFC-e válida deve conter exatamente 44 dígitos [RN02].`
    )
  }

  // RN07: Restrição de Estado pelos primeiros 2 dígitos da chave
  if (cleanKey.length === 44) {
    const ufCode = cleanKey.substring(0, 2)
    if (ufCode !== '42' && ufCode !== '41') {
      const ufNome =
        ufCode === '35' ? 'SP' : ufCode === '33' ? 'RJ' : ufCode === '43' ? 'RS' : `UF ${ufCode}`
      errors.push(
        `A NFC-e pertence ao estado de ${ufNome}. O MVP aceita exclusivamente notas fiscais de Santa Catarina (42) e Paraná (41) [RN07].`
      )
    }
  }

  // RN01: Validação de tempo de emissão (máximo 48h)
  if (data.dataEmissao) {
    let emissaoDate: Date | null = null
    if (data.dataEmissao instanceof Date) {
      emissaoDate = data.dataEmissao
    } else if (typeof data.dataEmissao === 'string') {
      // Formatos possíveis: "DD/MM/YYYY HH:mm:ss" ou ISO
      const brDateMatch = data.dataEmissao.match(
        /(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/
      )
      if (brDateMatch) {
        const [, day, month, year, h = '0', m = '0', s = '0'] = brDateMatch
        emissaoDate = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(h),
          Number(m),
          Number(s)
        )
      } else {
        const parsed = new Date(data.dataEmissao)
        if (!Number.isNaN(parsed.getTime())) emissaoDate = parsed
      }
    }

    if (emissaoDate && !Number.isNaN(emissaoDate.getTime())) {
      const diffHours = (Date.now() - emissaoDate.getTime()) / (1000 * 60 * 60)
      if (diffHours > 48) {
        errors.push(
          `A nota foi emitida há mais de 48 horas (${Math.floor(diffHours)}h). Notas expiradas não podem ser computadas [RN01].`
        )
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Parser de HTML de NFC-e (baseado no motor do hugobatista27/web-scrap-app)
 * Extrai todos os itens, cabeçalhos, CNPJ, totais e metadados.
 */
export function parseNfceHtml(
  html: string,
  pageUrl?: string,
  conversionFactor: number = 1.0
): NfceData {
  const plainText = stripHtml(html)

  // 1. Extração da Chave de Acesso
  let chaveAcesso =
    extractAccessKey(html) ||
    extractAccessKey(plainText) ||
    (pageUrl ? extractAccessKey(pageUrl) : null) ||
    ''

  // 2. Extração do Emitente (CNPJ e Razão Social)
  let cnpj = ''
  const cnpjMatch =
    html.match(/\b(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})\b/) ||
    plainText.match(/CNPJ[:\s]*(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i)
  if (cnpjMatch) {
    cnpj = cnpjMatch[1]
  }

  let razaoSocial = ''
  const topoMatch =
    html.match(
      /class=["'][^"']*(?:txtTopo|nomeEmpresa|razaoSocial|u20|titLoja)[^"']*["'][^>]*>([^<]+)/i
    ) || html.match(/<h[1-4][^>]*>([^<]{3,80})<\/h[1-4]>/i)
  if (topoMatch) {
    razaoSocial = stripHtml(topoMatch[1])
  }
  if (!razaoSocial && cnpj) {
    const idx = plainText.indexOf(cnpj)
    if (idx > 10) {
      const snippet = plainText.substring(Math.max(0, idx - 100), idx).trim()
      const parts = snippet.split(/\s{2,}|\n| - /)
      razaoSocial = parts[parts.length - 1] || 'Estabelecimento Comercial'
    }
  }
  if (!razaoSocial) razaoSocial = 'Estabelecimento Comercial Credenciado'

  // 3. Extração dos Itens da NFC-e
  const itens: NfceItem[] = []
  const trMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi)

  if (trMatches && trMatches.length > 0) {
    for (const tr of trMatches) {
      if (tr.includes('<th') && !tr.includes('<td')) continue

      const descMatch =
        tr.match(
          /class=["'][^"']*(?:txtTit|descricao|nome|item)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
        ) || tr.match(/<span[^>]*class=["']txtTit["'][^>]*>([\s\S]*?)<\/span>/i)

      const codMatch =
        tr.match(/class=["'][^"']*(?:RCod|codigo)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i) ||
        tr.match(/\(Código[:\s]*(\d+)\)/i)

      const qtdMatch =
        tr.match(
          /class=["'][^"']*(?:Rqty|qtd|quantidade)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
        ) || tr.match(/Qtde?\.?[:\s]*([\d.,]+)/i)

      const unMatch =
        tr.match(/class=["'][^"']*(?:RUN|unidade)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i) ||
        tr.match(/\bQtde?\.?[:\s]*[\d.,]+\s*([A-Z]{2,4})\b/i) ||
        tr.match(/\bUN[:\s]*([A-Z]{2,4})\b/i)

      const vlUnitMatch =
        tr.match(
          /class=["'][^"']*(?:RvlUnit|vlUnit|unitario)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
        ) || tr.match(/Vl\.?\s*Unit\.?[:\s]*([\d.,]+)/i)

      const vlTotalMatch =
        tr.match(
          /class=["'][^"']*(?:valor|Rval|total|vlTotal)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|td|div)>/i
        ) || tr.match(/Vl\.?\s*Total[:\s]*([\d.,]+)/i)

      if (descMatch || vlTotalMatch) {
        const desc = descMatch ? stripHtml(descMatch[1]) : 'Item'
        const rawCod = codMatch ? stripHtml(codMatch[1]).replace(/[^\d]/g, '') : ''
        const rawQtd = qtdMatch ? stripHtml(qtdMatch[1]) : '1'
        const un = unMatch ? stripHtml(unMatch[1]) : 'UN'
        const rawVlUnit = vlUnitMatch ? stripHtml(vlUnitMatch[1]) : '0'
        const rawVlTotal = vlTotalMatch ? stripHtml(vlTotalMatch[1]) : '0'

        const qtd = parseBrlNumber(rawQtd) || 1
        const vlTotal = parseBrlNumber(rawVlTotal)
        const vlUnit = parseBrlNumber(rawVlUnit) || (qtd > 0 && vlTotal > 0 ? vlTotal / qtd : 0)

        if (desc && (vlTotal > 0 || desc.length > 2)) {
          itens.push({
            codigo: rawCod || String(itens.length + 1),
            descricao: desc,
            quantidade: qtd,
            unidade: un.trim() || 'UN',
            valorUnitario: vlUnit,
            valorTotal: vlTotal,
          })
        }
      }
    }
  }

  // 4. Totais da Nota
  let valorTotal = 0
  let valorPagar = 0
  let desconto = 0
  let formaPagamento = 'Não informada'
  let qtdItensParsed = 0

  const qtdItensMatch =
    html.match(
      /(?:Qtd\.?\s*total\s*de\s*itens|Quantidade\s*total)[^<]*<\/label>[\s\S]*?<span[^>]*class=["'][^"']*totalNumb[^"']*["'][^>]*>([\d.,]+)<\/span>/i
    ) ||
    html.match(/(?:Qtd\.?\s*total\s*de\s*itens|Quantidade\s*total)[:\s]*<[^>]+>([\d.,]+)/i) ||
    plainText.match(/(?:Qtd\.?\s*total\s*de\s*itens|Quantidade\s*total)[:\s]*(\d+)/i)

  if (qtdItensMatch) {
    qtdItensParsed = parseInt(qtdItensMatch[1].replace(/[^\d]/g, ''), 10) || 0
  }

  const descontoMatch =
    html.match(/(?:Desconto|Descontos)[^<]*<\/label>[\s\S]*?<span[^>]*>([\d.,]+)<\/span>/i) ||
    plainText.match(/(?:Desconto|Descontos\s*R\$)[:\s]*(?:R\$)?\s*([\d.,]+)/i)

  if (descontoMatch) {
    desconto = parseBrlNumber(descontoMatch[1])
  }

  const valorPagarMatch =
    html.match(
      /(?:Valor\s+a\s+pagar)[^<]*<\/label>[\s\S]*?<span[^>]*class=["'][^"']*(?:txtMax|totalNumb)[^"']*["'][^>]*>([\d.,]+)<\/span>/i
    ) ||
    html.match(/(?:Valor\s+a\s+pagar)[^<]*<\/label>[\s\S]*?<span[^>]*>([\d.,]+)<\/span>/i) ||
    html.match(/class=["'][^"']*\btxtMax\b[^"']*["'][^>]*>([\d.,]+)<\/span>/i) ||
    plainText.match(/(?:Valor\s+a\s+pagar)[:\s]*(?:R\$)?\s*([\d.,]{3,})/i)

  if (valorPagarMatch) {
    valorPagar = parseBrlNumber(valorPagarMatch[1])
  }

  const valorTotalMatch =
    html.match(
      /(?:Valor\s+total)[^<]*<\/label>[\s\S]*?<span[^>]*class=["'][^"']*(?:txtMax|totalNumb)[^"']*["'][^>]*>([\d.,]+)<\/span>/i
    ) ||
    html.match(/(?:Valor\s+total)[^<]*<\/label>[\s\S]*?<span[^>]*>([\d.,]+)<\/span>/i) ||
    plainText.match(
      /(?:Valor\s+total(?:\s*R\$)?|Total\s+R\$|\bTotal da Nota\b)[:\s]*(?:R\$)?\s*([\d.,]{3,})/i
    )

  if (valorTotalMatch) {
    valorTotal = parseBrlNumber(valorTotalMatch[1])
  }

  if (valorTotal === 0 && valorPagar > 0) valorTotal = valorPagar
  if (valorPagar === 0 && valorTotal > 0) valorPagar = valorTotal

  // Validação cruzada com a soma dos itens
  const sumItens = itens.reduce((acc, curr) => acc + curr.valorTotal, 0)
  if (sumItens > 0) {
    const isTotalSuspicious =
      valorTotal === 0 ||
      (qtdItensParsed > 0 && Math.abs(valorTotal - qtdItensParsed) < 0.001) ||
      (itens.length > 1 && Math.abs(valorTotal - itens.length) < 0.001) ||
      (valorTotal < sumItens * 0.25 && sumItens >= 5)

    if (isTotalSuspicious) {
      valorTotal = sumItens
      valorPagar = desconto > 0 ? Math.max(0, sumItens - desconto) : sumItens
    }
  }

  // Meio de pagamento
  const formasConhecidas = [
    'Cartão de Crédito',
    'Cartão de Débito',
    'Dinheiro',
    'PIX',
    'Boleto',
    'Vale Alimentação',
    'Vale Refeição',
  ]
  for (const forma of formasConhecidas) {
    if (new RegExp(forma, 'i').test(plainText)) {
      formaPagamento = forma
      break
    }
  }

  // 5. Metadados fiscais
  const numMatch = plainText.match(/(?:Número|Nº)[:\s]*(\d+)/i)
  const serieMatch = plainText.match(/(?:Série)[:\s]*(\d+)/i)
  const dataMatch = plainText.match(
    /(?:Emissão|Data da Emissão)[:\s]*(\d{2}\/\d{2}\/\d{4}(?:\s+\d{2}:\d{2}(?::\d{2})?)?)/i
  )
  const protocoloMatch = plainText.match(/(?:Protocolo|Protocolo de autorização)[:\s]*(\d{10,20})/i)
  const cpfConsumidorMatch = plainText.match(
    /Consumidor(?:\s+CPF)?[:\s]*(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})/i
  )

  const ufPrefix = chaveAcesso.substring(0, 2)
  const uf: 'SC' | 'PR' | 'OUTRO' = ufPrefix === '42' ? 'SC' : ufPrefix === '41' ? 'PR' : 'OUTRO'

  const finalValorPagar = valorPagar || valorTotal || sumItens
  const pontosCalculados = Math.floor(finalValorPagar * conversionFactor)

  return {
    emitente: {
      razaoSocial,
      cnpj,
    },
    info: {
      chaveAcesso: chaveAcesso || 'Não identificada',
      numero: numMatch ? numMatch[1] : undefined,
      serie: serieMatch ? serieMatch[1] : undefined,
      dataEmissao: dataMatch ? dataMatch[1] : undefined,
      protocolo: protocoloMatch ? protocoloMatch[1] : undefined,
      uf,
    },
    itens,
    totais: {
      qtdItens: qtdItensParsed > 0 ? qtdItensParsed : itens.length || 1,
      valorTotal: valorTotal || finalValorPagar,
      valorPagar: finalValorPagar,
      desconto: desconto > 0 ? desconto : undefined,
      formaPagamento,
    },
    consumidor: {
      documento: cpfConsumidorMatch ? cpfConsumidorMatch[1] : undefined,
    },
    pontosCalculados,
    url: pageUrl,
    scrapedAt: new Date(),
    rawHtmlLength: html.length,
  }
}
