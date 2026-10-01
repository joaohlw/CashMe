import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import { authService, type AuthUser, type LoginDTO, type SignupDTO } from '@/services'

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginDTO) => Promise<boolean>
  signup: (data: SignupDTO) => Promise<boolean>
  signupCustomer: (data: any) => Promise<boolean>
  signupEstablishment: (data: any) => Promise<boolean>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const TOKEN_KEY = '@cashme:token'
const USER_KEY = '@cashme:user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY)
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Valida e renova perfil ao iniciar
  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem(TOKEN_KEY)
      if (savedToken) {
        try {
          const profile = await authService.getProfile()
          setUser(profile)
          localStorage.setItem(USER_KEY, JSON.stringify(profile))
        } catch {
          // Token inválido ou expirado
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (credentials: LoginDTO): Promise<boolean> => {
    try {
      const response = await authService.login(credentials)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      toast.success(`Bem-vindo de volta, ${response.user.fullName || response.user.email}! 👋`)
      return true
    } catch (err: any) {
      toast.error(err.message || 'Credenciais inválidas.')
      return false
    }
  }

  const signup = async (data: SignupDTO): Promise<boolean> => {
    try {
      const response = await authService.signup(data)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      toast.success('Conta criada com sucesso! 🎉')
      return true
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta.')
      return false
    }
  }

  const signupCustomer = async (data: any): Promise<boolean> => {
    try {
      const response = await authService.signupCustomer(data)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      toast.success('Conta de Consumidor criada com sucesso! 🎉')
      return true
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta de consumidor.')
      return false
    }
  }

  const signupEstablishment = async (data: any): Promise<boolean> => {
    try {
      const response = await authService.signupEstablishment(data)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      toast.success('Conta de Lojista criada com sucesso! 🏪')
      return true
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta de estabelecimento.')
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Ignora erro de rede ao deslogar
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setToken(null)
      setUser(null)
      toast.info('Você saiu da sua conta.')
    }
  }

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
    } catch {
      // Falha ao recarregar
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        signupCustomer,
        signupEstablishment,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
