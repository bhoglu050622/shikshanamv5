export interface GraphyUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

export interface GraphyJWT {
  token: string
  expires_at: number
}

export interface GraphyCourse {
  id: string
  title: string
  description: string
  thumbnail: string
  progress: number
  is_completed: boolean
  last_accessed: string
}

export interface GraphyAuthResponse {
  success: boolean
  data: {
    user: GraphyUser
    jwt: GraphyJWT
  }
  message?: string
}

export interface GraphyCoursesResponse {
  success: boolean
  data: GraphyCourse[]
  message?: string
}

class GraphyAPI {
  private baseURL: string
  private merchantId: string
  private apiToken: string

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? (process.env.GRAPHY_BASE_URL || 'https://api.graphy.com')
      : 'http://localhost:3000/api/mock/graphy'
    
    this.merchantId = process.env.GRAPHY_MERCHANT_ID || 'hyperquest'
    this.apiToken = process.env.GRAPHY_API_TOKEN || '80c83322-69d7-429c-99f7-e5170767d818'
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Only add Graphy-specific headers in production
    if (process.env.NODE_ENV === 'production') {
      defaultHeaders['Authorization'] = `Bearer ${this.apiToken}`
      defaultHeaders['X-Merchant-ID'] = this.merchantId
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        // Add timeout for production requests
        signal: process.env.NODE_ENV === 'production' 
          ? AbortSignal.timeout(10000) // 10 second timeout
          : undefined,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Graphy API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error('Graphy API request failed:', error)
      throw error
    }
  }

  async authenticateWithEmail(email: string, password: string): Promise<GraphyAuthResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        merchant_id: this.merchantId,
      }),
    })
  }

  async authenticateWithGoogle(googleToken: string): Promise<GraphyAuthResponse> {
    return this.makeRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        google_token: googleToken,
        merchant_id: this.merchantId,
      }),
    })
  }

  async getUserCourses(jwtToken: string): Promise<GraphyCoursesResponse> {
    return this.makeRequest('/user/courses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    })
  }

  async refreshJWT(refreshToken: string): Promise<GraphyAuthResponse> {
    return this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
        merchant_id: this.merchantId,
      }),
    })
  }

  async validateJWT(jwtToken: string): Promise<{ valid: boolean; user?: GraphyUser }> {
    try {
      const response = await this.makeRequest('/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        },
      })
      return { valid: true, user: response.data.user }
    } catch (error) {
      console.error('JWT validation failed:', error)
      return { valid: false }
    }
  }
}

export const graphyAPI = new GraphyAPI()

// Utility functions for JWT handling
export function isJWTExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt * 1000
}

export function shouldRefreshJWT(expiresAt: number): boolean {
  // Refresh if JWT expires in the next 5 minutes
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000
  return expiresAt * 1000 <= fiveMinutesFromNow
}
