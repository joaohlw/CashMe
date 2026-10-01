import { useState } from 'react'
import { WebNavbar, WebFooter } from '@/components/layout'
import { LandingScreen } from '@/features/landing'
import { ConsumerApp } from '@/features/consumer'
import { MerchantApp } from '@/features/merchant'
import type { AppMode } from '@/types/navigation'

export default function App() {
  const [mode, setMode] = useState<AppMode>('landing')

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Professional Web Navbar */}
      <WebNavbar mode={mode} onSelectMode={setMode} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {mode === 'landing' && <LandingScreen onSelect={setMode} />}
        {mode === 'consumer' && <ConsumerApp />}
        {mode === 'merchant' && <MerchantApp />}
      </div>

      {/* Footer */}
      <WebFooter />
    </div>
  )
}
