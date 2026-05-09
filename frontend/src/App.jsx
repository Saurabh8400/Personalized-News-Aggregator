import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SavedPage from './pages/SavedPage'
import PreferencesPage from './pages/PreferencesPage'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',color:'var(--text-secondary)'}}>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
