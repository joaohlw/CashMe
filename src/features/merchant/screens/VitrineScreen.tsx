import { useState } from 'react'
import { Tag, Plus, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { merchantOffers } from '@/data/mocks'
import type { MerchantScreen } from '@/types/navigation'

interface VitrineScreenProps {
  go: (s: MerchantScreen) => void
}

export function VitrineScreen({ go }: VitrineScreenProps) {
  const [items, setItems] = useState(merchantOffers.map((o) => ({ ...o })))

  const toggleActive = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
            Catálogo de Recompensas
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Vitrine de Cupons & Prêmios
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure quais produtos ou descontos os consumidores podem resgatar usando os pontos da
            sua loja.
          </p>
        </div>

        <button
          onClick={() => go('new-offer')}
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-800/20 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus size={18} />
          <span>Cadastrar Nova Oferta</span>
        </button>
      </div>

      {/* Offers Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-3xl border border-gray-200/80 p-6 hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Tag size={20} />
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleActive(o.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    o.active
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {o.active ? 'Visível na Vitrine' : 'Pausada'}
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{o.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{o.desc}</p>

              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-700 font-semibold">Custo em Pontos:</span>
                  <span className="font-black text-purple-950 text-sm">
                    {o.name.includes('500') ? '500 pts' : '350 pts'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">Validade: {o.valid}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 hover:underline cursor-pointer">
                Editar Detalhes
              </span>
              <button
                onClick={() => toggleActive(o.id)}
                className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                {o.active ? 'Pausar Oferta' : 'Ativar Oferta'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
