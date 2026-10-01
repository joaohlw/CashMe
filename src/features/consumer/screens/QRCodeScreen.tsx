import React, { useState, useRef } from 'react'
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Store,
  Copy,
  Check,
  Receipt,
  Camera,
  Upload,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Coins,
  MapPin,
} from 'lucide-react'
import { G, GD } from '@/constants/theme'
import { useApp } from '@/context/AppContext'
import { QRCodeVetorial } from '@/components/common'
import {
  isValidSefazUrl,
  extractAccessKey,
  parseNfceHtml,
  formatCurrency,
  type NfceData,
} from '@/utils/nfceParser'
import { nfceService } from '@/services/nfceService'
import { toast } from 'sonner'

interface QRCodeScreenProps {
  back: () => void
}

// Exemplos realistas de NFC-e de Santa Catarina (SC) e Paraná (PR)
const SAMPLE_NFCES = [
  {
    store: 'Padaria Real & Café Colonial',
    cnpj: '82.123.456/0001-78',
    uf: 'SC' as const,
    key: '42260982123456000178650010000123451000485001',
    url: 'https://sat.sef.sc.gov.br/nfce/consulta?p=42260982123456000178650010000123451000485001|2|1|1|ABCD1234EFGH5678',
    html: `
      <html><body>
        <div class="txtTopo">Padaria Real & Café Colonial Ltda</div>
        <div>CNPJ: 82.123.456/0001-78</div>
        <div>Rua XV de Novembro, 850 - Blumenau, SC</div>
        <table>
          <tr>
            <td><span class="txtTit">Pão de Queijo Minas Tradicional</span></td>
            <td><span class="RCod">00101</span></td>
            <td><span class="Rqty">4</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">3,50</span></td>
            <td><span class="Rval">14,00</span></td>
          </tr>
          <tr>
            <td><span class="txtTit">Café Expresso Duplo Cremoso</span></td>
            <td><span class="RCod">00205</span></td>
            <td><span class="Rqty">2</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">8,50</span></td>
            <td><span class="Rval">17,00</span></td>
          </tr>
          <tr>
            <td><span class="txtTit">Torta Alemã Artesanal Fatia</span></td>
            <td><span class="RCod">00312</span></td>
            <td><span class="Rqty">1</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">17,50</span></td>
            <td><span class="Rval">17,50</span></td>
          </tr>
        </table>
        <label>Valor a pagar</label>
        <span class="txtMax">48,50</span>
        <label>Data da Emissão</label>
        <span>10/09/2026 08:35:12</span>
        <label>Protocolo</label>
        <span>142260001928374</span>
      </body></html>
    `,
  },
  {
    store: 'Supermercado Paraná Central',
    cnpj: '76.987.654/0001-32',
    uf: 'PR' as const,
    key: '41260976987654000132650010000987651001320002',
    url: 'http://www.fazenda.pr.gov.br/nfce/qrcode?p=41260976987654000132650010000987651001320002|2|1|1|PR998877',
    html: `
      <html><body>
        <div class="txtTopo">Supermercado Paraná Central S.A.</div>
        <div>CNPJ: 76.987.654/0001-32</div>
        <div>Av. Batel, 1420 - Curitiba, PR</div>
        <table>
          <tr>
            <td><span class="txtTit">Azeite de Oliva Extra Virgem 500ml</span></td>
            <td><span class="RCod">78912345</span></td>
            <td><span class="Rqty">1</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">38,90</span></td>
            <td><span class="Rval">38,90</span></td>
          </tr>
          <tr>
            <td><span class="txtTit">Queijo Parmesão Curado Cunha 250g</span></td>
            <td><span class="RCod">78954321</span></td>
            <td><span class="Rqty">2</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">24,50</span></td>
            <td><span class="Rval">49,00</span></td>
          </tr>
          <tr>
            <td><span class="txtTit">Vinho Fino Tinto Malbec 750ml</span></td>
            <td><span class="RCod">78998811</span></td>
            <td><span class="Rqty">1</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">44,10</span></td>
            <td><span class="Rval">44,10</span></td>
          </tr>
        </table>
        <label>Valor a pagar</label>
        <span class="txtMax">132,00</span>
        <label>Data da Emissão</label>
        <span>10/09/2026 11:20:45</span>
        <label>Protocolo</label>
        <span>141260008473629</span>
      </body></html>
    `,
  },
  {
    store: 'Farmácia & Drogaria Catarinense',
    cnpj: '84.555.666/0001-99',
    uf: 'SC' as const,
    key: '42260984555666000199650010000456781000752003',
    url: 'https://sat.sef.sc.gov.br/nfce/consulta?p=42260984555666000199650010000456781000752003|2|1|1|SC554433',
    html: `
      <html><body>
        <div class="txtTopo">Farmácia & Drogaria Catarinense Ltda</div>
        <div>CNPJ: 84.555.666/0001-99</div>
        <div>Rua Felipe Schmidt, 300 - Florianópolis, SC</div>
        <table>
          <tr>
            <td><span class="txtTit">Protetor Solar FPS 50 Toque Seco</span></td>
            <td><span class="RCod">10022</span></td>
            <td><span class="Rqty">1</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">52,90</span></td>
            <td><span class="Rval">52,90</span></td>
          </tr>
          <tr>
            <td><span class="txtTit">Vitamina C Efervescente 1000mg</span></td>
            <td><span class="RCod">10033</span></td>
            <td><span class="Rqty">1</span> <span class="RUN">UN</span></td>
            <td><span class="RvlUnit">22,30</span></td>
            <td><span class="Rval">22,30</span></td>
          </tr>
        </table>
        <label>Valor a pagar</label>
        <span class="txtMax">75,20</span>
        <label>Data da Emissão</label>
        <span>09/09/2026 16:40:00</span>
        <label>Protocolo</label>
        <span>142260009988112</span>
      </body></html>
    `,
  },
]

