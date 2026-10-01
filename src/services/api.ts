/**
 * Cliente HTTP base para comunicação com a API AdonisJS
 */
const BASE_URL = '/api/v1'

interface RequestOptions extends RequestInit {
  data?: unknown
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options
  const token = localStorage.getItem('@cashme:token')

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    let errorData: any = null
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    const message = errorData?.message || errorData?.errors?.[0]?.message || 'Erro na requisição'
    throw new ApiError(message, response.status, errorData)
  }

  // Resposta 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', data }),
  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', data }),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),
}
