import { useState } from 'react'
import { X, Mail, Lock, User, LogIn, ArrowRight, Store, Sparkles, ShieldCheck } from 'lucide-react'
import { G, GD } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login, signupCustomer, signupEstablishment } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'ESTABLISHMENT'>('CUSTOMER')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (mode === 'login') {
      const ok = await login({ email, password })
      if (ok) onClose()
    } else {
      if (userRole === 'CUSTOMER') {
        const ok = await signupCustomer({
          fullName,
          email,
          password,
          passwordConfirmation: password,
          cpf: cpf.replace(/\D/g, '') || undefined,
          phone: phone || undefined,
          termsAccepted: true,
        })
        if (ok) onClose()
      } else {
        const ok = await signupEstablishment({
          fullName,
          email,
          password,
          passwordConfirmation: password,
          role: 'LOJISTA_ADMIN',
        })
        if (ok) onClose()
      }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-gray-100 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-md shadow-emerald-500/20"
            style={{
              background:
                userRole === 'CUSTOMER'
                  ? `linear-gradient(135deg, ${G}, ${GD})`
                  : 'linear-gradient(135deg, #6F35B5, #4A1D80)',
            }}
          >
            {userRole === 'CUSTOMER' ? (
              <LogIn size={22} className="text-white" />
            ) : (
              <Store size={22} className="text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'login' ? 'Acesse sua conta' : 'Criar nova conta'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Conectado diretamente à API oficial do Cash Me
          </p>
        </div>

        {/* Tab Switcher (Login vs Cadastrar) */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Seletor de Perfil no Cadastro */}
        {mode === 'signup' && (
          <div className="mb-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 text-center">
              Tipo de Perfil
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/80">
              <button
                type="button"
                onClick={() => setUserRole('CUSTOMER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'CUSTOMER'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <Sparkles size={14} />
                <span>Sou Consumidor</span>
              </button>
              <button
                type="button"
                onClick={() => setUserRole('ESTABLISHMENT')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  userRole === 'ESTABLISHMENT'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60'
                }`}
              >
                <Store size={14} />
                <span>Sou Lojista</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  {userRole === 'CUSTOMER' ? 'Nome Completo' : 'Nome do Responsável / Loja'}
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder={
                      userRole === 'CUSTOMER' ? 'Ex: Maria Silva' : 'Ex: Padaria Bella Vista'
                    }
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm outline-hidden text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {userRole === 'CUSTOMER' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    CPF (Opcional)
                  </label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
                    <ShieldCheck size={18} className="text-gray-400" />
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full text-sm outline-hidden text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              E-mail
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm outline-hidden text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Senha
            </label>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition-all">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm outline-hidden text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70 mt-2"
            style={{
              background:
                userRole === 'ESTABLISHMENT' && mode === 'signup'
                  ? 'linear-gradient(135deg, #6F35B5, #4A1D80)'
                  : `linear-gradient(135deg, ${G}, ${GD})`,
            }}
          >
            {loading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar na Conta'
                : userRole === 'CUSTOMER'
                  ? 'Criar Conta Consumidor'
                  : 'Cadastrar Meu Estabelecimento'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  )
}
