import { useState } from 'react'
import { Home, Store, Wallet, Tag, QrCode, User } from 'lucide-react'
import type { ConsumerScreen } from '@/types/navigation'
import {
  HomeScreen,
  CategoriesScreen,
  StoresScreen,
  StoreDetailScreen,
  OffersScreen,
  OfferDetailScreen,
  WalletScreen,
  QRCodeScreen,
  ProfileScreen,
} from './screens'

const cTabs = [
  { id: 'home', label: 'Início', Icon: Home },
  { id: 'stores', label: 'Lojas', Icon: Store },
  { id: 'offers', label: 'Ofertas', Icon: Tag },
  { id: 'wallet', label: 'Carteira', Icon: Wallet },
  { id: 'qr-code', label: 'NFC-e & QR', Icon: QrCode },
  { id: 'profile', label: 'Perfil', Icon: User },
]

export function ConsumerApp() {
  const [tab, setTab] = useState<string>('home')
  const [screen, setScreen] = useState<ConsumerScreen>('home')

  function changeTab(t: string) {
    setTab(t)
    setScreen(t as ConsumerScreen)
  }

  function go(s: ConsumerScreen) {
    setScreen(s)
  }

  function back() {
    setScreen(tab as ConsumerScreen)
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#F9FAFB] min-h-full">
      {/* Sub-Header Navigation Tabs (Sleek & Compact) */}
      <div className="bg-white border-b border-gray-200/70 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
            {cTabs.map((item) => {
              const isActive =
                screen === item.id ||
                (tab === item.id &&
                  ['home', 'stores', 'offers', 'wallet', 'qr-code', 'profile'].includes(screen))
              const Icon = item.Icon
              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
          {screen === 'home' && <HomeScreen go={go} />}
          {screen === 'categories' && <CategoriesScreen back={back} go={go} />}
          {screen === 'stores' && <StoresScreen back={back} go={go} />}
          {screen === 'store-detail' && <StoreDetailScreen back={back} go={go} />}
          {screen === 'offers' && <OffersScreen back={back} go={go} />}
          {screen === 'offer-detail' && <OfferDetailScreen back={back} go={go} />}
          {screen === 'wallet' && <WalletScreen back={back} />}
          {screen === 'qr-code' && <QRCodeScreen back={back} />}
          {screen === 'profile' && <ProfileScreen back={back} />}
        </div>
      </main>
    </div>
  )
}
