import { useState } from 'react'
import {
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Store as StoreIconLucide,
  Calendar,
  Wallet as WalletIcon,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { G, GD, GOLD } from '@/constants/theme'
import { stores, history } from '@/data/mocks'
import { useApp } from '@/context/AppContext'

interface WalletScreenProps {
  back: () => void
}

export function WalletScreen({ back }: WalletScreenProps) {
  const { userPoints } = useApp()
  const [viewTab, setViewTab] = useState<'stores' | 'history'>('stores')

  const estimatedValue = (userPoints * 0.02).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            Carteira Digital
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Meus Pontos & Extrato
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Acompanhe seu saldo acumulado por estabelecimento e o histórico de resgates.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setViewTab('stores')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewTab === 'stores'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Saldos por Estabelecimento
          </button>
          <button
            onClick={() => setViewTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewTab === 'history'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Extrato de Movimentações
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div
        className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-700/20"
        style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
      >
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Saldo Global Unificado (Conta Global)
              </span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                RN05 Ativo
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight">
                {userPoints.toLocaleString('pt-BR')}
              </span>
              <span className="text-2xl font-bold text-emerald-200">pts</span>
            </div>
            <p className="text-sm text-emerald-100/90 mt-2">
              Equivale a <strong className="text-white text-base">{estimatedValue}</strong> em
              cupons e vantagens diretas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-xs text-emerald-100 block">Total Economizado</span>
              <span className="text-lg font-bold text-white">R$ 142,50</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-xs text-emerald-100 block">Lojas com Saldo</span>
              <span className="text-lg font-bold text-white">{stores.length} lojas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on Tab */}
      {viewTab === 'stores' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Pontuação Segregada por Loja (Isolamento Multi-Tenant)
            </h2>
            <span className="text-xs text-gray-400">
              Regra oficial: cada loja mantém seu próprio saldo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((s) => {
              const progress = Math.min((s.pts / 1000) * 100, 100)
              return (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-gray-900">{s.name}</h3>
                          <span className="text-xs text-gray-400">{s.cat}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">Saldo disponível:</span>
                      <span className="text-2xl font-black text-emerald-700">{s.pts} pts</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-2">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {1000 - s.pts > 0
                        ? `Faltam ${1000 - s.pts} pts para o próximo voucher de R$ 20,00`
                        : 'Pronto para resgatar voucher!'}
                    </span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-700">{s.rule}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* History Table */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Extrato Transacional Completo</h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {history.length} transações registradas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Estabelecimento</th>
                  <th className="pb-3">Data</th>
                  <th className="pb-3">Valor da Compra</th>
                  <th className="pb-3">Pontos</th>
                  <th className="pb-3 text-right">Saldo Resultante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-2 font-bold">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            h.type === 'earn'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {h.type === 'earn' ? (
                            <ArrowUpRight size={16} />
                          ) : (
                            <ArrowDownLeft size={16} />
                          )}
                        </div>
                        <span className={h.type === 'earn' ? 'text-emerald-800' : 'text-red-800'}>
                          {h.type === 'earn' ? 'Acúmulo NFC-e' : 'Resgate Cupom'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-gray-900">{h.store}</td>
                    <td className="py-4 text-gray-500">{h.date}</td>
                    <td className="py-4 font-semibold text-gray-800">{h.value}</td>
                    <td
                      className={`py-4 font-black text-sm ${h.type === 'earn' ? 'text-emerald-700' : 'text-red-600'}`}
                    >
                      {h.pts}
                    </td>
                    <td className="py-4 text-right font-bold text-gray-900">{h.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
