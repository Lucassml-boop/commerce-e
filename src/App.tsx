import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import { LoginForm } from './components/LoginForm'
import { ProductGrid } from './components/ProductGrid'
import { AdminPanel } from './components/AdminPanel'
import './App.css'

const AppContent: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const { user, loading } = useAuth()

  const handleLoginClick = () => {
    setShowLogin(true)
    setShowAdmin(false)
  }

  const handleAdminClick = () => {
    setShowAdmin(!showAdmin)
    setShowLogin(false)
  }

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (showLogin && !user) {
    return (
      <LoginForm 
        onToggleMode={handleToggleMode} 
        isLogin={isLoginMode}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={handleLoginClick} 
        onAdminClick={handleAdminClick}
        showingAdmin={showAdmin}
      />
      <main>
        {showAdmin ? <AdminPanel /> : <ProductGrid />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
