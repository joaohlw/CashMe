import { P } from '@/constants/theme'

export interface ChaveAlternadoraProps {
  /** Estado de ligado/desligado */
  ativo: boolean
  /** Função disparada na alteração de estado */
  aoAlternar: () => void
  /** Cor do botão quando ativo */
  corDestaque?: string
}

/**
 * Chave alternadora animada estilo Switch iOS
 */
export function ChaveAlternadora({ ativo, aoAlternar, corDestaque = P }: ChaveAlternadoraProps) {
  return (
    <button
      onClick={aoAlternar}
      aria-checked={ativo}
      role="switch"
      className="w-12 h-7 rounded-full border-none relative cursor-pointer shrink-0 transition-colors duration-200 focus:outline-none"
      style={{
        background: ativo ? corDestaque : '#D1D5DB',
      }}
    >
      <div
        className={`absolute w-[22px] h-[22px] rounded-full bg-white top-[3px] shadow-sm transition-all duration-200 ${
          ativo ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </button>
  )
}

// Alias para compatibilidade
export const SwitchToggle = ({
  on,
  onChange,
  color = P,
}: {
  on: boolean
  onChange: () => void
  color?: string
}) => <ChaveAlternadora ativo={on} aoAlternar={onChange} corDestaque={color} />
