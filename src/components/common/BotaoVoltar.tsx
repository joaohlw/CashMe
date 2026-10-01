import { ChevronLeft } from 'lucide-react'
import { T1 } from '@/constants/theme'

export interface BotaoVoltarProps {
  /** Função de callback chamada ao clicar no botão */
  aoVoltar: () => void
  /** Define se o estilo visual é claro ou translúcido/escuro */
  claro?: boolean
}

/**
 * Botão circular de retorno para o topo de telas
 */
export function BotaoVoltar({ aoVoltar, claro = true }: BotaoVoltarProps) {
  return (
    <button
      onClick={aoVoltar}
      aria-label="Voltar"
      className={`w-9 h-9 rounded-full border-none flex items-center justify-center cursor-pointer shrink-0 transition-transform active:scale-95 ${
        claro ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/20 hover:bg-white/30'
      }`}
    >
      <ChevronLeft size={20} color={claro ? T1 : '#fff'} />
    </button>
  )
}

// Alias para compatibilidade
export const BackBtn = ({ onBack, light = true }: { onBack: () => void; light?: boolean }) => (
  <BotaoVoltar aoVoltar={onBack} claro={light} />
)
