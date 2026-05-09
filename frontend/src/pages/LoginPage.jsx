import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, Loader } from 'lucide-react'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.grid} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logo}>
            <Zap size={22} fill="currentColor" />
            <span>Pulse</span>
          </div>
          <h1 className={styles.heading}>Welcome back</h1>
          <p className={styles.sub}>Sign in to your personalized news feed</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader size={16} className={styles.spinner} /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>Create one</Link>
        </p>

        <div className={styles.demoHint}>
          <strong>Demo:</strong> Register a new account to get started with mock news data.
        </div>
      </div>
    </div>
  )
}
