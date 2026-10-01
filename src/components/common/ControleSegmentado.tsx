import { T1, T2 } from '@/constants/theme'

export interface OpcaoAba {
  id: string
  label: string
}

export interface ControleSegmentadoProps {
  abas: OpcaoAba[]
  abaAtiva: string
  aoMudar: (id: string) => void
}

/**
 * Controle segmentado de abas (Segmented Control / Tabs)
 */
export function ControleSegmentado({ abas, abaAtiva, aoMudar }: ControleSegmentadoProps) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mx-4 gap-1">
      {abas.map((aba) => {
        const ativo = abaAtiva === aba.id
        return (
          <button
            key={aba.id}
            onClick={() => aoMudar(aba.id)}
            className={`flex-1 py-2 rounded-lg border-none text-xs font-medium cursor-pointer transition-all duration-200 ${
              ativo
                ? 'bg-white text-gray-900 font-semibold shadow-xs'
                : 'bg-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {aba.label}
          </button>
        )
      })}
    </div>
  )
}

// Alias para compatibilidade
export const SegControl = ({
  tabs,
  active,
  onChange,
}: {
  tabs: OpcaoAba[]
  active: string
  onChange: (id: string) => void
}) => <ControleSegmentado abas={tabs} abaAtiva={active} aoMudar={onChange} />
