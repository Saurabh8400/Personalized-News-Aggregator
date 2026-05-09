import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, Loader } from 'lucide-react'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
          <h1 className={styles.heading}>Create account</h1>
          <p className={styles.sub}>Join Pulse for personalized news delivery</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Choose a username"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              required autoFocus minLength={3}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required minLength={6}
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <Loader size={16} className={styles.spinner} /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
