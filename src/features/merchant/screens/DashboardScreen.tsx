import { useState } from 'react'
import {
  TrendingUp,
  Users,
  Star,
  Gift,
  Megaphone,
  QrCode,
  Sliders,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { P } from '@/constants/theme'
import { chartData } from '@/data/mocks'
import { useApp } from '@/context/AppContext'
import type { MerchantScreen } from '@/types/navigation'

interface DashboardScreenProps {
  go: (s: MerchantScreen) => void
}

export function DashboardScreen({ go }: DashboardScreenProps) {
  const { merchantStoreName } = useApp()
  const [period, setPeriod] = useState<'7D' | '30D' | '90D'>('7D')

  const recentTransactions = [
    {
      id: 1,
      client: 'Mariana Souza',
      time: 'Há 12 min',
      value: 'R$ 84,50',
      pts: '+84 pts',
      status: 'Confirmado',
    },
    {
      id: 2,
      client: 'Lucas Almeida',
      time: 'Há 45 min',
      value: 'R$ 152,00',
      pts: '+152 pts',
      status: 'Confirmado',
    },
    {
      id: 3,
      client: 'Carla Mendes',
      time: 'Há 2h',
      value: 'R$ 38,00',
      pts: '-500 pts',
      status: 'Resgate Cupom',
    },
    {
      id: 4,
      client: 'Roberto Dias',
      time: 'Há 3h',
      value: 'R$ 210,00',
      pts: '+210 pts',
      status: 'Confirmado',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Store Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
              Painel do Estabelecimento
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">CNPJ Homologado SEFAZ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {merchantStoreName}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Visão consolidada de faturamento, emissão de pontos e engajamento da base fidelizada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => go('new-campaign')}
            className="flex items-center gap-1.5 bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Megaphone size={14} />
            <span>Criar Campanha</span>
          </button>
          <button
            onClick={() => go('qr-store')}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <QrCode size={14} />
            <span>QR Balcão</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Vendas no Mês
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">R$ 18.520</span>
            <span className="text-xs font-semibold text-gray-400">,00</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <TrendingUp size={13} />
            <span>+14.8% este mês</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Pontos Emitidos
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">12.450</span>
            <span className="text-xs font-semibold text-gray-400">pts</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium">Regra: R$ 1,00 = 1 pt</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Clientes Fidelizados
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">243</span>
            <span className="text-xs font-semibold text-gray-400">ativos</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 size={13} />
            <span>+18 novos clientes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Resgates de Cupons
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Gift size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">320</span>
            <span className="text-xs font-semibold text-gray-400">resgates</span>
          </div>
          <div className="mt-2 text-[11px] text-purple-700 font-semibold">Taxa de retorno: 68%</div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/70 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Evolução de Faturamento e Pontos</h2>
            <p className="text-[11px] text-gray-400">
              Curva de pontuação gerada pelos consumidores da sua loja
            </p>
          </div>

          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
            {(['7D', '30D', '90D'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  period === p
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {p === '7D' ? '7 dias' : p === '30D' ? '30 dias' : '3 meses'}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={P} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={P} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="d"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                tickFormatter={(val) => `${val} pts`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                formatter={(value: any) => [`${value} pontos`, 'Desempenho']}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={P}
                strokeWidth={2.5}
                fill="url(#purpleGradient)"
                activeDot={{ r: 5, fill: P, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Action Shortcuts & Recent Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Quick Actions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-0.5">Ações Rápidas</h3>
            <p className="text-[11px] text-gray-400 mb-4">Parâmetros da loja</p>

            <div className="space-y-2.5">
              <button
                onClick={() => go('scoring-rules')}
                className="w-full p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Sliders size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-900">
                      Regra de Pontuação (RN04)
                    </h4>
                    <p className="text-[10px] text-gray-400">R$ 1,00 = 1 Ponto</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-purple-800" />
              </button>

              <button
                onClick={() => go('vitrine')}
                className="w-full p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Gift size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-900">
                      Vitrine de Prêmios
                    </h4>
                    <p className="text-[10px] text-gray-400">Gerenciar cupons</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-purple-800" />
              </button>

              <button
                onClick={() => go('customers')}
                className="w-full p-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-900">
                      Clientes (RN08)
                    </h4>
                    <p className="text-[10px] text-gray-400">Consultar histórico</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gray-400 group-hover:text-purple-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Movimentações Recentes</h3>
              <p className="text-[11px] text-gray-400">Leituras de NFC-e e resgates de hoje</p>
            </div>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full">
              4 operações
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="pb-2.5">Cliente</th>
                  <th className="pb-2.5">Horário</th>
                  <th className="pb-2.5">Valor</th>
                  <th className="pb-2.5">Pontos</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold">
                        {tx.client.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{tx.client}</span>
                    </td>
                    <td className="py-2.5 text-gray-400">{tx.time}</td>
                    <td className="py-2.5 font-semibold text-gray-800">{tx.value}</td>
                    <td
                      className={`py-2.5 font-bold ${tx.pts.includes('-') ? 'text-red-600' : 'text-emerald-700'}`}
                    >
                      {tx.pts}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.status.includes('Resgate')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
