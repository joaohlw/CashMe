import {
  Search,
  MapPin,
  Coffee,
  ShoppingBag,
  Pill,
  Star,
  Shirt,
  Home,
  Settings,
  Layers,
} from 'lucide-react'
import { G, GD, T1, T2, BD } from '@/constants/theme'
import { BackBtn } from '@/components/common'
import type { ConsumerScreen } from '@/types/navigation'

interface CategoriesScreenProps {
  back: () => void
  go: (s: ConsumerScreen) => void
}

export function CategoriesScreen({ back, go }: CategoriesScreenProps) {
  const cats = [
    { name: 'Alimentação', Icon: Coffee, color: '#92400E', bg: '#FEF3C7' },
    { name: 'Bebidas', Icon: ShoppingBag, color: '#1E40AF', bg: '#DBEAFE' },
    { name: 'Farmácias', Icon: Pill, color: '#166534', bg: '#DCFCE7' },
    { name: 'Beleza e Saúde', Icon: Star, color: '#BE185D', bg: '#FCE7F3' },
    { name: 'Moda', Icon: Shirt, color: '#6B21A8', bg: '#F3E8FF' },
    { name: 'Casa e Decor.', Icon: Home, color: '#B45309', bg: '#FEF9C3' },
    { name: 'Serviços', Icon: Settings, color: '#0F766E', bg: '#CCFBF1' },
    { name: 'Outros', Icon: Layers, color: '#374151', bg: '#F3F4F6' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: '#fff', flexShrink: 0 }}>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackBtn onBack={back} />
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T1, margin: 0 }}>Categorias</h2>
        </div>
        <div
          style={{
            margin: '0 16px 12px',
            background: '#F3F4F6',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            gap: 10,
          }}
        >
          <Search size={16} color={T2} />
          <span style={{ fontSize: 14, color: '#9CA3AF' }}>Buscar categorias</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cats.map((cat) => (
            <button
              key={cat.name}
              onClick={() => go('stores')}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: `1px solid ${BD}`,
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: cat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <cat.Icon size={26} color={cat.color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T1 }}>{cat.name}</span>
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            background: `linear-gradient(135deg,${G},${GD})`,
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>
              Descubra novas lojas
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              na sua cidade!
            </p>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin size={22} color="#fff" />
          </div>
        </div>
      </div>
    </div>
  )
}
