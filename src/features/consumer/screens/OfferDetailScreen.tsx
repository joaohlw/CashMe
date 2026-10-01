import { Star } from 'lucide-react'
import { G, GD, GL, GVL, GOLD, T1, T2, BG, BD } from '@/constants/theme'
import { offers } from '@/data/mocks'
import { BackBtn } from '@/components/common'
import type { ConsumerScreen } from '@/types/navigation'

interface OfferDetailScreenProps {
  back: () => void
  go: (s: ConsumerScreen) => void
}

export function OfferDetailScreen({ back, go }: OfferDetailScreenProps) {
  const o = offers[0]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onBack={back} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T1, margin: 0 }}>Detalhe da oferta</h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: BG }}>
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ height: 200, background: o.bg, position: 'relative' }}>
            <img
              src={o.img}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 4px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}
              >
                {o.pts} pts = {o.discount}
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                Válido até {o.valid}
              </p>
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
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T1, margin: '0 0 12px' }}>
            Detalhes da promoção
          </h3>
          {[
            ['Loja', o.store],
            ['Pontos necessários', `${o.pts} pts`],
            ['Desconto gerado', o.discount],
            ['Validade', o.valid],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}
            >
              <span style={{ fontSize: 13, color: T2 }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T1 }}>{v}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: GVL,
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            border: `1px solid ${GL}`,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Star size={16} color={GOLD} fill={GOLD} />
          <p style={{ fontSize: 13, color: GD, fontWeight: 600, margin: 0 }}>
            Você tem 1.250 pts disponíveis
          </p>
        </div>
        <button
          onClick={() => go('qr-code')}
          style={{
            width: '100%',
            padding: '14px',
            background: G,
            borderRadius: 12,
            border: 'none',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Resgatar oferta
        </button>
      </div>
    </div>
  )
}
