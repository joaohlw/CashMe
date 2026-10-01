import { useState } from 'react'
import { Search, Users, ShieldCheck, ChevronRight, ArrowUpRight } from 'lucide-react'
import { customers } from '@/data/mocks'
import type { MerchantScreen } from '@/types/navigation'

interface CustomersScreenProps {
  go: (s: MerchantScreen) => void
}

export function CustomersScreen({ go }: CustomersScreenProps) {
  const [search, setSearch] = useState('')

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
            Privacidade & Conformidade (RN08)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Base de Clientes Fidelizados
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Consumidores que realizaram compras e acumularam pontos no seu estabelecimento.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200">
          <Users size={16} />
          <span>{filtered.length} clientes na base</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/10 outline-hidden transition-all bg-gray-50/50 text-gray-900"
          />
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="pb-4">Cliente</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Última Compra</th>
                <th className="pb-4">Volume Total de Compras</th>
                <th className="pb-4">Saldo em Loja</th>
                <th className="pb-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => go('customer-detail')}
                  className="hover:bg-purple-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center justify-center text-xs shadow-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block group-hover:text-purple-900 transition-colors">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-gray-400">ID: #{1000 + c.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        c.active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="py-4 text-gray-600 font-medium">{c.last}</td>
                  <td className="py-4 font-bold text-gray-900">{c.purchases}</td>
                  <td className="py-4">
                    <span className="text-sm font-black text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg">
                      {c.pts} pts
                    </span>
                  </td>

                  <td className="py-4 text-right">
                    <button className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1">
                      Ver Perfil <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
