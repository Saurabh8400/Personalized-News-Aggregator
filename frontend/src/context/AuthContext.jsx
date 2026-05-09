import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

// Helper: extract the most meaningful error message from an Axios error
function extractError(err) {
  // Backend wraps errors as { success: false, message: "...", statusCode: N }
  const serverMsg = err.response?.data?.message
  if (serverMsg) return serverMsg
  if (err.message) return err.message
  return 'An unexpected error occurred'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch {
        // Corrupt storage — clear it
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password })
      // Backend returns ApiResponse<AuthResponse>: { success, message, data: { token, ... } }
      const payload = res.data?.data
      if (!payload || !payload.token) {
        throw new Error('Invalid response from server')
      }
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify(payload))
      api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
      setUser(payload)
      return payload
    } catch (err) {
      throw new Error(extractError(err))
    }
  }

  const register = async (username, email, password) => {
    try {
      const res = await api.post('/auth/register', { username, email, password })
      const payload = res.data?.data
      if (!payload || !payload.token) {
        throw new Error('Invalid response from server')
      }
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify(payload))
      api.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
      setUser(payload)
      return payload
    } catch (err) {
      throw new Error(extractError(err))
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