export function QRCodeScreen({ back }: QRCodeScreenProps) {
  const { addPoints, refreshBalance } = useApp()
  const [activeTab, setActiveTab] = useState<'scan' | 'show'>('scan')
  const [inputUrl, setInputUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [showItemsList, setShowItemsList] = useState(true)
  const [parsedNfce, setParsedNfce] = useState<NfceData | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validação em tempo real do que o usuário digita/cola
  const liveValidation = inputUrl.trim() ? isValidSefazUrl(inputUrl) : null
  const extractedKey = inputUrl.trim() ? extractAccessKey(inputUrl) : null

  // Processa a NFC-e (localmente e no backend)
  const handleProcessInput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const raw = inputUrl.trim()
    if (!raw) {
      toast.error('Por favor, cole a URL do QR Code ou a Chave de Acesso da NFC-e.')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Validação estrutural via backend
      const validation = await nfceService.validate({ url: raw, accessKey: raw })
      if (!validation.isEligible) {
        toast.error(validation.reasons[0] || 'Nota fiscal inelegível pelo regulamento do MVP.')
        setIsProcessing(false)
        return
      }

      // 2. Localiza se é uma das amostras ou constrói o resultado estruturado
      const matchedSample = SAMPLE_NFCES.find(
        (s) => s.key === validation.chaveAcesso || raw.includes(s.key)
      )

      let data: NfceData
      if (matchedSample) {
        data = parseNfceHtml(matchedSample.html, matchedSample.url)
      } else {
        // Gera dados estruturados com base na chave de 44 dígitos validada
        const isSc = validation.uf === 'SC'
        const dummyValor = 68.5
        const dummyPoints = 68
        data = {
          emitente: {
            razaoSocial: isSc
              ? 'Empresa Parceira Florianópolis'
              : 'Estabelecimento Credenciado Curitiba',
            cnpj: '10.200.300/0001-40',
          },
          info: {
            chaveAcesso: validation.chaveAcesso,
            numero: '001239',
            serie: '1',
            dataEmissao:
              new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
            protocolo: '1' + validation.chaveAcesso.substring(0, 14),
            uf: validation.uf || 'SC',
          },
          itens: [
            {
              codigo: '101',
              descricao: 'Consumo Geral no Estabelecimento',
              quantidade: 1,
              unidade: 'UN',
              valorUnitario: dummyValor,
              valorTotal: dummyValor,
            },
          ],
          totais: {
            qtdItens: 1,
            valorTotal: dummyValor,
            valorPagar: dummyValor,
            formaPagamento: 'Cartão de Débito',
          },
          consumidor: {
            documento: 'Consumidor Identificado',
          },
          pontosCalculados: dummyPoints,
          scrapedAt: new Date(),
          url: raw,
        }
      }

      // 3. Se autenticado, grava no banco de dados e atualiza saldo oficial
      const token = localStorage.getItem('@cashme:token')
      if (token) {
        try {
          const submitRes = await nfceService.submit({
            url: raw,
            accessKey: validation.chaveAcesso,
            html: matchedSample?.html,
          })
          if (submitRes) {
            await refreshBalance()
            toast.success(
              `NFC-e registrada no banco! +${submitRes.nfce.pontosGerados} pontos creditados na carteira oficial! 🎉`
            )
          }
        } catch (subErr: any) {
          toast.error(subErr.message || 'Erro ao registrar pontuação no banco.')
          setIsProcessing(false)
          return
        }
      } else {
        addPoints(data.pontosCalculados, data.emitente.razaoSocial)
        toast.success(
          `NFC-e processada com sucesso! +${data.pontosCalculados} pontos creditados na sua carteira local! 🎉`
        )
      }

      setParsedNfce(data)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao comunicar com a SEFAZ.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Carrega nota de exemplo com 1 clique
  const handleLoadSample = (sample: (typeof SAMPLE_NFCES)[0]) => {
    setInputUrl(sample.url)
    setIsProcessing(true)
    setTimeout(() => {
      const data = parseNfceHtml(sample.html, sample.url)
      setParsedNfce(data)
      addPoints(data.pontosCalculados, data.emitente.razaoSocial)
      setIsProcessing(false)
      toast.success(
        `NFC-e de ${sample.store} validada! +${data.pontosCalculados} pontos creditados! 🎉`
      )
    }, 450)
  }

  // Cópia da chave de 44 dígitos para a área de transferência
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(true)
    toast.success('Chave de acesso copiada para a área de transferência!')
    setTimeout(() => setCopiedKey(false), 2500)
  }

  // Leitor de imagem do QR Code
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    toast.info('Processando imagem do QR Code...')
    // Simula leitura de imagem e carrega o primeiro cupom da SEFAZ SC
    setTimeout(() => {
      const sample = SAMPLE_NFCES[0]
      setInputUrl(sample.url)
      handleLoadSample(sample)
    }, 600)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header com Design System */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Módulo Fiscal NFC-e • hugobatista27/web-scrap-app
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">SEFAZ SC & PR Homologadas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Validação de QR Code & Cupom Fiscal
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Valide a autenticidade das suas notas fiscais, inspecione os itens comprados e converta
            o valor em pontos de cashback.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'scan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Receipt size={16} />
            <span>Validar NFC-e</span>
          </button>
          <button
            onClick={() => setActiveTab('show')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'show'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <QrCode size={16} />
            <span>Meu QR Balcão</span>
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="space-y-8">
          {/* Card Principal de Validação de URL / Chave */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Formulário de Leitura */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">URL ou Chave da NFC-e</h2>
                      <p className="text-xs text-gray-500">
                        Cole a URL extraída do QR Code da SEFAZ ou os 44 dígitos da chave de acesso
                      </p>
                    </div>
                  </div>

                  {/* Botão de Upload de Foto/Imagem */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold cursor-pointer transition-all"
                      title="Fazer upload de imagem do QR Code"
                    >
                      <Camera size={14} />
                      <span className="hidden sm:inline">Carregar QR</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleProcessInput} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      URL da SEFAZ ou Chave de Acesso (44 dígitos)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Ex: https://sat.sef.sc.gov.br/nfce/consulta?p=422609... ou 422609..."
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full px-4 py-3 text-sm font-mono tracking-wider rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-hidden transition-all bg-gray-50/50"
                      />
                      {inputUrl && (
                        <button
                          type="button"
                          onClick={() => setInputUrl('')}
                          className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          Limpar
                        </button>
                      )}
                    </div>

                    {/* Feedback Visual Instantâneo de Validação */}
                    {inputUrl.trim() && (
                      <div className="mt-2 text-xs flex flex-col gap-1">
                        {liveValidation?.isAllowed ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={14} />
                            <span>
                              Portal Homologado SEFAZ {liveValidation.uf} detectado!{' '}
                              {extractedKey
                                ? `Chave válida (${extractedKey.length} dígitos)`
                                : 'Aguardando chave'}
                            </span>
                          </div>
                        ) : liveValidation?.isValid && !liveValidation?.isAllowed ? (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle size={14} />
                            <span>{liveValidation.reason}</span>
                          </div>
                        ) : extractedKey &&
                          (extractedKey.startsWith('42') || extractedKey.startsWith('41')) ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={14} />
                            <span>
                              Chave de 44 dígitos de{' '}
                              {extractedKey.startsWith('42')
                                ? 'Santa Catarina (SC)'
                                : 'Paraná (PR)'}{' '}
                              válida!
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle size={14} />
                            <span>
                              {liveValidation?.reason ||
                                'Chave ou URL inválida. Utilize links da SEFAZ SC ou PR.'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 cursor-pointer disabled:opacity-70 transition-all"
                    style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Validando junto à SEFAZ e extraindo itens...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Validar NFC-e e Acumular Pontos</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Botões de Demonstração Rápida com Notas Reais */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
                <div className="mb-4">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                    Cupons de Teste Prontos para Simulação
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    Experimente o parser com cupons homologados de SC e PR:
                  </h3>
                  <p className="text-xs text-gray-500">
                    Clique em qualquer cupom abaixo para testar a extração completa de produtos,
                    CNPJ e cômputo:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SAMPLE_NFCES.map((note) => (
                    <button
                      key={note.key}
                      onClick={() => handleLoadSample(note)}
                      disabled={isProcessing}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-gray-400">
                            SEFAZ {note.uf}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            1 pt = R$ 1,00
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 line-clamp-1">
                          {note.store}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{note.cnpj}</p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                        <span>Testar Cupom</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna 3: Regras Fiscais do Sistema */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Regras de Validação Fiscal</h3>
                </div>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      RN01 • Tempo de Emissão
                    </span>
                    Notas fiscais emitidas há mais de 48 horas são rejeitadas sumariamente para
                    prevenir fraudes.
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      RN02 • Chave Única de 44 Dígitos
                    </span>
                    Cada nota só pode ser computada uma única vez em toda a plataforma.
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      RN07 • Jurisdição SC e PR
                    </span>
                    O MVP aceita QR Codes emitidos pela SEFAZ Santa Catarina (sat.sef.sc.gov.br) e
                    Paraná (fazenda.pr.gov.br).
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">
                      RN03 • Cômputo via CNPJ
                    </span>
                    Os pontos são creditados na loja parceira correspondente ao CNPJ da nota fiscal.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Exibição de Resultado Detalhado (Parser Style do hugobatista27/web-scrap-app) */}
          {parsedNfce && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-md animate-fade-in space-y-6">
              {/* Banner de Sucesso */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      NFC-e Processada com Sucesso
                    </span>
                    <h3 className="text-xl font-black text-gray-900 mt-0.5">
                      {parsedNfce.emitente.razaoSocial}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      CNPJ: {parsedNfce.emitente.cnpj} • SEFAZ {parsedNfce.info.uf}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-right">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Pontos Conquistados
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-800">
                      +{parsedNfce.pontosCalculados} pts
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-2xl text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Valor a Pagar
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900">
                      {formatCurrency(parsedNfce.totais.valorPagar)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabela Sanfonada com Detalhamento de Itens */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Receipt size={16} className="text-emerald-700" />
                    <span>Itens Extraídos da NFC-e ({parsedNfce.itens.length})</span>
                  </h4>
                  <button
                    onClick={() => setShowItemsList(!showItemsList)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showItemsList ? 'Recolher' : 'Expandir'}</span>
                    {showItemsList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {showItemsList && (
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <tr>
                          <th className="py-2.5 px-3">Cód</th>
                          <th className="py-2.5 px-3">Descrição do Produto</th>
                          <th className="py-2.5 px-3 text-center">Qtd</th>
                          <th className="py-2.5 px-3 text-right">Vl. Unitário</th>
                          <th className="py-2.5 px-3 text-right">Vl. Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedNfce.itens.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60">
                            <td className="py-2.5 px-3 font-mono text-gray-400">{item.codigo}</td>
                            <td className="py-2.5 px-3 font-semibold text-gray-800">
                              {item.descricao}
                            </td>
                            <td className="py-2.5 px-3 text-center text-gray-600">
                              {item.quantidade} {item.unidade}
                            </td>
                            <td className="py-2.5 px-3 text-right text-gray-600">
                              {formatCurrency(item.valorUnitario)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {formatCurrency(item.valorTotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Informações Fiscais Adicionais (Chave de 44 dígitos com botão de cópia) */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
                    Chave de Acesso da NFC-e (RN02)
                  </span>
                  <span className="font-mono text-gray-800 font-semibold break-all text-[11px]">
                    {parsedNfce.info.chaveAcesso}
                  </span>
                </div>

                <button
                  onClick={() => handleCopyKey(parsedNfce.info.chaveAcesso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold cursor-pointer shrink-0"
                >
                  {copiedKey ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>{copiedKey ? 'Copiada!' : 'Copiar Chave'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Aba 2: Meu QR Code Pessoal no Balcão */
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xs text-center space-y-6">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              Identificação no Balcão
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-2">Apresente seu QR Code</h2>
            <p className="text-xs text-gray-500 mt-1">
              O operador de caixa escaneará seu código para vincular a compra à sua conta Cash Me.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex justify-center">
            <QRCodeVetorial tamanho={200} />
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <span className="font-bold text-gray-800 block">ID: CM-LEANDRO-9821</span>
            <span>Código renovado a cada sessão para sua segurança.</span>
          </div>
        </div>
      )}
    </div>
  )
}
