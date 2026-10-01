import { G, P } from '@/constants/theme'

export interface AvatarUsuarioProps {
  /** Nome do usuário para exibição da inicial */
  nome: string
  /** Tamanho em pixels (padrão: 42) */
  tamanho?: number
}

/**
 * Avatar circular de usuário com paleta de cores dinâmica
 */
export function AvatarUsuario({ nome, tamanho = 42 }: AvatarUsuarioProps) {
  const paleta = [G, P, '#1E40AF', '#B45309', '#9A3412']
  const fundo = paleta[nome.charCodeAt(0) % paleta.length]
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-xs"
      style={{
        width: tamanho,
        height: tamanho,
        background: fundo,
      }}
    >
      <span style={{ fontSize: tamanho * 0.4 }}>{nome[0]}</span>
    </div>
  )
}

// Alias para compatibilidade
export const UserAvatar = ({ name, size = 42 }: { name: string; size?: number }) => (
  <AvatarUsuario nome={name} tamanho={size} />
)
