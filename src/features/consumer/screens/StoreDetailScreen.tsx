import { useState } from 'react'
import { MapPin, Calendar } from 'lucide-react'
import { G, GL, GVL, T1, T2, BG, BD } from '@/constants/theme'
import { stores, offers } from '@/data/mocks'
import { BackBtn, SegControl, Row } from '@/components/common'
import type { ConsumerScreen } from '@/types/navigation'

interface StoreDetailScreenProps {
  back: () => void
  go: (s: ConsumerScreen) => void
}

export function StoreDetailScreen({ back, go }: StoreDetailScreenProps) {
  const [tab, setTab] = useState('offers')
  const s = stores[0]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          background: `linear-gradient(135deg,${s.color},#6B2F04)`,
          padding: '12px 16px 24px',
          flexShrink: 0,
        }}
      >
        <BackBtn onBack={back} light={false} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 12 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700, color: s.color }}>P</span>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              {s.name}
            </h2>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s.cat}</span>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.5)',
                }}
              />
              <MapPin size={12} color="rgba(255,255,255,0.8)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{s.loc}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          margin: '0 16px',
          marginTop: -18,
          zIndex: 1,
          background: '#fff',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          gap: 0,
          flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center', borderRight: `1px solid ${BD}` }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: G, margin: '0 0 2px' }}>{s.pts}</p>
          <p style={{ fontSize: 11, color: T2, margin: 0 }}>Seus pontos</p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: T1, margin: '0 0 2px' }}>1.000</p>
          <p style={{ fontSize: 11, color: T2, margin: 0 }}>Próximo resgate</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px 0', flexShrink: 0, background: BG }}>
        <SegControl
          tabs={[
            { id: 'offers', label: 'Ofertas' },
            { id: 'info', label: 'Sobre' },
            { id: 'rules', label: 'Pontos' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 16px', background: BG }}>
        {tab === 'offers' &&
          offers.map((o) => (
            <div
              key={o.id}
              onClick={() => go('offer-detail')}
              style={{
                background: '#fff',
                borderRadius: 14,
                marginBottom: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1px solid ${BD}`,
              }}
            >
              <div style={{ height: 80, background: o.bg, position: 'relative' }}>
                <img
                  src={o.img}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
                />
              </div>
              <div
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T1, margin: '0 0 2px' }}>
                    {o.pts} pts = {o.discount}
                  </p>
                  <p style={{ fontSize: 11, color: T2, margin: 0 }}>Válido até {o.valid}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    go('qr-code')
                  }}
                  style={{
                    padding: '8px 14px',
                    background: G,
                    borderRadius: 20,
                    border: 'none',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Resgatar
                </button>
              </div>
            </div>
          ))}
        {tab === 'info' && (
          <div
            style={{ background: '#fff', borderRadius: 14, padding: 16, border: `1px solid ${BD}` }}
          >
            <Row Icon={MapPin} title="Endereço" val="Rua das Flores, 123 – Centro" color={G} />
            <div style={{ borderTop: `1px solid ${BD}`, margin: '12px 0' }} />
            <Row Icon={Calendar} title="Horário" val="Seg–Sáb: 6h às 19h" color={G} />
          </div>
        )}
        {tab === 'rules' && (
          <div
            style={{ background: '#fff', borderRadius: 14, padding: 16, border: `1px solid ${BD}` }}
          >
            <div style={{ background: GVL, borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: G, margin: '0 0 4px' }}>
                Regra de acúmulo
              </p>
              <p style={{ fontSize: 13, color: T1, margin: 0 }}>{s.rule}</p>
            </div>
            <p style={{ fontSize: 13, color: T2, margin: 0, lineHeight: 1.6 }}>
              Pontos válidos por 12 meses. Mínimo de R$ 5,00 por compra para acumular pontos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
