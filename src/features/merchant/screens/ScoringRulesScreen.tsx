import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { P, PD, PL, T1, T2, BD } from '@/constants/theme'
import { BackBtn, SwitchToggle } from '@/components/common'

interface ScoringRulesScreenProps {
  back: () => void
}

export function ScoringRulesScreen({ back }: ScoringRulesScreenProps) {
  const [noExpiry, setNoExpiry] = useState(false)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          background: `linear-gradient(135deg,${P},${PD})`,
          padding: '12px 16px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onBack={back} light={false} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>
            Regras de pontuação
          </h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <p style={{ fontSize: 14, color: T2, margin: '0 0 14px' }}>
          Defina como seus clientes acumulam pontos.
        </p>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            border: `1px solid ${BD}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: P, margin: '0 0 4px' }}>
                A cada R$ 1,00 gasto
              </p>
              <p style={{ fontSize: 14, color: T1, margin: 0 }}>
                o cliente ganha <strong>1 ponto</strong>
              </p>
            </div>
            <button
              style={{
                padding: '8px 14px',
                background: PL,
                borderRadius: 8,
                border: 'none',
                color: P,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Editar
            </button>
          </div>
        </div>
        {[
          { label: 'Pontos válidos por', val: '12 meses', sw: false },
          { label: 'Pts não expiram durante campanha', val: null, sw: true },
          { label: 'Limite de pontos por compra', val: '500 pts', sw: false },
          { label: 'Pontuação em aniversários', val: 'Dobrada', sw: false },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              border: `1px solid ${BD}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <p style={{ fontSize: 14, color: T1, margin: 0, flex: 1 }}>{item.label}</p>
            {item.sw ? (
              <SwitchToggle on={noExpiry} onChange={() => setNoExpiry(!noExpiry)} />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#F9FAFB',
                  borderRadius: 8,
                  padding: '6px 10px',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: T1 }}>{item.val}</span>
                <ChevronDown size={13} color={T2} />
              </div>
            )}
          </div>
        ))}
        <button
          style={{
            width: '100%',
            padding: '14px',
            background: P,
            borderRadius: 12,
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          Salvar regras
        </button>
      </div>
    </div>
  )
}
