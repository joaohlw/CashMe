import { P, PD, G, ERR, T1, T2, BD } from '@/constants/theme'
import { customers, history } from '@/data/mocks'
import { BackBtn } from '@/components/common'

interface CustomerDetailScreenProps {
  back: () => void
}

export function CustomerDetailScreen({ back }: CustomerDetailScreenProps) {
  const c = customers[0]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          background: `linear-gradient(135deg,${P},${PD})`,
          padding: '12px 16px 24px',
          flexShrink: 0,
        }}
      >
        <BackBtn onBack={back} light={false} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{c.name[0]}</span>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 5px' }}>
              {c.name}
            </h2>
            <span
              style={{
                fontSize: 12,
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                borderRadius: 20,
                padding: '3px 10px',
              }}
            >
              Cliente ativo
            </span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#F8F5FC' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            ['Total de compras', c.purchases],
            ['Pontos acumulados', `${c.pts} pts`],
            ['Pontos resgatados', '750 pts'],
            ['Última compra', c.last],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 14,
                border: `1px solid ${BD}`,
              }}
            >
              <p style={{ fontSize: 11, color: T2, margin: '0 0 4px' }}>{k}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: T1, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
        <div
          style={{ background: '#fff', borderRadius: 14, padding: 16, border: `1px solid ${BD}` }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 600, color: T1, margin: '0 0 12px' }}>
            Últimas movimentações
          </h4>
          {history.map((h) => (
            <div
              key={h.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: `1px solid ${BD}`,
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: T1, margin: '0 0 2px' }}>
                  {h.store}
                </p>
                <p style={{ fontSize: 11, color: T2, margin: 0 }}>
                  {h.date} · {h.value}
                </p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: h.type === 'earn' ? G : ERR }}>
                {h.pts} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
