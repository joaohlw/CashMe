import { ShoppingBag, ShieldCheck } from 'lucide-react'
import { G, GD } from '@/constants/theme'

export function WebFooter() {
  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200/60 py-4 mt-auto text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shadow-xs"
            style={{ background: `linear-gradient(135deg, ${G}, ${GD})` }}
          >
            <ShoppingBag size={11} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">
            cash<span className="text-emerald-600">me</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-[11px] text-gray-400">© 2026 Cash Me Tecnologia</span>
        </div>

        {/* Center: Homologation Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-[10px] font-semibold text-emerald-800">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>NFC-e Homologada SEFAZ (SC & PR)</span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacidade</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">
            Termos de Uso
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            API v1 Online
          </span>
        </div>
      </div>
    </footer>
  )
}
