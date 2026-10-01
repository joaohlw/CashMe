import {
  Edit2,
  Heart,
  BarChart2,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { G, GD, GVL, ERR, T1, T2, BG, BD } from '@/constants/theme'
import { BackBtn } from '@/components/common'
import { useAuth } from '@/context/AuthContext'

interface ProfileScreenProps {
  back: () => void
}

export function ProfileScreen({ back }: ProfileScreenProps) {
  const { user, logout } = useAuth()

  const displayName = user?.fullName || 'Leandro Bona'
  const displayEmail = user?.email || 'leandro.bona@email.com'
  const displayInitials = user?.initials || displayName.slice(0, 2).toUpperCase()

  const items = [
    { Icon: Edit2, label: 'Meus dados' },
    { Icon: Heart, label: 'Lojas favoritas' },
    { Icon: BarChart2, label: 'Histórico de pontos' },
    { Icon: Bell, label: 'Notificações' },
    { Icon: HelpCircle, label: 'Central de ajuda' },
    { Icon: Settings, label: 'Configurações' },
  ]

  const handleLogout = async () => {
    await logout()
    back()
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onBack={back} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T1, margin: 0 }}>Meu perfil</h2>
        </div>
        <div style={{ padding: '4px 16px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `linear-gradient(135deg,${G},${GD})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{displayInitials}</span>
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: T1, margin: '0 0 4px' }}>
              {displayName}
            </p>
            <p style={{ fontSize: 13, color: T2, margin: 0 }}>{displayEmail}</p>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px', background: BG }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${BD}`,
            marginBottom: 12,
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.label}
              style={{
                width: '100%',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                borderBottom: i < items.length - 1 ? `1px solid ${BD}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: GVL,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <item.Icon size={18} color={G} />
              </div>
              <span
                style={{ flex: 1, fontSize: 14, fontWeight: 500, color: T1, textAlign: 'left' }}
              >
                {item.label}
              </span>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#FEE2E2',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: '#FCA5A5',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={18} color={ERR} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: ERR }}>Sair da conta</span>
        </button>
      </div>
    </div>
  )
}
