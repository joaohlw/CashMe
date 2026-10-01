import { Users, Shield, Bell, FileText, HelpCircle, ChevronRight, LogOut } from 'lucide-react'
import { P, PD, ERR, T1, T2, BD } from '@/constants/theme'
import { BackBtn } from '@/components/common'

interface SettingsScreenProps {
  back: () => void
}

export function SettingsScreen({ back }: SettingsScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          background: `linear-gradient(135deg,${P},${PD})`,
          padding: '8px 16px 18px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onBack={back} light={false} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Configurações</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            border: `1px solid ${BD}`,
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T2,
              textTransform: 'uppercase',
              letterSpacing: 1,
              margin: '0 0 12px',
            }}
          >
            Dados da loja
          </p>
          {[
            ['Nome', 'Padaria Real'],
            ['Endereço', 'Rua das Flores, 123, Centro'],
            ['Categorias', 'Padaria, Confeitaria'],
            ['Telefone', '(44) 99999-9999'],
            ['E-mail', 'contato@padariareal.com'],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: `1px solid ${BD}`,
              }}
            >
              <span style={{ fontSize: 13, color: T2 }}>{k}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: T1,
                  maxWidth: '60%',
                  textAlign: 'right',
                }}
              >
                {v}
              </span>
            </div>
          ))}
          <button
            style={{
              width: '100%',
              padding: '12px',
              background: P,
              borderRadius: 10,
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Editar informações da loja
          </button>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            border: `1px solid ${BD}`,
            marginBottom: 12,
          }}
        >
          {[
            { Icon: Users, label: 'Gerenciar usuários', sub: '3 usuários cadastrados' },
            { Icon: Shield, label: 'Segurança', sub: null },
            { Icon: Bell, label: 'Notificações', sub: null },
            { Icon: FileText, label: 'Termos de uso', sub: null },
            { Icon: HelpCircle, label: 'Política de privacidade', sub: null },
          ].map((item, i, arr) => (
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
                borderBottom: i < arr.length - 1 ? `1px solid ${BD}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: '#F8F5FC',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <item.Icon size={18} color={P} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: T1, margin: 0 }}>{item.label}</p>
                {item.sub && <p style={{ fontSize: 12, color: T2, margin: 0 }}>{item.sub}</p>}
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>
          ))}
        </div>
        <button
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
          <span style={{ fontSize: 14, fontWeight: 600, color: ERR }}>Sair</span>
        </button>
      </div>
    </div>
  )
}
