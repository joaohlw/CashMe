import {
  Download,
  Printer,
  Share2,
  RefreshCw,
  QrCode,
  Store,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { P, PD } from '@/constants/theme'
import { QRCodeSVG } from '@/components/common'
import { useApp } from '@/context/AppContext'
import { toast } from 'sonner'

export function QRStoreScreen() {
  const { merchantStoreName } = useApp()

  const handleAction = (label: string) => {
    toast.success(`Ação executada: ${label}`)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
            Material de Balcão
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            QR Code Oficial do Estabelecimento
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Imprima ou exiba este QR Code no caixa para que os clientes pontuem mesmo quando não
            levarem o cupom impresso.
          </p>
        </div>

        <button
          onClick={() => handleAction('Imprimir Display de Mesa')}
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-800/20 transition-all cursor-pointer"
        >
          <Printer size={18} />
          <span>Imprimir Display de Caixa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Display Box */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-800 text-xs font-bold rounded-full mb-6">
            <Store size={14} />
            <span>Ponto de Venda Oficial</span>
          </div>

          {/* QR Container */}
          <div className="p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-purple-200 inline-block shadow-inner mb-6">
            <QRCodeSVG size={220} color={P} />
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-black text-gray-900">{merchantStoreName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">CNPJ: 12.345.678/0001-90</p>
              <span className="inline-block mt-2 font-mono text-[11px] text-purple-800 bg-purple-100 px-3 py-1 rounded-full font-bold">
                ID LOJA: #CM-STORE-001
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-sm">
            Compatível com o aplicativo Cash Me e câmeras padrão de smartphones Android e iOS.
          </p>
        </div>

        {/* Actions & Instructions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Ações Rápidas de Exportação</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleAction('Download PNG em Alta Resolução')}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center gap-3 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Download size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Baixar Imagem PNG</h4>
                  <p className="text-[11px] text-gray-500">
                    Alta resolução para adesivos e displays
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleAction('Download PDF Pronto para Impressão')}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center gap-3 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Printer size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Display de Balcão (PDF)</h4>
                  <p className="text-[11px] text-gray-500">Modelo pronto para imprimir e dobrar</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('Link Copiado para Área de Transferência')}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center gap-3 cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Share2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Compartilhar Link</h4>
                  <p className="text-[11px] text-gray-500">Envie por WhatsApp ou Redes Sociais</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Dica de Fidelização no Caixa</span>
            </h4>
            <p className="text-xs text-purple-950 leading-relaxed">
              Oriente os atendentes a dizerem:{' '}
              <em>
                "Quer acumular pontos nesta compra? Aponte a câmera para o QR Code no balcão ou
                escaneie o rodapé da nota fiscal!"
              </em>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
