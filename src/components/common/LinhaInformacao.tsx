import type { ComponentType } from 'react'
import { T1, T2 } from '@/constants/theme'

export interface LinhaInformacaoProps {
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  titulo: string
  valor: string
  corIcone: string
}

/**
 * Linha de exibição de dados com ícone, título e valor
 */
export function LinhaInformacao({ Icon, titulo, valor, corIcone }: LinhaInformacaoProps) {
  return (
    <div className="flex gap-2.5 items-center">
      <Icon size={18} color={corIcone} />
      <div>
        <p className="text-xs font-semibold text-gray-900 mb-0.5">{titulo}</p>
        <p className="text-xs text-gray-500 m-0">{valor}</p>
      </div>
    </div>
  )
}

// Alias para compatibilidade
export const Row = ({
  Icon,
  title,
  val,
  color,
}: {
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>
  title: string
  val: string
  color: string
}) => <LinhaInformacao Icon={Icon} titulo={title} valor={val} corIcone={color} />
