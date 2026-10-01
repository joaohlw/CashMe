import { Star, QrCode, ArrowUpRight, ChevronRight, Percent } from 'lucide-react'
import { G, GD, GOLD } from '@/constants/theme'
import { offers, categories, stores } from '@/data/mocks'
import { useApp } from '@/context/AppContext'
import type { ConsumerScreen } from '@/types/navigation'

interface HomeScreenProps {
  go: (s: ConsumerScreen) => void
}

export function HomeScreen({ go }: HomeScreenProps) {
  const { userName, userPoints } = useApp()
  const estimatedCashback = (userPoints * 0.02).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Painel do Consumidor
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">Programa de Fidelidade NFC-e</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Olá, {userName}! 👋
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Acumule pontos em notas fiscais e troque por descontos nas melhores lojas locais.
          </p>
        </div>

        <button
          onClick={() => go('qr-code')}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-[1.02] self-start sm:self-auto"
        >
          <QrCode size={15} />
          <span>Escanear Cupom</span>
        </button>
      </div>

      {/* Hero Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Saldo de Pontos */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden shadow-md shadow-emerald-700/10 flex flex-col justify-between"
          style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                Saldo Disponível
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Star size={15} color={GOLD} fill={GOLD} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                {userPoints.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm font-semibold text-emerald-200">pts</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 mt-1">
              Aprox. <strong className="text-white">{estimatedCashback}</strong> em descontos
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <button
              onClick={() => go('wallet')}
              className="text-xs font-semibold text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              Ver Extrato <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 2: Leitor NFC-e Instantâneo */}
        <div className="rounded-2xl p-5 bg-white border border-gray-200/70 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Pontuar com Cupom
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <QrCode size={15} />
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-0.5">Leu uma nota fiscal hoje?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Notas fiscais de SC e PR acumulam pontos em até 48h da compra.
            </p>
          </div>

          <button
            onClick={() => go('qr-code')}
            className="mt-4 w-full py-2 px-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-gray-100"
          >
            <span>Inserir Chave de 44 Dígitos</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Card 3: Cupons Prontos */}
        <div className="rounded-2xl p-5 bg-white border border-gray-200/70 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Resgates Prontos
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Percent size={15} />
              </div>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-0.5">Cupons disponíveis!</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Com seu saldo de {userPoints} pts, você já pode resgatar ofertas na Padaria e
              Farmácia.
            </p>
          </div>

          <button
            onClick={() => go('offers')}
            className="mt-4 w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-100"
          >
            <span>Ver Vitrine de Recompensas</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Categorias</h2>
            <p className="text-[11px] text-gray-400">
              Explore parceiros por segmento no comércio local
            </p>
          </div>
          <button
            onClick={() => go('categories')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Ver Todas <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => go('stores')}
              className="group flex flex-col items-center p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer bg-gray-50/40 hover:bg-white"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform"
                style={{ background: cat.bg }}
              >
                <cat.Icon size={18} color={cat.color} />
              </div>
              <span className="text-xs font-semibold text-gray-800 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Offers Grid */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Cupons em Destaque</h2>
            <p className="text-[11px] text-gray-400">
              Troque seus pontos acumulados por vantagens na hora
            </p>
          </div>
          <button
            onClick={() => go('offers')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Ver Todos <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <div
              key={o.id}
              onClick={() => go('offer-detail')}
              className="group rounded-xl border border-gray-200/70 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col bg-white"
            >
              <div className="h-36 relative overflow-hidden bg-gray-100">
                <img
                  src={o.img}
                  alt={o.store}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-white/95 text-gray-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    {o.store}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <p className="text-base font-black leading-tight drop-shadow-xs">{o.discount}</p>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Custo:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {o.pts} pts
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-2">
                  <span>Válido até {o.valid}</span>
                  <span className="font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                    Ver cupom <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Stores Grid */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Lojas Parceiras</h2>
            <p className="text-[11px] text-gray-400">
              Onde suas notas fiscais geram pontos garantidos
            </p>
          </div>
          <button
            onClick={() => go('stores')}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Ver Todas <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {stores.map((s) => (
            <div
              key={s.id}
              onClick={() => go('store-detail')}
              className="p-4 rounded-xl border border-gray-200/70 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between bg-white group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-2xs"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {s.cat}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {s.name}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.loc}</p>
                <div className="mt-2.5 p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100/70">
                  <p className="text-[10px] font-bold text-emerald-800">{s.rule}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">Seu saldo:</span>
                <span className="font-bold text-emerald-700">{s.pts} pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
