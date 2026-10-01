import { Star, Edit2, Plus, Check } from 'lucide-react'
import { P, PD, PL, G, T1, T2, BD } from '@/constants/theme'
import { BackBtn } from '@/components/common'

interface PointsConversionScreenProps {
  back: () => void
}

export function PointsConversionScreen({ back }: PointsConversionScreenProps) {
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
            Conversão de pontos
          </h2>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <p style={{ fontSize: 14, color: T2, margin: '0 0 14px' }}>
          Defina como os pontos são trocados por desconto.
        </p>
        {[
          { pts: 500, d: 'R$ 10,00' },
          { pts: 1000, d: 'R$ 25,00' },
          { pts: 2000, d: 'R$ 60,00' },
        ].map((o) => (
          <div
            key={o.pts}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              border: `1px solid ${BD}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: PL,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Star size={22} color={P} fill={P} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: T1, margin: '0 0 2px' }}>
                {o.pts} pontos
              </p>
              <p style={{ fontSize: 14, color: G, fontWeight: 600, margin: 0 }}>
                = {o.d} de desconto
              </p>
            </div>
            <button
              style={{
                width: 34,
                height: 34,
                background: '#F3F4F6',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Edit2 size={15} color={T2} />
            </button>
          </div>
        ))}
        <button
          style={{
            width: '100%',
            padding: '12px',
            background: PL,
            borderRadius: 12,
            border: `1.5px dashed ${P}`,
            color: P,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 14,
          }}
        >
          <Plus size={18} color={P} /> Adicionar nova opção
        </button>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            border: `1px solid ${BD}`,
            marginBottom: 14,
          }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 600, color: T1, margin: '0 0 10px' }}>
            Regras da conversão
          </h4>
          {[
            'O cliente escolhe a opção de desconto',
            'O desconto é aplicado ao valor total da compra',
            'Os pontos não são convertidos em dinheiro',
          ].map((r) => (
            <div
              key={r}
              style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}
            >
              <Check size={16} color={G} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: T2, margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
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
          }}
        >
          Salvar conversão
        </button>
      </div>
    </div>
  )
}
