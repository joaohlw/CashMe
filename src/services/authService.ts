import { api } from './api'

export interface CustomerProfile {
  id: number
  fullName: string
  cpf?: string | null
  phone?: string | null
  authProvider?: string
  termsAcceptedAt?: string | null
  deviceToken?: string | null
}

export interface EstablishmentProfile {
  id: number
  fullName: string
  role: string
  establishmentId?: number | null
}

export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  userType?: 'CUSTOMER' | 'ESTABLISHMENT'
  status?: string
  lastLoginAt?: string | null
  initials?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  profile?: CustomerProfile | EstablishmentProfile
}

export interface SignupDTO {
  fullName: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface SignupCustomerDTO extends SignupDTO {
  cpf?: string
  phone?: string
  termsAccepted: boolean
  deviceToken?: string
}

export interface SignupEstablishmentDTO extends SignupDTO {
  role?: 'SUPER_ADMIN' | 'LOJISTA_ADMIN' | 'LOJISTA_OPERADOR'
  establishmentId?: number
}

export interface LoginDTO {
  email: string
  password: string
}

export const authService = {
  /**
   * Realiza login na API AdonisJS
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/login', credentials)
    return res.data || res
  },

  /**
   * Cadastra novo usuário genérico na API AdonisJS
   */
  async signup(data: SignupDTO): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/signup', data)
    return res.data || res
  },

  /**
   * Cadastra novo Consumidor na API AdonisJS (Task #02)
   */
  async signupCustomer(data: SignupCustomerDTO): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/customer/signup', data)
    return res.data || res
  },

  /**
   * Cadastra novo Lojista/Estabelecimento na API AdonisJS (Task #01)
   */
  async signupEstablishment(data: SignupEstablishmentDTO): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/establishment/signup', data)
    return res.data || res
  },

  /**
   * Busca perfil do usuário autenticado
   */
  async getProfile(): Promise<AuthUser> {
    const res = await api.get<any>('/account/profile')
    return res.data || res
  },

  /**
   * Busca perfil do Consumidor autenticado
   */
  async getCustomerProfile(): Promise<{ user: AuthUser; profile: CustomerProfile }> {
    const res = await api.get<any>('/account/customer/profile')
    return res.data || res
  },

  /**
   * Busca perfil do Lojista autenticado
   */
  async getEstablishmentProfile(): Promise<{ user: AuthUser; profile: EstablishmentProfile }> {
    const res = await api.get<any>('/account/establishment/profile')
    return res.data || res
  },

  /**
   * Encerra sessão e revoga o token no backend
   */
  async logout(): Promise<{ message: string }> {
    const res = await api.post<any>('/account/logout')
    return res.data || res
  },
}
