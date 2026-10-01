import { useState } from 'react'
import { Search, MapPin, Star, ArrowRight, Store as StoreIconLucide } from 'lucide-react'
import { stores } from '@/data/mocks'
import type { ConsumerScreen } from '@/types/navigation'

interface StoresScreenProps {
  back: () => void
  go: (s: ConsumerScreen) => void
}

export function StoresScreen({ back, go }: StoresScreenProps) {
  const [filter, setFilter] = useState('Todas')
  const [search, setSearch] = useState('')
  const categories = ['Todas', 'Padaria', 'Farmácia', 'Moda', 'Pet Shop', 'Mercado']

  const filteredStores = stores.filter((s) => {
    const matchCat = filter === 'Todas' || s.cat.toLowerCase().includes(filter.toLowerCase())
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.cat.toLowerCase().includes(search.toLowerCase()) ||
      s.loc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            Rede Credenciada
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Lojas Parceiras
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Encontre comércios locais participantes do programa Cash Me perto de você.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/60">
          <StoreIconLucide size={16} />
          <span>{filteredStores.length} estabelecimentos encontrados</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome da loja, categoria ou bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-hidden transition-all bg-gray-50/50 text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((s) => (
          <div
            key={s.id}
            onClick={() => go('store-detail')}
            className="group bg-white rounded-3xl border border-gray-200/80 p-6 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {s.cat}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                {s.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                <MapPin size={14} className="text-gray-400" />
                <span>{s.loc}</span>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-100/80">
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block">
                  Regra de Pontuação (RN04)
                </span>
                <p className="text-xs font-bold text-emerald-900 mt-0.5">{s.rule}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Seus pontos acumulados</span>
                <span className="text-sm font-bold text-gray-900">{s.pts} pts</span>
              </div>

              <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Ver Loja <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
