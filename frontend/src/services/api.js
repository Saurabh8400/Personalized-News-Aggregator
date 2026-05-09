import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url || ''
    // Only redirect on 401 if it's NOT an auth endpoint (avoids infinite redirect on bad login)
    if (err.response?.status === 401 && !url.includes('/auth/')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    } else if (err.response?.status === 429) {
      console.warn('Rate limit exceeded')
    } else if (err.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }
    return Promise.reject(err)
  }
)

export default api
