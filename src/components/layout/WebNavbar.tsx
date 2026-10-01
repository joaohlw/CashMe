import { useState } from 'react'
import { ShoppingBag, Star, User, Store, LogOut, LogIn, ChevronDown } from 'lucide-react'
import { G, GD, GOLD } from '@/constants/theme'
import type { AppMode } from '@/types/navigation'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { AuthModal } from './AuthModal'

interface WebNavbarProps {
  mode: AppMode
  onSelectMode: (mode: AppMode) => void
}

export function WebNavbar({ mode, onSelectMode }: WebNavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { userPoints, merchantStoreName } = useApp()
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const displayName = user?.fullName || 'Leandro Bona'
  const displayEmail = user?.email || 'leandro.bona@email.com'
  const displayInitials = user?.initials || displayName.slice(0, 2).toUpperCase()

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => onSelectMode('landing')}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs"
              style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
            >
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black tracking-tight text-gray-900 leading-none">
                cash<span className="text-emerald-600">me</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200/60">
                NFC-e
              </span>
            </div>
          </div>

          {/* Center: Mode Switcher (Compact & Subtle) */}
          <div className="hidden md:flex items-center bg-gray-100/90 p-0.5 rounded-full border border-gray-200/70">
            <button
              onClick={() => onSelectMode('consumer')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'consumer'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <User size={13} />
              Consumidor
            </button>
            <button
              onClick={() => onSelectMode('merchant')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'merchant'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Store size={13} />
              Comerciante
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Consumer Points Pill */}
            {mode === 'consumer' && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-800">
                <Star size={12} color={GOLD} fill={GOLD} />
                <span>{userPoints.toLocaleString('pt-BR')} pts</span>
              </div>
            )}

            {/* Merchant Store Badge */}
            {mode === 'merchant' && (
              <div className="hidden sm:flex items-center gap-1.5 bg-purple-50 border border-purple-200/60 px-2.5 py-1 rounded-full text-xs font-bold text-purple-900">
                <Store size={12} className="text-purple-700" />
                <span className="truncate max-w-[120px]">{merchantStoreName}</span>
              </div>
            )}

            {/* User Profile / Auth Action */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                    {displayInitials}
                  </div>
                  <span className="hidden lg:inline-block text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                    {displayName.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 leading-tight">{displayName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{displayEmail}</p>
                    </div>
                    <button
                      onClick={() => {
                        onSelectMode('consumer')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User size={13} />
                      Área do Consumidor
                    </button>
                    <button
                      onClick={() => {
                        onSelectMode('merchant')
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Store size={13} />
                      Área do Lojista
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-3.5 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <LogOut size={13} />
                      Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
              >
                <LogIn size={13} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Switcher Bar */}
        <div className="flex md:hidden border-t border-gray-100 px-4 py-1.5 bg-gray-50/80 justify-around text-xs">
          <button
            onClick={() => onSelectMode('consumer')}
            className={`flex items-center gap-1 font-semibold px-3 py-1 rounded-full ${
              mode === 'consumer' ? 'bg-emerald-600 text-white' : 'text-gray-600'
            }`}
          >
            <User size={12} /> Consumidor
          </button>
          <button
            onClick={() => onSelectMode('merchant')}
            className={`flex items-center gap-1 font-semibold px-3 py-1 rounded-full ${
              mode === 'merchant' ? 'bg-purple-800 text-white' : 'text-gray-600'
            }`}
          >
            <Store size={12} /> Comerciante
          </button>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  )
}
