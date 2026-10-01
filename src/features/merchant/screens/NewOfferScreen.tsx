import { useState } from 'react'
import { ChevronDown, Calendar } from 'lucide-react'
import { P, PD, T1, T2, BD } from '@/constants/theme'
import { BackBtn, SwitchToggle, FormField } from '@/components/common'

interface NewOfferScreenProps {
  back: () => void
}

export function NewOfferScreen({ back }: NewOfferScreenProps) {
  const [active, setActive] = useState(true)

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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Nova oferta</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <FormField label="Nome da oferta" placeholder="Ex.: Pão francês" />
        <FormField label="Descrição" placeholder="Ex.: Leve 10, pague 8" />
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            marginBottom: 10,
            border: `1px solid ${BD}`,
          }}
        >
          <label
            style={{ fontSize: 13, fontWeight: 600, color: T1, display: 'block', marginBottom: 8 }}
          >
            Tipo de benefício
          </label>
          <div
            style={{
              background: '#F9FAFB',
              borderRadius: 10,
              border: `1px solid ${BD}`,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 14, color: T1 }}>Desconto em pontos</span>
            <ChevronDown size={16} color={T2} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${BD}`,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T1,
                display: 'block',
                marginBottom: 8,
              }}
            >
              Pontos
            </label>
            <div
              style={{
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '12px 14px',
              }}
            >
              <span style={{ fontSize: 14, color: T1, fontWeight: 600 }}>500 pts</span>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${BD}`,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T1,
                display: 'block',
                marginBottom: 8,
              }}
            >
              Desconto
            </label>
            <div
              style={{
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '12px 14px',
              }}
            >
              <span style={{ fontSize: 14, color: T1, fontWeight: 600 }}>R$ 10,00</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${BD}`,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T1,
                display: 'block',
                marginBottom: 8,
              }}
            >
              Início
            </label>
            <div
              style={{
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, color: T1 }}>01/07/2026</span>
              <Calendar size={14} color={T2} />
            </div>
          </div>
          <div
            style={{
              flex: 1,
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${BD}`,
            }}
          >
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: T1,
                display: 'block',
                marginBottom: 8,
              }}
            >
              Fim
            </label>
            <div
              style={{
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, color: T1 }}>30/07/2026</span>
              <Calendar size={14} color={T2} />
            </div>
          </div>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            border: `1px solid ${BD}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: T1, margin: 0 }}>
            Ativar oferta imediatamente
          </p>
          <SwitchToggle on={active} onChange={() => setActive(!active)} />
        </div>
        <button
          onClick={back}
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
          }}
        >
          Salvar oferta
        </button>
      </div>
    </div>
  )
}
