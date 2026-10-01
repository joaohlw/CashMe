import { useState } from 'react'
import {
  User,
  Store,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Coins,
} from 'lucide-react'
import { G, GD, P, PD } from '@/constants/theme'
import type { AppMode } from '@/types/navigation'
import { useAuth } from '@/context/AuthContext'
import { AuthModal } from '@/components/layout/AuthModal'

interface LandingScreenProps {
  onSelect: (m: AppMode) => void
}

export function LandingScreen({ onSelect }: LandingScreenProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  return (
    <div className="w-full bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-200/20 blur-3xl -z-10 pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-4 shadow-2xs">
          <Sparkles size={13} className="text-emerald-600" />
          <span>Plataforma Oficial de Fidelidade & NFC-e (SC & PR)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
          O cashback que valoriza o{' '}
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            comércio local
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
          Escaneie o QR Code das suas notas fiscais de compras diárias, acumule pontos automáticos e
          resgate recompensas nas lojas parceiras.
        </p>

        {/* Selection Cards (Compact & Beautiful) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
          <button
            onClick={() => onSelect('consumer')}
            className="p-4 rounded-2xl text-white shadow-md shadow-emerald-700/15 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer text-left flex items-center justify-between group"
            style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Sou Consumidor</h3>
                <p className="text-[11px] text-emerald-100 mt-0.5">Acumule e resgate pontos</p>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-white/80 group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={() => onSelect('merchant')}
            className="p-4 rounded-2xl text-white shadow-md shadow-purple-700/15 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer text-left flex items-center justify-between group"
            style={{ background: `linear-gradient(135deg, ${P}, ${PD})` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Store size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Sou Lojista</h3>
                <p className="text-[11px] text-purple-100 mt-0.5">Gerencie vendas e fidelidade</p>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-white/80 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* User Session Bar or Auth Triggers */}
        {isAuthenticated && user ? (
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-600">
              Conectado como{' '}
              <strong className="text-gray-900">{user.fullName || user.email}</strong>
            </span>
            <button
              onClick={() => logout()}
              className="text-xs text-red-600 font-bold hover:underline cursor-pointer ml-1"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Já tem conta?</span>
            <button
              onClick={() => openAuth('login')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Entrar
            </button>
            <span>•</span>
            <button
              onClick={() => openAuth('signup')}
              className="text-gray-700 font-bold hover:underline cursor-pointer"
            >
              Cadastrar-se
            </button>
          </div>
        )}
      </section>

      {/* 3 Steps (Compact & Refined) */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Como funciona o Cash Me</h2>
            <p className="text-xs text-gray-400 mt-1">Simples, automático e sem cartões físicos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Compre no Parceiro</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Faça compras nos estabelecimentos locais credenciados e receba seu cupom NFC-e.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Escaneie o Cupom</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Aponte a câmera ou digite a chave de 44 dígitos para validação direta na SEFAZ.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Resgate Vantagens</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Seus pontos viram descontos imediatos e prêmios exclusivos na vitrine da loja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Bar (Delicate & Clean) */}
      <section className="py-8 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <ShieldCheck size={20} className="mx-auto text-emerald-600 mb-1" />
              <h4 className="font-bold text-gray-800">Anti-Fraude 44 Dígitos</h4>
              <p className="text-[10px] text-gray-400">Validação única na SEFAZ</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <QrCode size={20} className="mx-auto text-emerald-600 mb-1" />
              <h4 className="font-bold text-gray-800">SEFAZ SC & PR</h4>
              <p className="text-[10px] text-gray-400">Notas fiscais homologadas</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <TrendingUp size={20} className="mx-auto text-purple-600 mb-1" />
              <h4 className="font-bold text-gray-800">Regra Customizável</h4>
              <p className="text-[10px] text-gray-400">Lojista define seu fator</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200/60 shadow-2xs">
              <Coins size={20} className="mx-auto text-emerald-600 mb-1" />
              <h4 className="font-bold text-gray-800">Saldo Vitalício</h4>
              <p className="text-[10px] text-gray-400">Proteção ao consumidor (RN05)</p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </div>
  )
}
