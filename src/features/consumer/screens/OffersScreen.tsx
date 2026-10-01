import { useState } from 'react'
import { Tag, Sparkles, Check, ChevronRight, Gift } from 'lucide-react'
import { offers } from '@/data/mocks'
import { useApp } from '@/context/AppContext'
import type { ConsumerScreen } from '@/types/navigation'

interface OffersScreenProps {
  back: () => void
  go: (s: ConsumerScreen) => void
}

export function OffersScreen({ back, go }: OffersScreenProps) {
  const { userPoints, redeemPoints } = useApp()
  const [filter, setFilter] = useState<'all' | 'affordable' | 'high'>('all')

  const filteredOffers = offers.filter((o) => {
    if (filter === 'affordable') return o.pts <= userPoints
    if (filter === 'high') return o.pts > 500
    return true
  })

  const handleRedeem = (o: (typeof offers)[0], e: React.MouseEvent) => {
    e.stopPropagation()
    redeemPoints(o.pts, o.store)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            Recompensas & Benefícios
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Ofertas & Cupons Disponíveis
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Você tem <strong>{userPoints.toLocaleString('pt-BR')} pontos</strong> disponíveis para
            resgatar agora.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Todas ({offers.length})
          </button>
          <button
            onClick={() => setFilter('affordable')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'affordable'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Posso Resgatar Agora 🎯
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((o) => {
          const canAfford = userPoints >= o.pts
          return (
            <div
              key={o.id}
              onClick={() => go('offer-detail')}
              className="group bg-white rounded-3xl border border-gray-200/80 overflow-hidden hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img
                    src={o.img}
                    alt={o.store}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {o.store}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-2xl font-black leading-tight drop-shadow-xs">{o.discount}</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-gray-500">Pontos necessários:</span>
                    <span
                      className={`font-black text-sm px-2.5 py-0.5 rounded-lg ${
                        canAfford ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {o.pts} pts
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">Válido até {o.valid}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={(e) => handleRedeem(o, e)}
                  disabled={!canAfford}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Gift size={16} />
                      <span>Resgatar Cupom</span>
                    </>
                  ) : (
                    <span>Faltam {o.pts - userPoints} pontos</span>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
