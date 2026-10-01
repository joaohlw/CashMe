import { useState } from 'react'
import { Check, Calendar } from 'lucide-react'
import { P, PD, PL, T1, T2, BD } from '@/constants/theme'
import { BackBtn, SwitchToggle, FormField } from '@/components/common'

interface NewCampaignScreenProps {
  back: () => void
}

export function NewCampaignScreen({ back }: NewCampaignScreenProps) {
  const [active, setActive] = useState(true)
  const [done, setDone] = useState(false)

  if (done)
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          background: '#F8F5FC',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: PL,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Check size={40} color={P} />
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: T1,
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          Campanha criada com sucesso!
        </h2>
        <p style={{ fontSize: 14, color: T2, textAlign: 'center', margin: '0 0 32px' }}>
          Sua campanha já está disponível para os clientes.
        </p>
        <button
          onClick={() => {
            setDone(false)
            back()
          }}
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
          Concluir
        </button>
      </div>
    )

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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Nova campanha</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <FormField label="Nome da campanha" placeholder="Ex.: Aniversário da Padaria" />
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
            style={{ fontSize: 13, fontWeight: 600, color: T1, display: 'block', marginBottom: 10 }}
          >
            Período da campanha
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: T2, margin: '0 0 5px' }}>Data inicial</p>
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
                <Calendar size={15} color={T2} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: T2, margin: '0 0 5px' }}>Data final</p>
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
                <span style={{ fontSize: 13, color: T1 }}>31/07/2026</span>
                <Calendar size={15} color={T2} />
              </div>
            </div>
          </div>
        </div>
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
            style={{ fontSize: 13, fontWeight: 600, color: T1, display: 'block', marginBottom: 12 }}
          >
            Como o cliente acumula pontos?
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <div
              style={{
                flex: 1,
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '10px 12px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: P }}>R$ 1,00</span>
            </div>
            <span style={{ fontSize: 13, color: T2 }}>gastos geram</span>
            <div
              style={{
                flex: 1,
                background: '#F9FAFB',
                borderRadius: 10,
                border: `1px solid ${BD}`,
                padding: '10px 12px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: P }}>1 pt</span>
            </div>
          </div>
          <div style={{ background: PL, borderRadius: 8, padding: '8px 12px' }}>
            <p style={{ fontSize: 12, color: PD, margin: 0 }}>
              A cada R$ 1,00 gasto, o cliente ganha 1 ponto.
            </p>
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
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: T1, margin: '0 0 2px' }}>
              Ativar campanha
            </p>
            <p style={{ fontSize: 12, color: T2, margin: 0 }}>Clientes podem acumular pontos</p>
          </div>
          <SwitchToggle on={active} onChange={() => setActive(!active)} />
        </div>
        <button
          onClick={() => setDone(true)}
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
          Criar campanha
        </button>
      </div>
    </div>
  )
}
