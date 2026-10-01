import { Plus, Star, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import type { MerchantScreen } from '@/types/navigation'

interface CampaignsScreenProps {
  go: (s: MerchantScreen) => void
}

export function CampaignsScreen({ go }: CampaignsScreenProps) {
  const campaigns = [
    {
      id: 1,
      name: 'Campanha Padrão de Fidelidade',
      desc: 'Pontuação contínua para todas as notas fiscais emitidas no balcão.',
      period: 'Permanente',
      rule: '1 pt a cada R$ 1,00',
      active: true,
      totalEmitted: '8.450 pts',
    },
    {
      id: 2,
      name: 'Bônus Aniversário do Estabelecimento',
      desc: 'Pontuação em dobro para incentivar vendas de celebração da loja.',
      period: '01/07 – 31/07/2026',
      rule: '2 pts a cada R$ 1,00',
      active: false,
      totalEmitted: '3.200 pts',
    },
    {
      id: 3,
      name: 'Festival de Inverno',
      desc: 'Campanha sazonal com cupons exclusivos de bebidas quentes e sopas.',
      period: '01/06 – 30/06/2026',
      rule: '1.5 pts a cada R$ 1,00',
      active: false,
      totalEmitted: '1.800 pts',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold uppercase tracking-wider">
            Gestão de Fidelidade
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Campanhas Promocionais
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Crie incentivos temporários de pontos em dobro ou bônus sazonais para aumentar seu
            ticket médio.
          </p>
        </div>

        <button
          onClick={() => go('new-campaign')}
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-800/20 transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus size={18} />
          <span>Criar Nova Campanha</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-gray-200/80 p-6 hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    c.active
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.active ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  {c.active ? 'Ativa' : 'Pausada / Encerrada'}
                </span>

                <span className="text-xs text-gray-400 font-medium">{c.totalEmitted} emitidos</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{c.desc}</p>

              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 mb-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <Star size={14} className="text-purple-700" />
                  <span>Regra: {c.rule}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-purple-700">
                  <Calendar size={13} />
                  <span>Vigência: {c.period}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => go('scoring-rules')}
                className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Regras
              </button>
              <button
                onClick={() => go('points-conversion')}
                className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Conversão
              </button>
              <button
                onClick={() => go('new-campaign')}
                className="py-2 px-4 bg-purple-800 hover:bg-purple-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
