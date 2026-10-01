import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import App from './app/App'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AppProvider>
      <App />
      <Toaster position="top-center" richColors />
    </AppProvider>
  </AuthProvider>
)
