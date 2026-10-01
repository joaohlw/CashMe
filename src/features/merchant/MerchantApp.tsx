import { useState } from 'react'
import { LayoutDashboard, Megaphone, QrCode, Users, Layers, Settings, Sliders } from 'lucide-react'
import type { MerchantScreen } from '@/types/navigation'
import {
  DashboardScreen,
  CampaignsScreen,
  NewCampaignScreen,
  ScoringRulesScreen,
  PointsConversionScreen,
  QRStoreScreen,
  CustomersScreen,
  CustomerDetailScreen,
  VitrineScreen,
  NewOfferScreen,
  SettingsScreen,
} from './screens'

const mTabs = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'campaigns', label: 'Campanhas', Icon: Megaphone },
  { id: 'scoring-rules', label: 'Regras de Pontos', Icon: Sliders },
  { id: 'qr-store', label: 'QR no Balcão', Icon: QrCode },
  { id: 'customers', label: 'Clientes', Icon: Users },
  { id: 'vitrine', label: 'Vitrine', Icon: Layers },
  { id: 'settings', label: 'Configurações', Icon: Settings },
]

export function MerchantApp() {
  const [screen, setScreen] = useState<MerchantScreen>('dashboard')

  function changeTab(t: string) {
    setScreen(t as MerchantScreen)
  }

  function go(s: MerchantScreen) {
    setScreen(s)
  }

  function back() {
    setScreen('dashboard')
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-purple-50/20 min-h-full">
      {/* Top Secondary Navigation for Merchant Web App (Sleek & Compact) */}
      <div className="bg-white border-b border-purple-100/70 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
            {mTabs.map((item) => {
              const isActive = screen === item.id
              const Icon = item.Icon
              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-800 text-white shadow-xs'
                      : 'text-gray-600 hover:text-purple-950 hover:bg-purple-50'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full">
          {screen === 'dashboard' && <DashboardScreen go={go} />}
          {screen === 'campaigns' && <CampaignsScreen go={go} />}
          {screen === 'new-campaign' && <NewCampaignScreen back={back} />}
          {screen === 'scoring-rules' && <ScoringRulesScreen back={back} />}
          {screen === 'points-conversion' && <PointsConversionScreen back={back} />}
          {screen === 'qr-store' && <QRStoreScreen />}
          {screen === 'customers' && <CustomersScreen go={go} />}
          {screen === 'customer-detail' && <CustomerDetailScreen back={back} />}
          {screen === 'vitrine' && <VitrineScreen go={go} />}
          {screen === 'new-offer' && <NewOfferScreen back={back} />}
          {screen === 'settings' && <SettingsScreen back={back} />}
        </div>
      </main>
    </div>
  )
}
