import type { ComponentType } from 'react'
import { BD } from '@/constants/theme'

export interface ItemAbaNavegacao {
  id: string
  label: string
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
}

export interface BarraNavegacaoProps {
  abas: ItemAbaNavegacao[]
  abaAtiva: string
  aoMudarAba: (id: string) => void
  corDestaque: string
}

/**
 * Barra inferior de navegação móvel (Bottom Navigation Bar)
 */
export function BarraNavegacao({ abas, abaAtiva, aoMudarAba, corDestaque }: BarraNavegacaoProps) {
  return (
    <nav className="h-[76px] border-t border-gray-200 flex bg-white shrink-0 items-center justify-around z-30">
      {abas.map((aba) => {
        const ativo = aba.id === abaAtiva
        return (
          <button
            key={aba.id}
            onClick={() => aoMudarAba(aba.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 border-none bg-transparent cursor-pointer py-2 transition-colors"
          >
            <aba.Icon
              size={22}
              color={ativo ? corDestaque : '#9CA3AF'}
              strokeWidth={ativo ? 2.5 : 1.5}
            />
            <span
              className="text-[10px] tracking-tight"
              style={{
                fontWeight: ativo ? 600 : 400,
                color: ativo ? corDestaque : '#9CA3AF',
              }}
            >
              {aba.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// Alias para compatibilidade
export const BottomNav = ({
  tabs,
  active,
  onChange,
  color,
}: {
  tabs: ItemAbaNavegacao[]
  active: string
  onChange: (id: string) => void
  color: string
}) => <BarraNavegacao abas={tabs} abaAtiva={active} aoMudarAba={onChange} corDestaque={color} />

export type NavTabItem = ItemAbaNavegacao
