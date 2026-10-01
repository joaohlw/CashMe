import { BD, T1 } from '@/constants/theme'

export interface CampoFormularioProps {
  rotulo: string
  marcador: string
}

/**
 * Campo visual de formulário estático para protótipos
 */
export function CampoFormulario({ rotulo, marcador }: CampoFormularioProps) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
      <label className="text-xs font-semibold text-gray-900 block mb-2">{rotulo}</label>
      <div className="bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-3">
        <span className="text-sm text-gray-400">{marcador}</span>
      </div>
    </div>
  )
}

// Alias para compatibilidade
export const FormField = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <CampoFormulario rotulo={label} marcador={placeholder} />
)
