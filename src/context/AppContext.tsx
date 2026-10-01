import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import { transactionsService } from '@/services/transactionsService'
import { pointsService } from '@/services/pointsService'
import { useAuth } from './AuthContext'

interface AppContextType {
  // Estado do Consumidor
  userName: string
  userPoints: number
  addPoints: (amount: number, storeName: string) => void
  redeemPoints: (amount: number, storeName: string, establishmentId?: number) => Promise<boolean>
  refreshBalance: () => Promise<void>

  // Estado do Comerciante
  merchantStoreName: string
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [userName, setUserName] = useState<string>('Leandro')
  const [userPoints, setUserPoints] = useState<number>(1250)
  const [merchantStoreName] = useState<string>('Padaria Bella Vista')

  // Atualiza nome do usuário conforme login
  useEffect(() => {
    if (user?.fullName) {
      setUserName(user.fullName)
    } else if (user?.email) {
      setUserName(user.email.split('@')[0])
    }
  }, [user])

  // Busca saldo real da API quando logado
  const refreshBalance = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const balanceData = await pointsService.getBalance()
      if (balanceData && typeof balanceData.totalBalance === 'number') {
        setUserPoints(balanceData.totalBalance)
      }
    } catch {
      // Ignora erro silenciosamente caso a rota não esteja disponível
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  const addPoints = (amount: number, storeName: string) => {
    setUserPoints((prev) => {
      const next = prev + amount
      transactionsService.add({
        type: 'earn',
        store: storeName,
        pts: `+${amount} pts`,
        date: 'Hoje',
        value: `R$ ${(amount * 0.8).toFixed(2)}`,
        balance: `${next.toLocaleString('pt-BR')} pts`,
      })
      return next
    })
    toast.success(`+${amount} pontos acumulados em ${storeName}! 🎉`)
  }

  const redeemPoints = async (
    amount: number,
    storeName: string,
    establishmentId?: number
  ): Promise<boolean> => {
    if (userPoints < amount) {
      toast.error('Pontos insuficientes para este resgate!')
      return false
    }

    if (isAuthenticated && establishmentId) {
      try {
        await pointsService.redeem({
          establishmentId,
          pontos: amount,
          descricao: `Resgate em ${storeName}`,
        })
        await refreshBalance()
        toast.success(`Resgate de ${amount} pontos concluído com sucesso! 🏷️`)
        return true
      } catch (err: any) {
        toast.error(err.message || 'Erro ao efetuar resgate na API.')
        return false
      }
    }

    // Fallback local se deslogado
    setUserPoints((prev) => {
      const next = prev - amount
      transactionsService.add({
        type: 'redeem',
        store: storeName,
        pts: `-${amount} pts`,
        date: 'Hoje',
        value: 'Resgate',
        balance: `${next.toLocaleString('pt-BR')} pts`,
      })
      return next
    })
    toast.success(`Resgate de ${amount} pontos concluído com sucesso! 🏷️`)
    return true
  }

  return (
    <AppContext.Provider
      value={{
        userName,
        userPoints,
        addPoints,
        redeemPoints,
        refreshBalance,
        merchantStoreName,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider')
  }
  return context
}
