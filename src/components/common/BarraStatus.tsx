import { T1 } from '@/constants/theme'

export interface BarraStatusProps {
  /** Modo claro (texto escuro) ou escuro (texto branco) */
  claro?: boolean
}

/**
 * Barra superior de status do celular (Hora, Sinal de Rede, Wi-Fi e Bateria)
 */
export function BarraStatus({ claro = true }: BarraStatusProps) {
  const cor = claro ? T1 : '#fff'
  return (
    <div className="h-11 flex items-center justify-between px-5 shrink-0 select-none">
      <span className="text-sm font-semibold tracking-tight" style={{ color: cor }}>
        9:41
      </span>
      <div className="flex gap-1.5 items-center">
        <div className="flex gap-0.5 items-end h-3">
          {[3, 5, 7, 9].map((altura, i) => (
            <div
              key={i}
              className="w-[3px] rounded-xs"
              style={{
                height: altura,
                background: cor,
                opacity: i < 3 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path
            d="M8 2.5C5.6 2.5 3.4 3.6 1.9 5.3L0.5 3.8C2.4 1.8 5.1 0.5 8 0.5s5.6 1.3 7.5 3.3l-1.4 1.5C12.6 3.6 10.4 2.5 8 2.5z"
            fill={cor}
          />
          <path
            d="M8 6.5c-1.2 0-2.3.5-3.1 1.3L3.5 6.4C4.8 5 6.3 4.5 8 4.5s3.2 1 4.5 1.9l-1.4 1.4C10.3 7 9.2 6.5 8 6.5z"
            fill={cor}
          />
          <circle cx="8" cy="10" r="1.5" fill={cor} />
        </svg>
        <div
          className="w-6 h-3 rounded-[3px] p-[1.5px] flex items-center"
          style={{ border: `1.5px solid ${cor}` }}
        >
          <div className="w-[70%] h-full rounded-[1px]" style={{ background: cor }} />
        </div>
      </div>
    </div>
  )
}

// Alias para compatibilidade
export const StatusBar = ({ light = true }: { light?: boolean }) => <BarraStatus claro={light} />
